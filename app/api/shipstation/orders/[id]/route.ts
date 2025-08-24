import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Initialize ShipStation client
    const shipstation = getShipStationV1Client()
    
    // Get the specific order from ShipStation
    const response = await shipstation.getOrderById(params.id)

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch order' },
        { status: 404 }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching ShipStation order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}