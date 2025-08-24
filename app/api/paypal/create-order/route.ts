import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayPalClient } from '@/lib/paypal/client'

export async function POST(request: NextRequest) {
  try {
    const { 
      items, 
      shipping, 
      tax, 
      total, 
      billing, 
      shippingAddress, 
      couponCode,
      subtotal 
    } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    // Get PayPal client
    const client = getPayPalClient()
    
    // Get authenticated user if available
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Handle coupon validation if provided
    let validatedCoupon = null
    let discountAmountCents = 0
    let finalTotal = total
    
    if (couponCode) {
      const productIds = items.map((item: any) => item.product_id).filter(Boolean)
      const subtotalCents = Math.round(parseFloat(subtotal || '0') * 100)
      
      // Validate coupon
      const { data: couponValidation, error: couponError } = await supabase.rpc('validate_coupon_usage', {
        p_coupon_code: couponCode,
        p_user_id: user?.id || null,
        p_order_total_cents: subtotalCents,
        p_product_ids: productIds,
        p_category_ids: [] // TODO: Extract from items if needed
      })
      
      if (couponError || !couponValidation?.[0]?.is_valid) {
        return NextResponse.json(
          { error: couponValidation?.[0]?.error_message || 'Invalid coupon code' },
          { status: 400 }
        )
      }
      
      validatedCoupon = couponValidation[0]
      discountAmountCents = validatedCoupon.discount_amount_cents
      finalTotal = (parseFloat(total) - (discountAmountCents / 100)).toFixed(2)
      
      if (parseFloat(finalTotal) < 0) {
        finalTotal = '0.00'
      }
    }
    
    // Prepare order items (including discount as negative line item if applicable)
    const orderItems = [...items.map((item: any) => ({
      name: item.name,
      unit_amount: {
        currency_code: 'USD',
        value: item.unit_amount.value
      },
      quantity: item.quantity.toString()
    }))]
    
    // Add discount as negative line item for PayPal (2025 best practice)
    if (discountAmountCents > 0) {
      orderItems.push({
        name: `Discount - ${couponCode}`,
        unit_amount: {
          currency_code: 'USD',
          value: `-${(discountAmountCents / 100).toFixed(2)}`
        },
        quantity: '1'
      })
    }
    
    // Calculate item total including discount
    const itemTotal = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.unit_amount.value) * item.quantity), 0
    ) - (discountAmountCents / 100)
    
    // Create order request following 2025 best practices
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: finalTotal,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: itemTotal.toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: shipping
            },
            tax_total: {
              currency_code: 'USD',
              value: tax
            },
            discount: discountAmountCents > 0 ? {
              currency_code: 'USD',
              value: (discountAmountCents / 100).toFixed(2)
            } : undefined
          }
        },
        items: orderItems,
        shipping: shippingAddress?.address ? {
          name: {
            full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`
          },
          address: {
            address_line_1: shippingAddress.address,
            admin_area_2: shippingAddress.city,
            admin_area_1: shippingAddress.state,
            postal_code: shippingAddress.zipCode,
            country_code: shippingAddress.country || 'US'
          }
        } : undefined
      }],
      application_context: {
        brand_name: 'Toynami Store',
        landing_page: 'NO_PREFERENCE',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`
      }
    }

    // Create order via PayPal API
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`,
        'PayPal-Request-Id': `toynami-${Date.now()}`, // Idempotency key
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderRequest)
    })

    const order = await response.json()

    if (!response.ok) {
      console.error('PayPal API error:', order)
      throw new Error(order.message || 'Failed to create PayPal order')
    }

    // Save order to database
    if (user) {
      const orderData = {
        user_id: user.id,
        status: 'pending',
        paypal_order_id: order.id,
        total_cents: Math.round(parseFloat(finalTotal) * 100),
        subtotal_cents: Math.round(items.reduce((sum: number, item: any) => 
          sum + (parseFloat(item.unit_amount.value) * item.quantity * 100), 0
        )),
        shipping_cents: Math.round(parseFloat(shipping) * 100),
        tax_cents: Math.round(parseFloat(tax) * 100),
        discount_amount_cents: discountAmountCents,
        currency: 'USD',
        customer_email: billing?.email || user?.email || null,
        billing_address: billing ? {
          name: `${billing.firstName} ${billing.lastName}`,
          address: billing.address,
          city: billing.city,
          state: billing.state,
          postal_code: billing.zipCode,
          country: billing.country || 'US'
        } : null,
        shipping_address: shippingAddress ? {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country || 'US'
        } : null,
        // Include coupon information if used
        ...(validatedCoupon && {
          coupon_id: validatedCoupon.coupon_id,
          coupon_code: couponCode
        })
      }

      const { data: savedOrder, error: dbError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single()

      if (dbError) {
        console.error('Failed to save order:', dbError)
        // Don't fail the PayPal order creation if DB save fails
      } else if (validatedCoupon && savedOrder) {
        // Record coupon usage
        const { error: usageError } = await supabase.rpc('record_coupon_usage', {
          p_coupon_id: validatedCoupon.coupon_id,
          p_user_id: user.id,
          p_order_id: savedOrder.id,
          p_discount_amount_cents: discountAmountCents,
          p_order_total_cents: Math.round(parseFloat(finalTotal) * 100),
          p_paypal_order_id: order.id,
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          p_user_agent: request.headers.get('user-agent')
        })
        
        if (usageError) {
          console.error('Failed to record coupon usage:', usageError)
          // Continue anyway - PayPal order is created
        }
      }
    }

    return NextResponse.json({ 
      id: order.id,
      status: order.status,
      links: order.links
    })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}

// Helper function to get PayPal access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  const data = await response.json()
  return data.access_token
}