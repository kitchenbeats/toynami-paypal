import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayPalClient } from '@/lib/paypal/client'
import { 
  OrderRequest,
  CheckoutPaymentIntent,
  AmountWithBreakdown,
  PurchaseUnitRequest
} from '@paypal/paypal-server-sdk'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, shipping = 0, tax = 0 } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )
    const total = subtotal + shipping + tax

    // Create order with PayPal SDK
    const client = getPayPalClient()
    
    const amountWithBreakdown: AmountWithBreakdown = {
      currencyCode: 'USD',
      value: total.toFixed(2),
      breakdown: {
        itemTotal: {
          currencyCode: 'USD',
          value: subtotal.toFixed(2),
        },
        shipping: {
          currencyCode: 'USD',
          value: shipping.toFixed(2),
        },
        taxTotal: {
          currencyCode: 'USD',
          value: tax.toFixed(2),
        },
      },
    }

    const purchaseUnit: PurchaseUnitRequest = {
      amount: amountWithBreakdown,
      items: items.map((item: any) => ({
        name: item.name,
        unitAmount: {
          currencyCode: 'USD',
          value: item.price.toFixed(2),
        },
        quantity: item.quantity.toString(),
      })),
    }

    const orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [purchaseUnit],
      applicationContext: {
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
        shippingPreference: 'SET_PROVIDED_ADDRESS',
        userAction: 'PAY_NOW',
      },
    }

    const { body: order } = await client.orders.ordersCreate({
      body: orderRequest,
      prefer: 'return=representation'
    })

    if (!order || !order.id) {
      throw new Error('Failed to create PayPal order')
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

    return NextResponse.json({ 
      orderId: order.id,
      status: order.status 
    })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}