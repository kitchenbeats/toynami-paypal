import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface TaxCalculationRequest {
  items: Array<{
    id: string
    name: string
    price: number // in dollars
    quantity: number
    taxCode?: string // TIC (Taxability Information Code) for TaxCloud
  }>
  shippingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country?: string
  }
  shippingAmount?: number
  customerId?: string // For tax exemption handling
}

interface TaxSettings {
  enabled: boolean
  provider: 'taxcloud' | 'none'
  origin_address: string | null
  origin_city: string | null
  origin_state: string | null
  origin_zip: string | null
  origin_country: string
  tax_shipping: boolean
  tax_enabled_states: string[] | null
}

/**
 * Calculate tax using TaxCloud v3 API
 * TaxCloud is free in SST member states and provides accurate, compliant tax calculations
 */
async function calculateWithTaxCloud(
  request: TaxCalculationRequest,
  settings: TaxSettings
): Promise<{
  totalTax: number
  taxRate: number
  breakdown: Array<{
    itemId: string
    taxAmount: number
    taxRate: number
  }>
  cartId: string
}> {
  // Get API credentials from environment variables
  const connectionId = process.env.TAXCLOUD_CONNECTION_ID
  const apiKey = process.env.TAXCLOUD_API_KEY
  
  if (!connectionId || !apiKey) {
    throw new Error('TaxCloud credentials not configured. Please set TAXCLOUD_CONNECTION_ID and TAXCLOUD_API_KEY in .env.local')
  }

  // Generate a unique cart ID for this transaction
  const cartId = `cart-${Date.now()}-${Math.random().toString(36).substring(7)}`
  const customerId = request.customerId || 'guest'

  // Prepare line items for TaxCloud v3
  const lineItems = request.items.map((item, index) => ({
    index: index,
    itemId: String(item.id), // Must be string
    price: item.price,
    quantity: item.quantity,
    tic: parseInt(item.taxCode || '0', 10) // Must be number, 0 = General taxable
  }))

  // Add shipping as a line item if applicable and taxable
  if (request.shippingAmount && request.shippingAmount > 0 && settings.tax_shipping) {
    lineItems.push({
      index: lineItems.length,
      itemId: 'SHIPPING',
      price: request.shippingAmount,
      quantity: 1,
      tic: 11010 // TIC for shipping charges (as number)
    })
  }

  // Prepare origin address from settings or environment
  const origin = {
    line1: settings.origin_address || process.env.SHIPSTATION_FROM_ADDRESS || '',
    city: settings.origin_city || process.env.SHIPSTATION_FROM_CITY || '',
    state: settings.origin_state || process.env.SHIPSTATION_FROM_STATE || '',
    zip: (settings.origin_zip || process.env.SHIPSTATION_FROM_ZIP || '').substring(0, 5)
  }

  // Validate origin configuration
  if (!origin.line1 || !origin.city || !origin.state || !origin.zip) {
    throw new Error('Origin address not configured. Set SHIPSTATION_FROM_* variables in .env.local or configure in admin settings.')
  }

  // Prepare destination address
  const destination = {
    line1: request.shippingAddress.address,
    city: request.shippingAddress.city,
    state: request.shippingAddress.state,
    zip: request.shippingAddress.zipCode.substring(0, 5)
  }

  // Create cart request for TaxCloud v3 API
  // Based on the error, the API expects an "items" array with nested structure
  const cartRequest = {
    items: [{
      cartId: cartId,
      customerId: customerId,
      currency: {}, // Required field, empty object for USD default
      origin: origin,
      destination: destination,
      lineItems: lineItems
    }]
  }

  // console.log('TaxCloud v3 Request:', JSON.stringify(cartRequest, null, 2))
  // console.log('Connection ID:', connectionId)

  try {
    // Call TaxCloud v3 Create Cart API
    const response = await fetch(`https://api.v3.taxcloud.com/tax/connections/${connectionId}/carts`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cartRequest),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('TaxCloud API error response:', errorText)
      
      if (response.status === 401) {
        throw new Error('Invalid TaxCloud API credentials. Check TAXCLOUD_CONNECTION_ID and TAXCLOUD_API_KEY')
      }
      if (response.status === 400) {
        throw new Error(`Invalid request: ${errorText}`)
      }
      
      throw new Error(`TaxCloud API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    // console.log('TaxCloud v3 Response:', JSON.stringify(data, null, 2))

    // Extract tax information from v3 response
    // Response has items[0].lineItems with individual tax amounts
    if (!data.items || !data.items[0]) {
      throw new Error('Invalid TaxCloud response structure')
    }

    const cartResponse = data.items[0]
    let totalTax = 0
    let totalAmount = 0
    const breakdown = []

    // Process each line item's tax
    cartResponse.lineItems.forEach((lineItem: any) => {
      const itemTax = lineItem.tax?.amount || 0
      const itemRate = lineItem.tax?.rate || 0
      const itemTotal = lineItem.price * lineItem.quantity
      
      totalTax += itemTax
      totalAmount += itemTotal
      
      // Map back to original item IDs
      if (lineItem.itemId === 'SHIPPING') {
        if (itemTax > 0) {
          breakdown.push({
            itemId: 'SHIPPING',
            taxAmount: parseFloat(itemTax.toFixed(2)),
            taxRate: itemRate
          })
        }
      } else {
        // Find the original item by matching the string ID
        const originalItem = request.items.find(item => String(item.id) === lineItem.itemId)
        if (originalItem) {
          breakdown.push({
            itemId: originalItem.id,
            taxAmount: parseFloat(itemTax.toFixed(2)),
            taxRate: itemRate
          })
        }
      }
    })

    // Calculate overall effective tax rate
    const taxRate = totalAmount > 0 ? totalTax / totalAmount : 0

    return {
      totalTax: parseFloat(totalTax.toFixed(2)),
      taxRate: parseFloat(taxRate.toFixed(6)),
      breakdown,
      cartId
    }

  } catch (error) {
    console.error('TaxCloud API call failed:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Tax calculation service timed out. Please try again.')
      }
      if (error.message.includes('TaxCloud') || error.message.includes('Invalid')) {
        throw error
      }
    }
    
    throw new Error('Tax calculation service unavailable. Please try again.')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TaxCalculationRequest = await request.json()
    
    // Validate request
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required for tax calculation' },
        { status: 400 }
      )
    }
    
    if (!body.shippingAddress?.state || !body.shippingAddress?.zipCode) {
      return NextResponse.json(
        { error: 'Valid shipping address with state and zip code is required' },
        { status: 400 }
      )
    }

    // Get tax settings from database (only non-sensitive settings)
    const supabase = await createClient()
    const { data: dbSettings } = await supabase
      .from('tax_settings')
      .select('enabled, tax_shipping, tax_enabled_states, origin_address, origin_city, origin_state, origin_zip')
      .single()

    // Check if TaxCloud API is configured
    const hasApiConfig = !!(process.env.TAXCLOUD_CONNECTION_ID && process.env.TAXCLOUD_API_KEY)
    
    if (!hasApiConfig) {
      return NextResponse.json({
        success: true,
        enabled: false,
        totalTax: 0,
        taxRate: 0,
        message: 'Tax calculation is not configured'
      })
    }

    // Combine DB settings with defaults
    const settings: TaxSettings = {
      enabled: dbSettings?.enabled ?? true,
      provider: 'taxcloud',
      origin_address: dbSettings?.origin_address || process.env.SHIPSTATION_FROM_ADDRESS || process.env.WAREHOUSE_ADDRESS || null,
      origin_city: dbSettings?.origin_city || process.env.SHIPSTATION_FROM_CITY || process.env.WAREHOUSE_CITY || null,
      origin_state: dbSettings?.origin_state || process.env.SHIPSTATION_FROM_STATE || process.env.WAREHOUSE_STATE || null,
      origin_zip: dbSettings?.origin_zip || process.env.SHIPSTATION_FROM_ZIP || process.env.WAREHOUSE_ZIP || null,
      origin_country: 'US',
      tax_shipping: dbSettings?.tax_shipping ?? true,
      tax_enabled_states: dbSettings?.tax_enabled_states || null
    }

    // Check if tax calculation is enabled
    if (!settings.enabled) {
      return NextResponse.json({
        success: true,
        enabled: false,
        totalTax: 0,
        taxRate: 0,
        message: 'Tax calculation is disabled'
      })
    }

    // Check if tax should be collected for this state
    if (settings.tax_enabled_states && settings.tax_enabled_states.length > 0) {
      const shipToState = body.shippingAddress.state.toUpperCase()
      const enabledStates = settings.tax_enabled_states.map((s: string) => s.toUpperCase())
      
      if (!enabledStates.includes(shipToState)) {
        return NextResponse.json({
          success: true,
          enabled: true,
          totalTax: 0,
          taxRate: 0,
          message: `No tax collected for ${shipToState}`,
          taxExempt: true
        })
      }
    }

    // Calculate tax using TaxCloud v3
    const result = await calculateWithTaxCloud(body, settings)

    return NextResponse.json({
      success: true,
      enabled: true,
      provider: 'TaxCloud v3',
      totalTax: result.totalTax,
      taxRate: result.taxRate,
      breakdown: result.breakdown,
      cartId: result.cartId,
      calculatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Tax calculation error:', error)
    
    // Return error but don't break checkout
    return NextResponse.json({
      success: false,
      enabled: true,
      totalTax: 0,
      taxRate: 0,
      error: error instanceof Error ? error.message : 'Tax calculation failed',
      message: 'Tax could not be calculated. You may proceed with checkout.',
      calculatedAt: new Date().toISOString()
    })
  }
}

// GET endpoint to check tax configuration status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: settings, error } = await supabase
      .from('tax_settings')
      .select('enabled, provider, tax_enabled_states')
      .single()

    const hasApiConfig = !!(process.env.TAXCLOUD_CONNECTION_ID && process.env.TAXCLOUD_API_KEY)

    if (error || !settings || !hasApiConfig) {
      return NextResponse.json({
        configured: false,
        enabled: false,
        message: 'Tax settings not configured'
      })
    }

    return NextResponse.json({
      configured: true,
      enabled: settings.enabled,
      provider: 'taxcloud_v3',
      states: settings.tax_enabled_states || []
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check tax configuration' },
      { status: 500 }
    )
  }
}