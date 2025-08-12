/**
 * ShipStation V2 API Client for real-time shipping rates
 * Based on 2024/2025 API documentation
 */

export interface ShippingAddress {
  name?: string
  company_name?: string
  address_line1: string
  address_line2?: string
  city_locality: string
  state_province: string
  postal_code: string
  country_code: string
  phone?: string
  address_residential_indicator?: 'yes' | 'no' | 'unknown'
}

export interface ShippingPackage {
  package_code?: string
  weight: {
    value: number
    unit: 'pound' | 'ounce' | 'gram' | 'kilogram'
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'inch' | 'centimeter'
  }
}

export interface ShippingRate {
  id: string
  carrier: string
  service: string
  service_code: string
  amount: {
    value: number
    currency: string
  }
  delivery_days?: number
  delivery_date?: string
  estimated_delivery_date?: string
  carrier_logo?: string
  tracking_available?: boolean
}

export interface RateRequest {
  shipment: {
    validate_address?: 'no_validation' | 'validate_only' | 'validate_and_clean'
    ship_from: ShippingAddress
    ship_to: ShippingAddress
    packages: ShippingPackage[]
    confirmation?: 'none' | 'delivery' | 'signature' | 'adult_signature'
  }
  rate_options: {
    carrier_ids: string[]
    preferred_currency?: string
    service_codes?: string[]
    package_types?: string[]
  }
}

export interface RateResponse {
  rate_response: {
    rates: ShippingRate[]
    invalid_rates?: ShippingRate[]
    rate_request_id?: string
    shipment_id?: string
    created_at?: string
    status?: string
    errors?: Array<{
      error_source?: string
      error_type?: string
      error_code?: string
      message: string
    }>
  }
}

class ShipStationClient {
  private apiKey: string
  private baseUrl: string
  
  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey
    // ShipStation V2 API base URL (no sandbox available yet)
    this.baseUrl = 'https://api.shipstation.com/v2'
  }

  /**
   * Calculate shipping rates for a given shipment
   */
  async calculateRates(request: RateRequest): Promise<RateResponse> {
    // Check if API key exists
    if (!this.apiKey) {
      throw new Error('ShipStation API key not configured. Please set SHIPSTATION_API_KEY in your environment variables.')
    }

    try {
      // Add validation default
      if (!request.shipment.validate_address) {
        request.shipment.validate_address = 'no_validation'
      }
      
      // Only fetch all carriers if we don't have carrier_ids configured
      // When service_codes are provided, carrier_ids should also be provided for proper filtering
      if (!request.rate_options.carrier_ids) {
        // Fetch carriers dynamically only if no carrier filtering is provided
        const carriersResponse = await fetch(`${this.baseUrl}/carriers`, {
          method: 'GET',
          headers: {
            'API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        })
        
        if (carriersResponse.ok) {
          const carriersData = await carriersResponse.json()
          const carrierIds = carriersData.carriers?.map((c: any) => c.carrier_id) || []
          
          if (carrierIds.length > 0) {
            request.rate_options.carrier_ids = carrierIds
          }
        }
      }
      
      if (!request.rate_options.preferred_currency) {
        request.rate_options.preferred_currency = 'USD'
      }

      const response = await fetch(`${this.baseUrl}/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey, // ShipStation V2 uses API-Key header
          'User-Agent': 'Toynami-NextJS/1.0'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No error details available' }))
        const errorMessage = errorData.message || errorData.error || errorData.errors?.[0]?.message || `HTTP ${response.status}`
        throw new Error(`ShipStation API: ${errorMessage}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Estimate shipping rates with limited address information
   */
  async estimateRates(request: Partial<RateRequest>): Promise<RateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/rates/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey, // ShipStation V2 uses API-Key header
          'User-Agent': 'Toynami-NextJS/1.0'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`ShipStation API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get rate by ID (for previously calculated rates)
   */
  async getRateById(rateId: string): Promise<ShippingRate> {
    try {
      const response = await fetch(`${this.baseUrl}/rates/${rateId}`, {
        method: 'GET',
        headers: {
          'API-Key': this.apiKey, // ShipStation V2 uses API-Key header
          'User-Agent': 'Toynami-NextJS/1.0'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`ShipStation API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }
}

// Create and export a singleton instance
export const shipStationClient = new ShipStationClient(
  process.env.SHIPSTATION_API_KEY || '',
  process.env.NODE_ENV === 'development'
)

export { ShipStationClient }