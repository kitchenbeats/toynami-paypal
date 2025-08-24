import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get promotion with usage stats
    const { data: promotion, error } = await supabase
      .from('promotions')
      .select(`
        *,
        promotion_usage (
          id,
          discount_amount_cents,
          used_at,
          user_id
        )
      `)
      .eq('id', id)
      .single()

    if (error || !promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error in promotion GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    
    // Update promotion
    const { data: promotion, error } = await supabase
      .from('promotions')
      .update({
        ...body,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating promotion:', error)
      return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error in promotion PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Soft delete promotion
    const { error } = await supabase
      .from('promotions')
      .update({
        deleted_at: new Date().toISOString(),
        is_active: false,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error deleting promotion:', error)
      return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in promotion DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}