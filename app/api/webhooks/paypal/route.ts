import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

interface PayPalWebhookPayload {
  event_type: string
  resource: Record<string, unknown>
  id?: string
  create_time?: string
  resource_type?: string
  summary?: string
}

// PayPal webhook verification and event processing
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paypal-transmission-signature')
    const certId = request.headers.get('paypal-cert-id')
    const authAlgo = request.headers.get('paypal-auth-algo')
    const transmissionId = request.headers.get('paypal-transmission-id')
    const transmissionTime = request.headers.get('paypal-transmission-time')

    // Parse the webhook payload
    let payload
    try {
      payload = JSON.parse(body)
    } catch (error) {
      console.error('Invalid JSON payload:', error)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    // Verify webhook signature (optional but recommended for production)
    if (process.env.NODE_ENV === 'production') {
      const isValid = await verifyPayPalWebhookSignature({
        body,
        signature,
        certId,
        authAlgo,
        transmissionId,
        transmissionTime,
        webhookId: process.env.PAYPAL_WEBHOOK_ID
      })

      if (!isValid) {
        console.error('Invalid PayPal webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Use service client for webhook processing
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Log the webhook event
    const { error: logError } = await supabase
      .from('paypal_webhooks')
      .insert({
        event_id: payload.id,
        event_type: payload.event_type,
        resource_type: payload.resource_type,
        resource_id: payload.resource?.id,
        summary: payload.summary,
        payload: payload,
        processed: false
      })

    if (logError && logError.code !== '23505') { // Ignore duplicate key errors
      console.error('Failed to log webhook event:', logError)
    }

    // Process the webhook event
    await processWebhookEvent(payload, supabase)

    // Mark as processed
    await supabase
      .from('paypal_webhooks')
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString() 
      })
      .eq('event_id', payload.id)

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('PayPal webhook processing error:', error)
    
    // Try to log the error if we have the event ID
    if (request.url) {
      try {
        const body = await request.text()
        const payload = JSON.parse(body)
        
        const supabase = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        await supabase
          .from('paypal_webhooks')
          .update({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            processed_at: new Date().toISOString()
          })
          .eq('event_id', payload.id)
      } catch (logError) {
        console.error('Failed to log webhook error:', logError)
      }
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Process different types of PayPal webhook events
async function processWebhookEvent(payload: PayPalWebhookPayload, supabase: SupabaseClient) {
  const eventType = payload.event_type
  const resource = payload.resource

  console.log(`Processing PayPal webhook: ${eventType}`)

  switch (eventType) {
    case 'CHECKOUT.ORDER.COMPLETED':
    case 'PAYMENT.CAPTURE.COMPLETED':
      await handleOrderCompleted(resource, supabase)
      break

    case 'CHECKOUT.ORDER.CANCELLED':
    case 'PAYMENT.CAPTURE.DENIED':
      await handleOrderCancelled(resource, supabase)
      break

    case 'CHECKOUT.ORDER.APPROVED':
      await handleOrderApproved(resource, supabase)
      break

    case 'PAYMENT.CAPTURE.REFUNDED':
      await handlePaymentRefunded(resource, supabase)
      break

    case 'BILLING.SUBSCRIPTION.CREATED':
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.CANCELLED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
      await handleSubscriptionEvent(resource, eventType, supabase)
      break

    default:
      console.log(`Unhandled webhook event type: ${eventType}`)
  }
}

// Handle completed orders/payments
async function handleOrderCompleted(resource: Record<string, unknown>, supabase: SupabaseClient) {
  const orderId = resource.id || resource.supplementary_data?.related_ids?.order_id
  
  if (!orderId) {
    console.error('No order ID found in completed payment webhook')
    return
  }

  // Update order status in database
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'completed',
      paypal_status: 'COMPLETED',
      paypal_capture_id: resource.id,
      updated_at: new Date().toISOString()
    })
    .eq('paypal_order_id', orderId)

  if (error) {
    console.error('Failed to update order status:', error)
    throw error
  }

  console.log(`Order ${orderId} marked as completed`)

  // Handle coupon analytics update if order used a coupon
  const { data: orderData } = await supabase
    .from('orders')
    .select('coupon_id, discount_amount_cents, user_id')
    .eq('paypal_order_id', orderId)
    .single()

  if (orderData?.coupon_id) {
    // Update coupon usage analytics
    await updateCouponAnalytics(orderData.coupon_id, supabase)
    console.log(`Updated coupon analytics for coupon ${orderData.coupon_id}`)
  }
}

// Handle cancelled orders
async function handleOrderCancelled(resource: Record<string, unknown>, supabase: SupabaseClient) {
  const orderId = resource.id || resource.supplementary_data?.related_ids?.order_id
  
  if (!orderId) {
    console.error('No order ID found in cancelled payment webhook')
    return
  }

  // Update order status and potentially reverse coupon usage
  const { data: orderData, error: fetchError } = await supabase
    .from('orders')
    .select('id, coupon_id, user_id')
    .eq('paypal_order_id', orderId)
    .single()

  if (fetchError) {
    console.error('Failed to fetch order for cancellation:', fetchError)
    return
  }

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      paypal_status: 'CANCELLED',
      updated_at: new Date().toISOString()
    })
    .eq('paypal_order_id', orderId)

  if (error) {
    console.error('Failed to update cancelled order:', error)
    throw error
  }

  // Remove coupon usage record if order was cancelled
  if (orderData?.coupon_id) {
    await supabase
      .from('coupon_usage')
      .delete()
      .eq('order_id', orderData.id)

    // Update coupon usage count
    await supabase
      .from('coupons')
      .update({ 
        usage_count: supabase.raw('usage_count - 1'),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderData.coupon_id)

    console.log(`Reversed coupon usage for cancelled order ${orderId}`)
  }

  console.log(`Order ${orderId} marked as cancelled`)
}

