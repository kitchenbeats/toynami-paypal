import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client, ShipStationV1Client } from '@/lib/shipstation/v1-client'

export async function POST(request: NextRequest) {
  try {
    console.log('Test order endpoint called')
    const supabase = await createClient()
    
    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No authenticated user')
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }
    
    console.log('User authenticated:', user.email)

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get a real product from the database - prefer products with SKU
    let { data: product } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        base_price_cents,
        weight
      `)
      .eq('status', 'active')
      .eq('is_visible', true)
      .is('deleted_at', null)
      .not('sku', 'is', null)
      .neq('sku', '')
      .limit(1)
      .single()

    // If no active visible product with SKU, try without SKU requirement
    if (!product) {
      const { data: anyActive } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          base_price_cents,
          weight
        `)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(1)
        .single()
      
      product = anyActive
    }

    // If still no product, try ANY product
    if (!product) {
      const { data: anyProduct } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          base_price_cents,
          weight
        `)
        .is('deleted_at', null)
        .limit(1)
        .single()
      
      product = anyProduct
    }

    if (!product) {
      console.error('No products found in database for testing')
      return NextResponse.json({ 
        error: 'No products available for testing. Please add at least one product to the database.' 
      }, { status: 400 })
    }

    // Use base product information
    const price = product.base_price_cents || 1999
    const sku = product.sku || `TEST-${product.id?.slice(0, 8)}`
    const productName = product.name
    const weight = product.weight || 1

    // Create test order number
    const testOrderNumber = `TEST-${Date.now()}`

    // Create test order in database first
    const { data: testOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'paid',
        order_number: testOrderNumber,
        total_cents: price + 500, // Add $5 shipping
        subtotal_cents: price,
        shipping_cents: 500,
        tax_cents: 0,
        paypal_order_id: `TEST-PAYPAL-${Date.now()}`,
        ship_to: {
          name: 'Test Customer',
          street1: '123 Test Street',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'US',
          phone: '555-555-5555'
        },
        bill_to: {
          name: 'Test Customer',
          street1: '123 Test Street',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'US',
          phone: '555-555-5555'
        },
        internal_notes: '🧪 TEST ORDER - Safe to delete'
      })
      .select()
      .single()

    if (orderError || !testOrder) {
      console.error('Failed to create test order in database:', orderError)
      return NextResponse.json({ 
        error: 'Failed to create test order in database',
        details: orderError 
      }, { status: 500 })
    }

    // Add order item
    await supabase
      .from('order_items')
      .insert({
        order_id: testOrder.id,
        product_id: product.id,
        quantity: 1,
        price_cents: price
      })

    // Create order in ShipStation
    const client = getShipStationV1Client()
    
    const shipStationOrder = ShipStationV1Client.formatOrder({
      orderId: parseInt(testOrder.id.slice(0, 8), 16), // Convert UUID to number
      orderNumber: testOrderNumber,
      orderDate: new Date().toISOString(),
      orderStatus: 'awaiting_shipment',
      customerEmail: 'test@toynami.com',
      customerName: 'Test Customer',
      billTo: testOrder.bill_to,
      shipTo: testOrder.ship_to,
      items: [{
        productId: product.id,
        sku: sku,
        name: productName,
        productName: productName,
        quantity: 1,
        price: price,
        weight: weight
      }],
      orderTotal: testOrder.total_cents,
      amountPaid: testOrder.total_cents,
      shippingAmount: testOrder.shipping_cents,
      taxAmount: testOrder.tax_cents,
      paymentMethod: 'Test Payment',
      internalNotes: '🧪 TEST ORDER - Created from admin panel. Safe to delete.',
      customerNotes: 'This is a test order for ShipStation integration testing.'
    })

    const response = await client.createOrder(shipStationOrder)

    if (!response.success) {
      // Update order with error
      await supabase
        .from('orders')
        .update({ 
          internal_notes: `${testOrder.internal_notes}\nShipStation Error: ${response.error}` 
        })
        .eq('id', testOrder.id)

      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to create order in ShipStation',
        orderId: testOrder.id,
        orderNumber: testOrderNumber,
        rateLimitRemaining: response.rateLimitRemaining
      }, { status: 500 })
    }

    // Update order with ShipStation ID
    await supabase
      .from('orders')
      .update({
        shipstation_order_id: response.data?.orderId?.toString(),
        last_synced_at: new Date().toISOString()
      })
      .eq('id', testOrder.id)

    // Log sync
    await supabase
      .from('shipstation_sync_logs')
      .insert({
        order_id: testOrder.id,
        action: 'create_test',
        success: true,
        response_data: response.data,
        rate_limit_remaining: response.rateLimitRemaining,
        created_by: user.id
      })

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: {
        id: testOrder.id,
        orderNumber: testOrderNumber,
        shipStationOrderId: response.data?.orderId,
        product: productName,
        price: price / 100,
        total: testOrder.total_cents / 100
      },
      shipstation: response.data,
      rateLimitRemaining: response.rateLimitRemaining
    })

  } catch (error) {
    console.error('Test order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create test order' },
      { status: 500 }
    )
  }
}

// Delete test order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const shipStationOrderId = searchParams.get('shipStationOrderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Delete from ShipStation if ID provided
    if (shipStationOrderId) {
      try {
        const client = getShipStationV1Client()
        await client.deleteOrder(shipStationOrderId)
        console.log(`Deleted order ${shipStationOrderId} from ShipStation`)
      } catch (error) {
        console.error('Failed to delete from ShipStation:', error)
        // Continue with local deletion even if ShipStation fails
      }
    }

    // Delete order items first (foreign key constraint)
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId)

    // Delete sync logs
    await supabase
      .from('shipstation_sync_logs')
      .delete()
      .eq('order_id', orderId)

    // Delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test order deleted successfully'
    })

  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete order' },
      { status: 500 }
    )
  }
}