import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayPalClient } from '@/lib/paypal/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Capture order with PayPal SDK
    const client = getPayPalClient()
    
    const { body: captureData } = await client.orders.ordersCapture({
      id: orderId,
      prefer: 'return=representation'
    })

    if (!captureData || captureData.status !== 'COMPLETED') {
      throw new Error('Failed to capture PayPal order')
    }

    // Update order status in database
    const { error: dbError } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        paypal_capture_id: captureData.id,
        paid_at: new Date().toISOString()
      })
      .eq('paypal_order_id', orderId)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Failed to update order status:', dbError)
    }

    // Clear the user's cart
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (cart) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)
    }

    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      status: captureData.status,
      purchaseUnits: captureData.purchaseUnits,
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    )
  }
}