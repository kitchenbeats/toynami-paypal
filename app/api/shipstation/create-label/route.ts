import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { orderId, carrierCode, serviceCode, packageCode, weight, dimensions } = body

    // Get the order details including shipping address
    const { data: order } = await supabase
      .from('orders')
      .select('*, ship_to')
      .eq('shipstation_order_id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Initialize ShipStation client
    const shipstation = getShipStationV1Client()

    // Create the label
    const response = await shipstation.createLabel({
      orderId,
      carrierCode,
      serviceCode,
      packageCode,
      confirmation: 'delivery',
      shipDate: new Date().toISOString().split('T')[0],
      weight,
      dimensions,
      testLabel: false, // Set to true for testing
      // Use actual shipping address from order
      shipTo: order.ship_to || {
        name: 'Customer',
        street1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US'
      }
    })

    if (!response.success) {
      console.error('ShipStation error:', response.error)
      return NextResponse.json(
        { error: response.error || 'Failed to create label' },
        { status: 400 }
      )
    }

    // Update order with tracking info
    if (response.data?.trackingNumber) {
      await supabase
        .from('orders')
        .update({
          tracking_number: response.data.trackingNumber,
          shipping_carrier: carrierCode,
          shipstation_shipment_id: response.data.shipmentId,
          status: 'shipped',
          updated_at: new Date().toISOString()
        })
        .eq('shipstation_order_id', orderId)

      // Log the label creation
      await supabase
        .from('shipstation_labels')
        .insert({
          order_id: order.id,
          shipment_id: response.data.shipmentId,
          label_id: response.data.labelId,
          carrier_code: carrierCode,
          service_code: serviceCode,
          package_code: packageCode,
          tracking_number: response.data.trackingNumber,
          label_url: response.data.labelData,
          shipping_cost: response.data.shipmentCost,
          created_by: user.id
        })
    }

    return NextResponse.json({
      success: true,
      trackingNumber: response.data?.trackingNumber,
      labelUrl: response.data?.labelData,
      shipmentId: response.data?.shipmentId
    })
  } catch (error) {
    console.error('Error creating label:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}