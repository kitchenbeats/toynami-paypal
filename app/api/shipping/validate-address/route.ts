import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    // Validate required fields
    if (!address.address || !address.city || !address.state || !address.zipCode) {
      return NextResponse.json({
        success: false,
        error: 'Missing required address fields'
      }, { status: 400 })
    }

    // For now, just return success since ShipStation V1 doesn't have dedicated address validation
    // We could use the "Get Rates" endpoint to validate addresses, but that's expensive
    // and we already validate addresses when getting shipping rates
    
    // Simple validation - check for obviously invalid data
    if (address.zipCode.length < 5 || address.state.length !== 2) {
      return NextResponse.json({
        success: false,
        isValid: false,
        errors: ['Please check your ZIP code and state'],
        suggestedAddress: null
      })
    }

    // Address looks reasonable - return as valid
    return NextResponse.json({
      success: true,
      isValid: true,
      validatedAddress: {
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        address: address.address.trim(),
        apartment: address.apartment || '',
        city: address.city.trim(),
        state: address.state.toUpperCase().trim(),
        zipCode: address.zipCode.trim(),
        country: address.country || 'US'
      }
    })

  } catch (error) {
    console.error('Address validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error during address validation'
    }, { status: 500 })
  }
}