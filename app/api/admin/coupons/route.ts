import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiHandler, requireAdmin, validateSearchParams } from '@/lib/api/utils'
import { paginationSchema } from '@/lib/validations/api'
import { z } from 'zod'

// Define search params schema
const listCouponsSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
})

// GET /api/admin/coupons - List all coupons with analytics
export const GET = apiHandler(async (request: NextRequest) => {
  // Check admin auth
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const supabase = await createClient()
  const url = new URL(request.url)
  
  // Validate query params
  const { data: params, error: validationError } = validateSearchParams(
    url.searchParams,
    listCouponsSchema
  )
  if (validationError) return validationError

  const { page, per_page: limit, search, status } = params
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('coupon_analytics')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
    }

    if (status !== 'all') {
      const isActive = status === 'active'
      query = query.eq('is_active', isActive)
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('coupon_analytics')
      .select('*', { count: 'exact', head: true })

    // Get paginated results
    const { data: coupons, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching coupons:', error)
      return NextResponse.json(
        { error: 'Failed to fetch coupons' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
})

// POST /api/admin/coupons - Create new coupon
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

    // Create coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
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
        is_active: isActive,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505' && error.constraint === 'coupons_code_key') {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 409 }
        )
      }
      
      console.error('Error creating coupon:', error)
      return NextResponse.json(
        { error: 'Failed to create coupon' },
        { status: 500 }
      )
    }

    return NextResponse.json({ coupon }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/admin/coupons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}