import { NextRequest, NextResponse } from 'next/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

/**
 * Test endpoint for ShipStation integration
 * Use this to verify your ShipStation credentials and connection
 * 
 * GET /api/shipstation/test - Test connection and get account info
 */

export async function GET(request: NextRequest) {
  try {
    // Get ShipStation V1 client
    const client = getShipStationV1Client()
    
    // Test connection by fetching carriers
    const carriersResponse = await client.testConnection()
    
    if (!carriersResponse.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to ShipStation',
        details: carriersResponse.error,
        rateLimitRemaining: carriersResponse.rateLimitRemaining
      }, { status: 500 })
    }

    // Get available carriers
    const carriers = carriersResponse.data?.map((carrier: any) => ({
      code: carrier.code,
      name: carrier.name,
      accountNumber: carrier.accountNumber ? '***' + carrier.accountNumber.slice(-4) : null,
      requiresFundedAccount: carrier.requiresFundedAccount,
      primary: carrier.primary
    })) || []

    return NextResponse.json({
      success: true,
      message: 'ShipStation connection successful',
      rateLimitRemaining: carriersResponse.rateLimitRemaining,
      carriers: carriers,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('ShipStation test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Test order creation (POST)
 * Use this to test creating an order in ShipStation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { createTestOrder = false } = body

    if (!createTestOrder) {
      return NextResponse.json({
        message: 'Set createTestOrder: true in request body to create a test order'
      })
    }

    // Get ShipStation V1 client
    const client = getShipStationV1Client()
    
    // Create a test order
    const testOrder = {
      orderNumber: `TEST-${Date.now()}`,
      orderKey: `test_${Date.now()}`,
      orderDate: new Date().toISOString().replace('T', ' ').replace('Z', ''),
      orderStatus: 'awaiting_shipment' as const,
      customerEmail: 'test@example.com',
      billTo: {
        name: 'John Doe',
        street1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
        phone: '555-555-5555'
      },
      shipTo: {
        name: 'John Doe',
        street1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
        phone: '555-555-5555'
      },
      items: [{
        lineItemKey: 'test_item_1',
        sku: 'TEST-SKU-001',
        name: 'Test Product',
        quantity: 1,
        unitPrice: 10.00,
        weight: {
          value: 1.0,
          units: 'pounds' as const
        }
      }],
      orderTotal: 15.50,
      amountPaid: 15.50,
      taxAmount: 0.50,
      shippingAmount: 5.00,
      paymentMethod: 'Test Payment',
      internalNotes: 'Test order created via API test endpoint'
    }

    const response = await client.createOrder(testOrder)

    if (!response.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test order in ShipStation',
        details: response.error,
        rateLimitRemaining: response.rateLimitRemaining
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      orderData: response.data,
      rateLimitRemaining: response.rateLimitRemaining,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('ShipStation test order error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}