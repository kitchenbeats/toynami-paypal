import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/coupons/[id] - Get single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: coupon, error } = await supabase
      .from('coupon_analytics')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }
      console.error('Error fetching coupon:', error)
      return NextResponse.json(
        { error: 'Failed to fetch coupon' },
        { status: 500 }
      )
    }

    return NextResponse.json({ coupon })

  } catch (error) {
    console.error('Error in GET /api/admin/coupons/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      usageLimit,
      usageLimitPerCustomer,
      startsAt,
      expiresAt,
      minimumOrderAmountCents,
      applicableProductIds = [],
      applicableCategoryIds = [],
      customerGroupIds = [],
      firstTimeCustomersOnly = false,
      isActive = true
    } = await request.json()

    // Validate required fields
    if (!code || !name || !discountType || !discountValue) {
      return NextResponse.json(
        { error: 'Missing required fields: code, name, discountType, discountValue' },
        { status: 400 }
      )
    }

    // Validate discount type and value
    if (!['percentage', 'fixed_amount'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Invalid discount type. Must be percentage or fixed_amount' },
        { status: 400 }
      )
    }

    if (discountValue <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0' },
        { status: 400 }
      )
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      )
    }

    // Update coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .update({
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description?.trim(),
        discount_type: discountType,
        discount_value: discountValue,
        usage_limit: usageLimit || null,
        usage_limit_per_customer: usageLimitPerCustomer || null,
        starts_at: startsAt || null,
        expires_at: expiresAt || null,
        minimum_order_amount_cents: minimumOrderAmountCents || null,
        applicable_product_ids: applicableProductIds,
        applicable_category_ids: applicableCategoryIds,
        customer_group_ids: customerGroupIds,
        first_time_customers_only: firstTimeCustomersOnly,
        is_active: isActive
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }
      if (error.code === '23505' && error.constraint === 'coupons_code_key') {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 409 }
        )
      }
      
      console.error('Error updating coupon:', error)
      return NextResponse.json(
        { error: 'Failed to update coupon' },
        { status: 500 }
      )
    }

    return NextResponse.json({ coupon })

  } catch (error) {
    console.error('Error in PUT /api/admin/coupons/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/coupons/[id] - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if coupon has been used
    const { data: usageData } = await supabase
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', params.id)
      .limit(1)

    if (usageData && usageData.length > 0) {
      // If coupon has been used, deactivate instead of delete
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: false })
        .eq('id', params.id)

      if (error) {
        console.error('Error deactivating coupon:', error)
        return NextResponse.json(
          { error: 'Failed to deactivate coupon' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        message: 'Coupon has been deactivated (cannot delete used coupons)' 
      })
    }

    // Delete coupon if never used
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting coupon:', error)
      return NextResponse.json(
        { error: 'Failed to delete coupon' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' })

  } catch (error) {
    console.error('Error in DELETE /api/admin/coupons/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}