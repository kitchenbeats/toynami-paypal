import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import {} from 'next/'

/**
 * ShipStation Webhook Handler
 * 
 * Handles webhook notifications from ShipStation for order/shipment updates.
 * Common webhook events:
 * - ITEM_ORDER_NOTIFY (Order created/updated)
 * - ITEM_SHIP_NOTIFY (Order shipped)
 * - ITEM_DELIVERY_NOTIFY (Order delivered)
 * 
 * Setup: Configure this URL in your ShipStation webhook settings:
 * https://yourdomain.com/api/webhooks/shipstation
 */

interface ShipStationWebhookPayload {
  _resource_url: string
  resource_type: string
  event_type?: string
  order_id?: number
  order_number?: string
  tracking_number?: string
  carrier_code?: string
  service_code?: string
  ship_date?: string
  delivery_date?: string
  status?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload: ShipStationWebhookPayload = await request.json()
    console.log('ShipStation webhook received:', payload)

    // Get Supabase client
    const supabase = await createClient()

    // Extract key information from payload
    const {
      resource_type,
      order_id,
      order_number,
      tracking_number,
      carrier_code,
      service_code,
      ship_date,
      delivery_date,
      status
    } = payload

    // Find the order in our database
    // We can search by either ShipStation order ID or order number
    let order = null
    
    if (order_id) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('shipstation_order_id', order_id.toString())
        .single()
      order = data
    }
    
    if (!order && order_number) {
      // Try to find by order number (format: #123 or 123)
      const cleanOrderNumber = order_number.replace('#', '')
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${cleanOrderNumber},shipstation_shipment_id.eq.${order_number}`)
        .single()
      order = data
    }

    if (!order) {
      console.warn(`Order not found for ShipStation webhook: order_id=${order_id}, order_number=${order_number}`)
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }

    // Process different webhook events
    switch (resource_type) {
      case 'ITEM_SHIP_NOTIFY':
        await handleShipNotification(supabase, order.id, {
          tracking_number,
          carrier_code,
          service_code,
          ship_date,
          status: 'shipped'
        })
        break

      case 'ITEM_DELIVERY_NOTIFY':
        await handleDeliveryNotification(supabase, order.id, {
          tracking_number,
          delivery_date,
          status: 'delivered'
        })
        break

      case 'ITEM_ORDER_NOTIFY':
        await handleOrderUpdate(supabase, order.id, {
          status,
          tracking_number,
          carrier_code,
          service_code
        })
        break

      default:
        console.log(`Unhandled webhook resource_type: ${resource_type}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('ShipStation webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle ship notification (order was shipped)
 */
async function handleShipNotification(
  supabase: SupabaseClient, 
  orderId: number, 
  data: {
    tracking_number?: string
    carrier_code?: string
    service_code?: string
    ship_date?: string
    status: string
  }
) {
  const updates: Record<string, unknown> = {
    status: 'shipped',
    shipped_at: data.ship_date ? new Date(data.ship_date).toISOString() : new Date().toISOString()
  }

  if (data.tracking_number) {
    updates.tracking_number = data.tracking_number
  }
  
  if (data.carrier_code) {
    updates.shipping_carrier = data.carrier_code
  }
  
  if (data.service_code) {
    updates.shipping_service_code = data.service_code
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update order with shipping info:', error)
    throw error
  }

  console.log(`Order ${orderId} marked as shipped with tracking: ${data.tracking_number}`)

  // TODO: Send shipping notification email to customer
  // await sendShippingNotificationEmail(order, trackingNumber)
}

/**
 * Handle delivery notification (order was delivered)
 */
async function handleDeliveryNotification(
  supabase: SupabaseClient, 
  orderId: number, 
  data: {
    tracking_number?: string
    delivery_date?: string
    status: string
  }
) {
  const updates: Record<string, unknown> = {
    status: 'delivered',
    delivered_at: data.delivery_date ? new Date(data.delivery_date).toISOString() : new Date().toISOString()
  }

  if (data.tracking_number) {
    updates.tracking_number = data.tracking_number
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update order with delivery info:', error)
    throw error
  }

  console.log(`Order ${orderId} marked as delivered`)

  // TODO: Send delivery confirmation email to customer
  // await sendDeliveryConfirmationEmail(order)
}

/**
 * Handle general order updates
 */
async function handleOrderUpdate(
  supabase: SupabaseClient, 
  orderId: number, 
  data: {
    status?: string
    tracking_number?: string
    carrier_code?: string
    service_code?: string
  }
) {
  const updates: Record<string, unknown> = {}

  // Map ShipStation status to our internal status
  if (data.status) {
    const statusMap: Record<string, string> = {
      'awaiting_payment': 'pending',
      'awaiting_shipment': 'paid',
      'shipped': 'shipped',
      'on_hold': 'on_hold',
      'cancelled': 'cancelled'
    }
    updates.status = statusMap[data.status] || data.status
  }

  if (data.tracking_number) {
    updates.tracking_number = data.tracking_number
  }
  
  if (data.carrier_code) {
    updates.shipping_carrier = data.carrier_code
  }
  
  if (data.service_code) {
    updates.shipping_service_code = data.service_code
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)

    if (error) {
      console.error('Failed to update order:', error)
      throw error
    }

    console.log(`Order ${orderId} updated:`, updates)
  }
}

// Handle GET requests for webhook verification (if needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    // Some webhook providers require echo verification
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({ 
    message: 'ShipStation webhook endpoint active',
    timestamp: new Date().toISOString()
  })
}