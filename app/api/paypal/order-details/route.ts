import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayPalClient } from '@/lib/paypal/client'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Get order details from PayPal SDK
    const client = getPayPalClient()
    
    const { body: order } = await client.orders.ordersGet({
      id: orderId
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify order belongs to user
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('paypal_order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (!dbOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        createTime: order.createTime,
        updateTime: order.updateTime,
        purchaseUnits: order.purchaseUnits,
        payer: order.payer,
        links: order.links
      },
      dbOrder
    })
  } catch (error) {
    console.error('PayPal order details error:', error)
    return NextResponse.json(
      { error: 'Failed to get order details' },
      { status: 500 }
    )
  }
}