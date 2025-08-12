import { NextRequest, NextResponse } from 'next/server'
import { shipStationClient, type ShippingAddress, type ShippingPackage } from '@/lib/shipstation/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get V2 API key
    const apiKey = process.env.SHIPSTATION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'V2 API key not configured' }, { status: 500 })
    }
    
    // Get V1 API credentials
    const v1ApiKey = process.env.SHIPSTATION_API_KEY_V1
    const v1ApiSecret = process.env.SHIPSTATION_API_SECRET_V1

    // Common ship from/to addresses
    const shipFrom: ShippingAddress = {
      name: 'Toynami Warehouse',
      phone: '555-555-5555',
      company_name: 'Toynami Inc',
      address_line1: process.env.SHIPSTATION_FROM_ADDRESS || '123 Warehouse St',
      city_locality: process.env.SHIPSTATION_FROM_CITY || 'Los Angeles',
      state_province: process.env.SHIPSTATION_FROM_STATE || 'CA',
      postal_code: process.env.SHIPSTATION_FROM_ZIP || '90210',
      country_code: 'US',
      address_residential_indicator: 'no'
    }

    const shipTo: ShippingAddress = {
      name: body.shippingAddress?.name || 'Test Customer',
      phone: '555-555-5555',
      address_line1: body.shippingAddress?.address || '1999 Bishop Grandin Blvd',
      city_locality: body.shippingAddress?.city || 'Austin',
      state_province: body.shippingAddress?.state || 'TX',
      postal_code: body.shippingAddress?.zipCode || '78756',
      country_code: 'US',
      address_residential_indicator: 'yes'
    }

    const packages: ShippingPackage[] = [{
      package_code: 'package',
      weight: {
        value: 2,
        unit: 'pound'
      },
      dimensions: {
        length: 12,
        width: 12,
        height: 6,
        unit: 'inch'
      }
    }]

    // Get configured filters
    const carrierIds = process.env.SHIPSTATION_CARRIER_IDS?.split(',').map(id => id.trim()).filter(id => id.length > 0) || []
    const serviceCodes = process.env.SHIPSTATION_SERVICE_CODES?.split(',').map(code => code.trim()).filter(code => code.length > 0) || []

    // Test V2 API
    console.log('Testing V2 API...')
    const v2Start = Date.now()
    let v2Response: any = null
    let v2Error: any = null

    try {
      v2Response = await shipStationClient.calculateRates({
        shipment: {
          ship_from: shipFrom,
          ship_to: shipTo,
          packages,
          confirmation: 'none'
        },
        rate_options: {
          preferred_currency: 'USD',
          carrier_ids: carrierIds.length > 0 ? carrierIds : undefined,
          service_codes: serviceCodes.length > 0 ? serviceCodes : undefined
        }
      })
    } catch (error) {
      v2Error = error instanceof Error ? error.message : 'Unknown error'
    }

    const v2Time = Date.now() - v2Start

    // Test V1 API - Get USPS and UPS rates
    console.log('Testing V1 API for USPS and UPS...')
    const v1Start = Date.now()
    let v1Response: any = []
    let v1Error: any = null

    try {
      if (!v1ApiKey || !v1ApiSecret) {
        v1Error = 'V1 API credentials not configured (SHIPSTATION_API_KEY_V1 and SHIPSTATION_API_SECRET_V1)'
        v1Response = []
      } else {
        // V1 requires separate calls for each carrier
        const v1BaseRequest = {
          packageCode: 'package',
          fromPostalCode: shipFrom.postal_code,
          toState: shipTo.state_province,
          toCountry: shipTo.country_code,
          toPostalCode: shipTo.postal_code,
          toCity: shipTo.city_locality,
          weight: {
            value: 2,
            units: 'pounds'
          },
          dimensions: {
            length: 12,
            width: 12,
            height: 6,
            units: 'inches'
          },
          confirmation: 'none',
          residential: true
        }

        // Test USPS and UPS
        const carriers = [
          { carrierCode: 'stamps_com', serviceCode: null }, // All USPS services
          { carrierCode: 'ups', serviceCode: null }  // All UPS services
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
            console.error(`V1 API error for ${carrier.carrierCode}:`, errorText)
            return []
          }
        })

        const results = await Promise.all(carrierPromises)
        v1Response = results.flat()
      }
    } catch (error) {
      v1Error = error instanceof Error ? error.message : 'Unknown error'
    }

    const v1Time = Date.now() - v1Start

    // Test V1 API with a specific service to show filtering
    console.log('Testing V1 API with single service filter...')
    const v1FilteredStart = Date.now()
    let v1FilteredRates: any[] = []
    let v1FilteredError: any = null

    if (!v1ApiKey || !v1ApiSecret) {
      v1FilteredError = 'V1 API credentials not configured'
    } else {
    try {
      // V1 API with serviceCode filter - single API call for USPS Priority Mail only
      const v1FilteredRequest = {
        carrierCode: 'stamps_com',
        serviceCode: 'usps_priority_mail', // Filter to just Priority Mail
        packageCode: 'package',
        fromPostalCode: shipFrom.postal_code,
        toState: shipTo.state_province,
        toCountry: shipTo.country_code,
        toPostalCode: shipTo.postal_code,
        toCity: shipTo.city_locality,
        weight: {
          value: 2,
          units: 'pounds'
        },
        dimensions: {
          length: 12,
          width: 12,
          height: 6,
          units: 'inches'
        },
        confirmation: 'none',
        residential: true
      }

      const response = await fetch('https://ssapi.shipstation.com/shipments/getrates', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(v1ApiKey + ':' + v1ApiSecret).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(v1FilteredRequest)
      })

      if (response.ok) {
        const data = await response.json()
        v1FilteredRates = Array.isArray(data) ? data : [data]
      } else {
        const errorText = await response.text()
        v1FilteredError = `HTTP ${response.status}: ${errorText}`
      }
    } catch (error) {
      v1FilteredError = error instanceof Error ? error.message : 'Unknown error'
    }
    }

    const v1FilteredTime = Date.now() - v1FilteredStart

    // Process results
    const v2Rates = v2Response?.rate_response?.rates || v2Response?.rates || []
    const v1Rates = v1Response || []
    // v1FilteredRates is already defined above

    // Group V2 rates by carrier
    const v2ByCarrier = v2Rates.reduce((acc: any, rate: any) => {
      const carrier = rate.carrier_friendly_name || rate.carrier_name || rate.carrier || 'Unknown'
      if (!acc[carrier]) acc[carrier] = []
      acc[carrier].push({
        service: rate.service_type || rate.service_name || rate.service,
        service_code: rate.service_code,
        cost: rate.shipping_amount?.amount || rate.amount?.value || 0,
        delivery_days: rate.delivery_days
      })
      return acc
    }, {})

    // Group V1 rates by carrier
    const v1ByCarrier = v1Rates.reduce((acc: any, rate: any) => {
      const carrier = rate.carrierFriendlyName || rate.carrierName || 'Unknown'
      if (!acc[carrier]) acc[carrier] = []
      acc[carrier].push({
        service: rate.serviceName,
        service_code: rate.serviceCode,
        cost: (rate.shipmentCost || 0) + (rate.otherCost || 0),
        delivery_days: null
      })
      return acc
    }, {})

    // Group V1 filtered rates
    const v1FilteredByCarrier = v1FilteredRates.reduce((acc: any, rate: any) => {
      const carrier = rate.carrierFriendlyName || rate.carrierName || 'Unknown'
      if (!acc[carrier]) acc[carrier] = []
      acc[carrier].push({
        service: rate.serviceName,
        service_code: rate.serviceCode,
        cost: (rate.shipmentCost || 0) + (rate.otherCost || 0),
        delivery_days: null
      })
      return acc
    }, {})

    return NextResponse.json({
      comparison: {
        v2: {
          time_ms: v2Time,
          total_rates: v2Rates.length,
          rates_by_carrier: v2ByCarrier,
          error: v2Error,
          filters_applied: {
            carrier_ids: carrierIds,
            service_codes: serviceCodes
          }
        },
        v1_all_carriers: {
          time_ms: v1Time,
          total_rates: v1Rates.length,
          rates_by_carrier: v1ByCarrier,
          error: v1Error,
          note: 'USPS and UPS - all services from both carriers'
        },
        v1_filtered: {
          time_ms: v1FilteredTime,
          total_rates: v1FilteredRates.length,
          rates_by_carrier: v1FilteredByCarrier,
          error: v1FilteredError,
          note: `Single API call filtered to USPS Priority Mail only`
        }
      },
      summary: {
        fastest: v1FilteredTime < v1Time && v1FilteredTime < v2Time ? 'v1_filtered' : 
                 v1Time < v2Time ? 'v1_all' : 'v2',
        times: {
          v2: v2Time,
          v1_all: v1Time,
          v1_filtered: v1FilteredTime
        },
        v2_advantages: [
          'Better filtering with carrier_ids and service_codes',
          'Can filter multiple carriers at once',
          'More detailed response data',
          'Better error handling',
          'Delivery date estimates'
        ],
        v1_advantages: [
          'Simpler request format',
          'Can be faster with single carrier',
          'Mature/stable API',
          'Direct carrier code filtering'
        ]
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}