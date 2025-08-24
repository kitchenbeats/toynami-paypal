import { NextRequest, NextResponse } from 'next/server'
import { getShipStationV1Client, ShipStationV1Client } from '@/lib/shipstation/v1-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      orderId,
      orderNumber,
      orderDate,
      orderStatus = 'awaiting_shipment',
      customerEmail,
      customerName,
      billTo,
      shipTo,
      items,
      shippingAmount = 0,
      taxAmount = 0,
      amountPaid,
      paymentMethod,
      shippingMethod,
      internalNotes,
      customerNotes
    } = body

    // Validate required fields
    if (!orderNumber || !orderDate || !shipTo) {
      return NextResponse.json(
        { error: 'Missing required fields: orderNumber, orderDate, or shipTo' },
        { status: 400 }
      )
    }

    // Get ShipStation V1 client
    let client: ShipStationV1Client
    try {
      client = getShipStationV1Client()
    } catch (error) {
      console.error('ShipStation V1 client error:', error)
      return NextResponse.json({
        warning: 'Order saved but ShipStation sync failed',
        error: error instanceof Error ? error.message : 'ShipStation client not configured',
        orderId
      }, { status: 200 })
    }

    // Format order data for ShipStation
    const shipStationOrder = ShipStationV1Client.formatOrder({
      orderId: orderId || 0,
      orderNumber,
      orderDate,
      orderStatus,
      customerEmail,
      customerName,
      billTo: billTo || shipTo, // Use shipTo as billTo if billTo not provided
      shipTo,
      items: items || [],
      orderTotal: amountPaid || 0,
      amountPaid: amountPaid || 0,
      shippingAmount: shippingAmount || 0,
      taxAmount: taxAmount || 0,
      paymentMethod: paymentMethod || 'PayPal',
      internalNotes: internalNotes || '',
      customerNotes: customerNotes || '',
      shippingMethod
    })

    // Create order in ShipStation
    const response = await client.createOrder(shipStationOrder)

    if (!response.success) {
      console.error('ShipStation order creation error:', response.error)
      
      // Don't fail the order if ShipStation fails - we can add it manually later
      return NextResponse.json({
        warning: 'Order saved but ShipStation sync failed',
        error: response.error || 'Failed to create order in ShipStation',
        orderId,
        rateLimitRemaining: response.rateLimitRemaining
      }, { status: 200 }) // Return 200 so order flow continues
    }

    console.log('ShipStation order created successfully:', response.data)

    return NextResponse.json({
      success: true,
      shipStationOrderId: response.data?.orderId,
      shipStationOrderNumber: response.data?.orderNumber,
      orderId,
      externalOrderId: orderNumber,
      status: 'Order created in ShipStation',
      rateLimitRemaining: response.rateLimitRemaining
    })

  } catch (error) {
    console.error('ShipStation order creation error:', error)
    
    // Don't fail the order if ShipStation fails
    return NextResponse.json({
      warning: 'Order saved but ShipStation sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}