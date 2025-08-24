import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

export async function POST(request: NextRequest) {
  try {
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

    // Get ShipStation client
    const client = getShipStationV1Client()

    // Fetch orders that need syncing (paid but not in ShipStation)
    const { data: ordersToSync } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'paid')
      .is('shipstation_order_id', null)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!ordersToSync || ordersToSync.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No orders to sync',
        synced: 0 
      })
    }

    let syncedCount = 0
    const errors: any[] = []

    // Sync each order to ShipStation
    for (const order of ordersToSync) {
      try {
        // Get order items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products(name, sku, weight),
            variant:product_variants(name, sku, weight)
          `)
          .eq('order_id', order.id)

        // Format order for ShipStation
        const shipStationOrder = {
          orderNumber: order.order_number || order.id,
          orderKey: order.id,
          orderDate: new Date(order.created_at).toISOString().split('T')[0] + ' 00:00:00',
          orderStatus: 'awaiting_shipment',
          customerEmail: order.customer_email,
          billTo: order.bill_to || order.ship_to,
          shipTo: order.ship_to,
          items: orderItems?.map(item => ({
            lineItemKey: item.id,
            sku: item.variant?.sku || item.product?.sku || 'UNKNOWN',
            name: item.variant?.name || item.product?.name || 'Unknown Product',
            quantity: item.quantity,
            unitPrice: (item.price_cents / 100),
            weight: {
              value: item.variant?.weight || item.product?.weight || 1,
              units: 'ounces' as const
            }
          })) || [],
          amountPaid: (order.total_cents / 100),
          taxAmount: (order.tax_cents / 100) || 0,
          shippingAmount: (order.shipping_cents / 100) || 0,
          internalNotes: order.internal_notes,
          customerNotes: order.customer_notes
        }

        // Create order in ShipStation
        const response = await client.createOrder(shipStationOrder)

        if (response.success && response.data) {
          // Update order with ShipStation ID
          await supabase
            .from('orders')
            .update({
              shipstation_order_id: response.data.orderId?.toString(),
              last_synced_at: new Date().toISOString()
            })
            .eq('id', order.id)

          // Log sync
          await supabase
            .from('shipstation_sync_logs')
            .insert({
              order_id: order.id,
              action: 'create',
              success: true,
              response_data: response.data,
              rate_limit_remaining: response.rateLimitRemaining,
              created_by: user.id
            })

          syncedCount++
        } else {
          errors.push({
            orderId: order.id,
            error: response.error || 'Unknown error'
          })

          // Log failed sync
          await supabase
            .from('shipstation_sync_logs')
            .insert({
              order_id: order.id,
              action: 'create',
              success: false,
              error_message: response.error,
              rate_limit_remaining: response.rateLimitRemaining,
              created_by: user.id
            })
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1500))

      } catch (error) {
        console.error(`Failed to sync order ${order.id}:`, error)
        errors.push({
          orderId: order.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} of ${ordersToSync.length} orders`,
      synced: syncedCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Order sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}