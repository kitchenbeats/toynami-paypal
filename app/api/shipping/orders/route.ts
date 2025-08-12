import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.SHIPSTATION_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'ShipStation API key not configured' }, { status: 500 })
    }

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
      internalNotes
    } = body

    // ShipStation V2 doesn't have a direct order creation endpoint
    // V2 is primarily for rating and label creation
    // For order management, we'd need to use V1 API or their order sources integration
    
    // Since we only have V2 test key, we'll create a shipment instead
    // which can be used for label creation when ready to ship
    
    const shipmentRequest = {
      shipment: {
        service_code: shippingMethod?.serviceCode || null,
        ship_date: new Date().toISOString().split('T')[0],
        ship_to: {
          name: shipTo.name || customerName,
          phone: shipTo.phone || '555-555-5555',
          email: customerEmail,
          address_line1: shipTo.address,
          address_line2: shipTo.address2 || null,
          city_locality: shipTo.city,
          state_province: shipTo.state,
          postal_code: shipTo.zipCode,
          country_code: shipTo.country || 'US',
          address_residential_indicator: 'yes'
        },
        ship_from: {
          name: 'Toynami Warehouse',
          phone: '555-555-5555',
          company_name: 'Toynami Inc',
          address_line1: process.env.SHIPSTATION_FROM_ADDRESS || '123 Warehouse St',
          city_locality: process.env.SHIPSTATION_FROM_CITY || 'Los Angeles',
          state_province: process.env.SHIPSTATION_FROM_STATE || 'CA',
          postal_code: process.env.SHIPSTATION_FROM_ZIP || '90210',
          country_code: 'US',
          address_residential_indicator: 'no'
        },
        packages: [{
          weight: {
            value: calculateTotalWeight(items),
            unit: 'pound'
          },
          dimensions: {
            length: 12,
            width: 12,
            height: 6,
            unit: 'inch'
          }
        }],
        external_shipment_id: orderId?.toString() || orderNumber,
        external_order_id: orderNumber,
        items: items?.map((item: any) => ({
          name: item.productName,
          quantity: item.quantity,
          unit_price: {
            amount: item.price / 100, // Convert cents to dollars
            currency: 'USD'
          }
        })) || [],
        order_source_code: 'toynami_nextjs'
      }
    }

    // Create shipment in ShipStation V2
    const response = await fetch('https://api.shipstation.com/v2/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
        'User-Agent': 'Toynami-NextJS/1.0'
      },
      body: JSON.stringify(shipmentRequest)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('ShipStation shipment creation error:', errorData)
      
      // Don't fail the order if ShipStation fails - we can add it manually later
      return NextResponse.json({
        warning: 'Order saved but ShipStation sync failed',
        error: errorData.message || 'Failed to create shipment in ShipStation',
        orderId
      }, { status: 200 }) // Return 200 so order flow continues
    }

    const shipmentData = await response.json()

    return NextResponse.json({
      success: true,
      shipmentId: shipmentData.shipment_id,
      orderId,
      externalOrderId: orderNumber,
      status: 'Shipment created in ShipStation'
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

function calculateTotalWeight(items: any[]): number {
  if (!items || items.length === 0) return 1 // Default 1 pound
  
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 1 // Default 1 pound per item if not specified
    return total + (itemWeight * item.quantity)
  }, 0)
}