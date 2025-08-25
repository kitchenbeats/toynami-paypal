import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateCouponSchema } from '@/lib/validations/api'
import { apiHandler, validateRequest, apiError, apiSuccess } from '@/lib/api/utils'

export const POST = apiHandler(async (request: NextRequest) => {
  // Validate request body
  const { data: input, error } = await validateRequest(request, validateCouponSchema)
  if (error) return error

  const supabase = await createClient()
  
  // Get current user (if authenticated)
  const { data: { user } } = await supabase.auth.getUser()

  // Call the validation function
  const { data, error: rpcError } = await supabase.rpc('validate_coupon_usage', {
    p_coupon_code: input.couponCode,
    p_user_id: input.customerId || user?.id || null,
    p_order_total_cents: input.orderTotalCents,
    p_product_ids: input.productIds,
    p_category_ids: input.categoryIds
  })

  if (rpcError) {
    console.error('Coupon validation error:', rpcError)
    return apiError('Failed to validate coupon', 500)
  }

  const result = data[0]
  
  if (!result.is_valid) {
    return apiError(result.error_message || 'Invalid coupon', 400, { valid: false })
  }

  // Get additional coupon details for response
  const { data: couponDetails } = await supabase
    .from('coupons')
    .select('code, name, description, discount_type, discount_value')
    .eq('id', result.coupon_id)
    .single()

  return apiSuccess({
    valid: true,
    coupon: {
      id: result.coupon_id,
      ...couponDetails,
      discountAmountCents: result.discount_amount_cents
    }
  })
})