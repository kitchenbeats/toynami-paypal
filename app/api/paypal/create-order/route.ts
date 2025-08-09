import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAYPAL_API_BASE = process.env.PAYPAL_SANDBOX === 'true' 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com'

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, shipping, tax } = await request.json()

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )
    const total = subtotal + shipping + tax

    const accessToken = await getAccessToken()

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: subtotal.toFixed(2),
            },
            shipping: {
              currency_code: 'USD',
              value: shipping.toFixed(2),
            },
            tax_total: {
              currency_code: 'USD',
              value: tax.toFixed(2),
            },
          },
        },
        items: items.map((item: any) => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2),
          },
          quantity: item.quantity.toString(),
        })),
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
      },
    }

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (!response.ok) {
      throw new Error(order.message || 'Failed to create PayPal order')
    }

    // Save order to database
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        paypal_order_id: order.id,
        total_cents: Math.round(total * 100),
        subtotal_cents: Math.round(subtotal * 100),
        shipping_cents: Math.round(shipping * 100),
        tax_cents: Math.round(tax * 100),
        currency: 'USD',
      })

    if (dbError) {
      console.error('Failed to save order:', dbError)
    }

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}