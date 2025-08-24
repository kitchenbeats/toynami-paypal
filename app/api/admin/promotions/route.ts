import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('promotions')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data: promotions, error, count } = await query

    if (error) {
      console.error('Error fetching promotions:', error)
      return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 })
    }

    // Calculate stats
    const { data: stats } = await supabase
      .from('promotions')
      .select('is_active, usage_count, total_discount_given_cents')
      .is('deleted_at', null)

    const activeCount = stats?.filter(p => p.is_active).length || 0
    const totalUsage = stats?.reduce((sum, p) => sum + (p.usage_count || 0), 0) || 0
    const totalDiscounts = stats?.reduce((sum, p) => sum + (p.total_discount_given_cents || 0), 0) || 0

    return NextResponse.json({
      promotions: promotions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats: {
        activeCount,
        totalUsage,
        totalDiscounts
      }
    })
  } catch (error) {
    console.error('Error in promotions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    // Prepare promotion data
    const promotionData = {
      ...body,
      created_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    }

    // Create promotion
    const { data: promotion, error } = await supabase
      .from('promotions')
      .insert(promotionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating promotion:', error)
      return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error in promotions POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}