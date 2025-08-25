import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  const apiKey = process.env.SHIPSTATION_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'ShipStation API key not configured' }, { status: 500 })
  }

  try {
    // Get list of carriers from ShipStation
    const response = await fetch('https://api.shipstation.com/v2/carriers', {
      method: 'GET',
      headers: {
        'API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch carriers' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      carriers: data.carriers || data
    })

  } catch (error) {
      console.error('Error in catch block:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch carriers',
        details: error
      },
      { status: 500 }
    )
  }
}