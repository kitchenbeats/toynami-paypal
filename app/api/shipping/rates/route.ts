import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiHandler, validateRequest } from '@/lib/api/utils'

interface FormattedRate {
  id: string
  carrier: string
  service: string
  serviceCode: string
  packageCode?: string
  amount: number
  currency: string
  deliveryDays: string | null
  trackingAvailable: boolean
}

// Define validation schema
const shippingRateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().positive(),
    weight: z.number().positive().optional(), // in pounds
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }).optional(),
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    name: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    zipCode: z.string().min(5),
    country: z.string().default('US'),
  }),
})

export type ShippingRateRequest = z.infer<typeof shippingRateSchema>

export const POST = apiHandler(async (request: NextRequest) => {
  // Validate request body
  const { data: body, error } = await validateRequest(request, shippingRateSchema)
  if (error) return error

    // Get V1 API credentials
    const v1ApiKey = process.env.SHIPSTATION_API_KEY_V1
    const v1ApiSecret = process.env.SHIPSTATION_API_SECRET_V1
    
    if (!v1ApiKey || !v1ApiSecret) {
      return NextResponse.json({ 
        error: 'ShipStation API not configured. Please set SHIPSTATION_API_KEY_V1 and SHIPSTATION_API_SECRET_V1' 
      }, { status: 500 })
    }

    // Calculate total weight and dimensions
    let totalWeight = 0
    let maxLength = 0, maxWidth = 0, maxHeight = 0

    body.items.forEach(item => {
      // Use actual weight from cart item, default to 1 pound if not provided
      const itemWeight = item.weight || 1.0
      totalWeight += itemWeight * item.quantity

      if (item.dimensions) {
        maxLength = Math.max(maxLength, item.dimensions.length)
        maxWidth = Math.max(maxWidth, item.dimensions.width)
        maxHeight += item.dimensions.height * item.quantity // Stack items
      }
    })

    // If no dimensions provided, use default package size
    if (maxLength === 0) {
      maxLength = 12
      maxWidth = 12
      maxHeight = 6
    }

    // Build the base V1 request
    const v1BaseRequest = {
      packageCode: 'package',
      fromPostalCode: process.env.SHIPSTATION_FROM_ZIP || '93065',
      toState: body.shippingAddress.state,
      toCountry: body.shippingAddress.country || 'US',
      toPostalCode: body.shippingAddress.zipCode,
      toCity: body.shippingAddress.city,
      weight: {
        value: Math.max(totalWeight, 0.1), // Minimum 0.1 pounds
        units: 'pounds'
      },
      dimensions: {
        length: maxLength,
        width: maxWidth,
        height: maxHeight,
        units: 'inches'
      },
      confirmation: 'none',
      residential: true
    }

    // Make just 2 API calls - one per carrier, then filter results
    const carriers = [
      { carrierCode: 'stamps_com', serviceCode: null }, // Get all USPS services
      { carrierCode: 'ups', serviceCode: null }  // Get all UPS services
    ]

    const carrierPromises = carriers.map(async (carrier) => {
      const request = { ...v1BaseRequest, ...carrier }
      
      const response = await fetch('https://ssapi.shipstation.com/shipments/getrates', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(v1ApiKey + ':' + v1ApiSecret).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (response.ok) {
        const data = await response.json()
        return Array.isArray(data) ? data : [data]
      } else {
        const errorText = await response.text()
        console.error(`ShipStation V1 API error for ${carrier.carrierCode}:`, errorText)
        return []
      }
    })

    const results = await Promise.all(carrierPromises)
    const allRates = results.flat()

    if (allRates.length === 0) {
      return NextResponse.json(
        { error: 'No shipping rates available for this destination' },
        { status: 400 }
      )
    }

    // Define which services we want to keep
    const wantedServices = [
      'usps_ground_advantage',
      'usps_priority_mail', 
      'usps_priority_mail_express',
      'ups_ground',
      'ups_2nd_day_air',
      'ups_next_day_air'
    ]

    // Delivery day estimates based on service type
    const getDeliveryDays = (serviceCode: string): string | null => {
      const estimates: Record<string, string> = {
        // USPS
        'usps_ground_advantage': '2-5',
        'usps_priority_mail': '1-3',
        'usps_priority_mail_express': '1-2',
        // UPS
        'ups_ground': '1-5',
        'ups_2nd_day_air': '2',
        'ups_next_day_air': '1'
      }
      return estimates[serviceCode] || null
    }

    // Filter to only wanted services and format rates for frontend
    const formattedRates = allRates
      .filter((rate) => wantedServices.includes(rate.serviceCode))
      .map((rate) => {
      // V1 uses shipmentCost + otherCost for total
      const amount = (rate.shipmentCost || 0) + (rate.otherCost || 0)
      
      return {
        id: `${rate.carrierCode}_${rate.serviceCode}`,
        carrier: rate.carrierFriendlyName || rate.carrierName || 'Unknown',
        service: rate.serviceName || 'Standard',
        serviceCode: rate.serviceCode,
        packageCode: rate.packageCode,
        amount: amount,
        currency: 'USD',
        deliveryDays: getDeliveryDays(rate.serviceCode),
        trackingAvailable: true,
        confirmationAmount: 0
      }
    })

    // Filter out $0 rates and sort by price
    const validRates = formattedRates.filter(rate => rate.amount > 0)
    const sortedRates = validRates.sort((a, b) => a.amount - b.amount)

    // Deduplicate rates - keep only the cheapest for each carrier/service combo
    const deduplicatedRates = new Map<string, FormattedRate>()
    
    sortedRates.forEach(rate => {
      const key = `${rate.carrier}-${rate.service}`
      
      if (!deduplicatedRates.has(key) || deduplicatedRates.get(key).amount > rate.amount) {
        deduplicatedRates.set(key, rate)
      }
    })
    
    const finalRates = Array.from(deduplicatedRates.values()).sort((a, b) => a.amount - b.amount)

    return NextResponse.json({
      success: true,
      rates: finalRates,
      shipFrom: {
        postal_code: process.env.SHIPSTATION_FROM_ZIP || '93065',
        city: process.env.SHIPSTATION_FROM_CITY || 'Simi Valley',
        state: process.env.SHIPSTATION_FROM_STATE || 'CA'
      },
      shipTo: {
        postal_code: body.shippingAddress.zipCode,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state
      },
      totalWeight,
      packageCount: 1
    })
})