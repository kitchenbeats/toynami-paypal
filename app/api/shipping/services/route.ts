import { NextRequest, NextResponse } from 'next/server'

interface Service {
  carrier_id: string
  carrier_name: string
  service_code: string
  service_name: string
  domestic?: boolean
  international?: boolean
}

interface V1Service {
  carrierCode: string
  code: string
  name: string
  domestic?: boolean
  international?: boolean
}

// interface CarrierWithServices {
//   carrier_id: string
//   carrier_name: string
//   services?: Service[]
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  const apiKey = process.env.SHIPSTATION_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'ShipStation API key not configured' }, { status: 500 })
  }

  try {
    // Get list of carriers first
    const carriersResponse = await fetch('https://ssapi.shipstation.com/carriers', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!carriersResponse.ok) {
      // Try v2 API
      const v2Response = await fetch('https://api.shipstation.com/v2/carriers', {
        method: 'GET',
        headers: {
          'API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      })
      
      if (!v2Response.ok) {
        throw new Error('Failed to fetch carriers')
      }
      
      const v2Data = await v2Response.json()
      
      // Get services for each carrier
      const services:Service[] = []
      
      if (v2Data.carriers) {
        for (const carrier of v2Data.carriers) {
          // Get services for this carrier
          const servicesResponse = await fetch(`https://api.shipstation.com/v2/carriers/${carrier.carrier_id}/services`, {
            method: 'GET',
            headers: {
              'API-Key': apiKey,
              'Content-Type': 'application/json'
            }
          })
          
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json()
            services.push({
              carrier_id: carrier.carrier_id,
              carrier_name: carrier.friendly_name || carrier.carrier_id,
              services: servicesData.services || []
            })
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        api_version: 'v2',
        carriers: v2Data.carriers || [],
        services_by_carrier: services,
        all_service_codes: services.flatMap(c => 
          c.services.map((s:Service) => ({
            carrier: c.carrier_name,
            service_code: s.service_code,
            service_name: s.service_name || s.name
          }))
        )
      })
    }

    // V1 API response
    const carriersData = await carriersResponse.json()
    
    // Get services for each carrier
    const services:Service[] = []
    
    for (const carrier of carriersData) {
      if (carrier.services) {
        services.push({
          carrier_code: carrier.code,
          carrier_name: carrier.name,
          services: carrier.services.map((s: V1Service) => ({
            service_code: s.code,
            service_name: s.name
          }))
        })
      }
    }

    return NextResponse.json({
      success: true,
      api_version: 'v1',
      carriers: carriersData,
      all_service_codes: services.flatMap(c => 
        c.services.map((s:Service) => ({
          carrier: c.carrier_name,
          service_code: s.service_code,
          service_name: s.service_name
        }))
      )
    })

  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch services',
        details: error
      },
      { status: 500 }
    )
  }
}