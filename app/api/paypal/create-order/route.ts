import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayPalClient } from '@/lib/paypal/client'

export async function POST(request: NextRequest) {
  try {
    const { items, shipping, tax, total, billing, shippingAddress } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    // Get PayPal client
    const client = getPayPalClient()
    
    // Create order request following 2025 best practices
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: items.reduce((sum: number, item: any) => 
                sum + (parseFloat(item.unit_amount.value) * item.quantity), 0
              ).toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: shipping
            },
            tax_total: {
              currency_code: 'USD',
              value: tax
            }
          }
        },
        items: items.map((item: any) => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD',
            value: item.unit_amount.value
          },
          quantity: item.quantity.toString()
        })),
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

    // Get authenticated user if available
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Save order to database
    if (user) {
      const { error: dbError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          paypal_order_id: order.id,
          total_cents: Math.round(parseFloat(total) * 100),
          subtotal_cents: Math.round(items.reduce((sum: number, item: any) => 
            sum + (parseFloat(item.unit_amount.value) * item.quantity * 100), 0
          )),
          shipping_cents: Math.round(parseFloat(shipping) * 100),
          tax_cents: Math.round(parseFloat(tax) * 100),
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
          } : null
        })

      if (dbError) {
        console.error('Failed to save order:', dbError)
        // Don't fail the PayPal order creation if DB save fails
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