import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      couponCode, 
      orderTotalCents, 
      productIds = [], 
      categoryIds = [] 
    } = await request.json()

    if (!couponCode || typeof orderTotalCents !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: couponCode and orderTotalCents' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()

    // Call the validation function
    const { data, error } = await supabase.rpc('validate_coupon_usage', {
      p_coupon_code: couponCode,
      p_user_id: user?.id || null,
      p_order_total_cents: orderTotalCents,
      p_product_ids: productIds,
      p_category_ids: categoryIds
    })

    if (error) {
      console.error('Coupon validation error:', error)
      return NextResponse.json(
        { error: 'Failed to validate coupon' },
        { status: 500 }
      )
    }

    const result = data[0]
    
    if (!result.is_valid) {
      return NextResponse.json(
        { 
          valid: false, 
          error: result.error_message 
        },
        { status: 400 }
      )
    }

    // Get additional coupon details for response
    const { data: couponDetails } = await supabase
      .from('coupons')
      .select('code, name, description, discount_type, discount_value')
      .eq('id', result.coupon_id)
      .single()

    return NextResponse.json({
      valid: true,
      coupon: {
        id: result.coupon_id,
        ...couponDetails,
        discountAmountCents: result.discount_amount_cents
      }
    })

  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}