// Handle approved orders (before completion)
async function handleOrderApproved(resource: Record<string, unknown>, supabase: SupabaseClient) {
  const orderId = resource.id
  
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'approved',
      paypal_status: 'APPROVED',
      paypal_payer_id: resource.payer?.payer_id,
      updated_at: new Date().toISOString()
    })
    .eq('paypal_order_id', orderId)

  if (error) {
    console.error('Failed to update order approval:', error)
  } else {
    console.log(`Order ${orderId} marked as approved`)
  }
}

// Handle payment refunds
async function handlePaymentRefunded(resource: Record<string, unknown>, supabase: SupabaseClient) {
  const captureId = resource.id
  
  // Find order by capture ID
  const { data: orderData, error: fetchError } = await supabase
    .from('orders')
    .select('id, paypal_order_id, coupon_id')
    .eq('paypal_capture_id', captureId)
    .single()

  if (fetchError) {
    console.error('Failed to find order for refund:', fetchError)
    return
  }

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'refunded',
      paypal_status: 'REFUNDED',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderData.id)

  if (error) {
    console.error('Failed to update refunded order:', error)
  }

  console.log(`Order ${orderData.paypal_order_id} marked as refunded`)
}

// Handle subscription events
async function handleSubscriptionEvent(resource: Record<string, unknown>, eventType: string, supabase: SupabaseClient) {
  const subscriptionId = resource.id
  const status = eventType.split('.').pop()?.toLowerCase()

  const { error } = await supabase
    .from('orders')
    .update({
      paypal_status: status?.toUpperCase(),
      updated_at: new Date().toISOString()
    })
    .eq('paypal_subscription_id', subscriptionId)

  if (error) {
    console.error(`Failed to update subscription ${subscriptionId}:`, error)
  } else {
    console.log(`Subscription ${subscriptionId} status updated to ${status}`)
  }
}

// Update coupon analytics
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateCouponAnalytics(couponId: string, _supabase: SupabaseClient) {
  // This is handled by the database view, but we could add additional analytics here
  // For example, tracking conversion rates, popular coupons, etc.
  console.log(`Coupon analytics updated for coupon ${couponId}`)
}

// Verify PayPal webhook signature (simplified version)
async function verifyPayPalWebhookSignature({
  body,
  signature,
  certId,
  authAlgo,
  transmissionId,
  transmissionTime,
  webhookId
}: {
  body: string
  signature?: string | null
  certId?: string | null
  authAlgo?: string | null
  transmissionId?: string | null
  transmissionTime?: string | null
  webhookId?: string
}) {
  // Basic validation - ensure required parameters are present
  if (!signature || !certId || !transmissionId || !transmissionTime || !webhookId) {
    console.warn('Missing required webhook signature parameters')
    return false
  }

  // Log the signature verification attempt for debugging
  console.log('PayPal webhook signature verification:', {
    certId: certId.substring(0, 8) + '...',
    authAlgo,
    transmissionId: transmissionId.substring(0, 8) + '...',
    hasSignature: !!signature,
    hasBody: !!body
  })

  // In production, implement proper PayPal signature verification
  // This would involve:
  // 1. Fetching the PayPal certificate using the cert ID
  // 2. Creating the expected signature using the webhook ID, transmission time, body, etc.
  // 3. Comparing with the provided signature using the specified algorithm
  
  // For now, if we have all required parameters, consider it valid
  // TODO: Implement cryptographic signature verification for production
  return true
}