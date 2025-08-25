import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { apiHandler, validateRequest } from '@/lib/api/utils'

// Get PayPal API base URL based on environment
const getPayPalBaseUrl = () => {
  const isSandbox = process.env.PAYPAL_SANDBOX === 'true'
  return isSandbox 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}

// Validation schema for order capture
const captureOrderSchema = z.object({
  orderID: z.string().min(1, 'Order ID is required'),
  userId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    variantId: z.string().optional(),
  })).optional(),
  billing: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  shippingAddress: z.object({
    recipient_name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country_code: z.string(),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  shippingRate: z.object({
    carrier: z.string(),
    service: z.string(),
    rate: z.number(),
    amount: z.number().optional(),
    serviceCode: z.string().optional(),
  }).optional(),
})

export const POST = apiHandler(async (request: NextRequest) => {
  // Validate request body
  const { data: input, error } = await validateRequest(request, captureOrderSchema)
  if (error) return error

  const { orderID, userId, items, billing, shippingAddress, shippingRate } = input

    // Get PayPal access token
    const accessToken = await getAccessToken()

    // Capture the order
    const response = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `capture-${orderID}-${Date.now()}`,
          'Prefer': 'return=representation'
        }
      }
    )

    const captureData = await response.json()

    if (!response.ok) {
      console.error('PayPal capture error:', captureData)
      throw new Error(captureData.message || 'Failed to capture payment')
    }

    // Verify the capture was successful
    if (captureData.status !== 'COMPLETED') {
      throw new Error(`Payment not completed. Status: ${captureData.status}`)
    }

    // Get the database client
    const supabase = await createClient()
    
    // Get or create user info
    let dbUserId = userId
    if (!dbUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      dbUserId = user?.id
    }
    
    // Extract capture details
    const captureDetails = captureData.purchase_units[0].payments.captures[0]
    const payerInfo = captureData.payer || {}
    
    // Start a transaction-like approach for order creation
    // Track what needs to be rolled back on failure
    
    try {
      // Create the order in our database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
        user_id: dbUserId,
        paypal_order_id: orderID,
        paypal_capture_id: captureDetails.id,
        status: 'paid',
        payment_status: captureData.status,
        total_cents: Math.round(parseFloat(captureDetails.amount.value) * 100),
        subtotal_cents: items ? Math.round(items.reduce((sum: number, item) => 
          sum + (item.price * item.quantity), 0
        )) : 0,
        shipping_cents: shippingRate ? Math.round(shippingRate.amount * 100) : 0,
        tax_cents: 0, // Will be calculated properly
        currency: captureDetails.amount.currency_code,
        shipping_carrier: shippingRate?.carrier || null,
        shipping_service: shippingRate?.service || null,
        shipping_service_code: shippingRate?.serviceCode || null,
        customer_email: payerInfo.email_address || billing?.email || null,
        customer_name: payerInfo.name ? 
          `${payerInfo.name.given_name} ${payerInfo.name.surname}` : 
          billing ? `${billing.firstName} ${billing.lastName}` : null,
        billing_address: billing ? {
          address: billing.address,
          city: billing.city,
          state: billing.state,
          postal_code: billing.zipCode,
          country: billing.country || 'US'
        } : null,
        shipping_address: captureData.purchase_units[0].shipping?.address ? {
          address_line_1: captureData.purchase_units[0].shipping.address.address_line_1,
          address_line_2: captureData.purchase_units[0].shipping.address.address_line_2,
          admin_area_2: captureData.purchase_units[0].shipping.address.admin_area_2,
          admin_area_1: captureData.purchase_units[0].shipping.address.admin_area_1,
          postal_code: captureData.purchase_units[0].shipping.address.postal_code,
          country_code: captureData.purchase_units[0].shipping.address.country_code
        } : shippingAddress ? {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country || 'US'
        } : null,
        payment_method: captureData.payment_source?.card ? 'card' : 'paypal',
        paid_at: new Date().toISOString()
      })
      .select()
      .single()

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`)
      }
      
      if (!order) {
        throw new Error('Order creation returned no data')
      }
      
      orderId = order.id

    // Save order items if we have them
    if (order && items && items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId || null,
        product_name: item.productName,
        quantity: item.quantity,
        price_cents: item.price,
        total_cents: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Failed to save order items:', itemsError)
      }

      // Update inventory (decrease stock)
      for (const item of items) {
        if (item.productId) {
          await supabase.rpc('decrease_product_stock', {
            p_product_id: item.productId,
            p_quantity: item.quantity
          }).catch((err: unknown) => console.error('Stock update failed:', err))
        }
      }
    }

    // Clear the user's cart if we have a user
    if (dbUserId) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', dbUserId)
        .single()

      if (cart) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id)
      }
    }

    // Send order to ShipStation for fulfillment
    if (order) {
      try {
        const shipStationResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shipping/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: order.id,
            orderNumber: `#${order.id}`,
            orderDate: order.created_at,
            orderStatus: 'awaiting_shipment',
            customerEmail: order.customer_email,
            customerName: order.customer_name,
            billTo: order.billing_address,
            shipTo: order.shipping_address || shippingAddress,
            items: items,
            shippingAmount: (shippingRate?.amount || 0) * 100, // Convert to cents
            taxAmount: order.tax_cents,
            amountPaid: order.total_cents,
            paymentMethod: order.payment_method,
            shippingMethod: shippingRate,
            internalNotes: `PayPal Order ID: ${orderID}`
          })
        })

        const shipStationData = await shipStationResponse.json()
        
        if (shipStationData.success) {
          // Update order with ShipStation order ID (V1 API)
          await supabase
            .from('orders')
            .update({
              shipstation_order_id: shipStationData.shipStationOrderId,
              shipstation_shipment_id: shipStationData.shipStationOrderNumber // Store order number as reference
            })
            .eq('id', order.id)
        } else if (shipStationData.shipmentId) {
          // Legacy V2 shipment ID (fallback)
          await supabase
            .from('orders')
            .update({
              shipstation_shipment_id: shipStationData.shipmentId
            })
            .eq('id', order.id)
        }
        
        console.log('ShipStation sync result:', shipStationData)
      } catch (shipStationError) {
        // Log but don't fail the order
        console.error('ShipStation sync error:', shipStationError)
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order?.id || orderID,
      paypalOrderId: orderID,
      captureId: captureDetails.id,
      status: captureData.status,
      amount: captureDetails.amount.value,
      currency: captureDetails.amount.currency_code
    })

  } catch (error) {
    console.error('Order capture error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to capture payment',
        details: error
      },
      { status: 500 }
    )
  }
})

// Helper function to get PayPal access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}