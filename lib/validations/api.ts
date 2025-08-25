import { z } from 'zod'

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(20),
})

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// Coupon validation schemas
export const validateCouponSchema = z.object({
  couponCode: z.string().min(1, 'Coupon code is required').max(50),
  orderTotalCents: z.number().int().nonnegative('Order total must be non-negative'),
  productIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  customerId: z.string().uuid().optional(),
})

export const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number().positive(),
  min_order_amount_cents: z.number().int().nonnegative().optional(),
  max_uses: z.number().int().positive().optional(),
  max_uses_per_customer: z.number().int().positive().optional(),
  valid_from: z.string().datetime().optional(),
  valid_to: z.string().datetime().optional(),
  is_active: z.boolean().default(true),
  applies_to_products: z.array(z.string().uuid()).optional(),
  applies_to_categories: z.array(z.string().uuid()).optional(),
})

export const updateCouponSchema = createCouponSchema.partial()

// Order validation schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    variantId: z.string().optional(),
    price: z.number().int().positive(),
    productName: z.string(),
    image: z.string().optional(),
  })).min(1, 'Order must contain at least one item'),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  }),
  shipping: z.object({
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    zip: z.string().min(5),
    country: z.string().default('US'),
  }),
  billing: z.object({
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    zip: z.string().min(5),
    country: z.string().default('US'),
  }).optional(),
})

// Shipping validation schemas
export const calculateShippingSchema = z.object({
  shipTo: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    cityLocality: z.string().min(1),
    stateProvince: z.string().min(2).max(2),
    postalCode: z.string().min(5),
    countryCode: z.string().length(2).default('US'),
    addressResidentialIndicator: z.enum(['yes', 'no', 'unknown']).optional(),
  }),
  shipFrom: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    cityLocality: z.string().min(1),
    stateProvince: z.string().min(2).max(2),
    postalCode: z.string().min(5),
    countryCode: z.string().length(2).default('US'),
  }).optional(),
  packages: z.array(z.object({
    weight: z.object({
      value: z.number().positive(),
      unit: z.enum(['pound', 'ounce', 'gram', 'kilogram']),
    }),
    dimensions: z.object({
      height: z.number().positive(),
      width: z.number().positive(),
      length: z.number().positive(),
      unit: z.enum(['inch', 'centimeter']),
    }).optional(),
  })).min(1),
})

// Tax calculation schemas
export const calculateTaxSchema = z.object({
  customerID: z.string(),
  cartID: z.string(),
  cartItems: z.array(z.object({
    index: z.number().int().nonnegative(),
    itemID: z.string(),
    tic: z.string().default('00000'),
    price: z.number().positive(),
    qty: z.number().int().positive(),
  })),
  origin: z.object({
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string().length(2),
    zip5: z.string().length(5),
    zip4: z.string().optional(),
  }),
  destination: z.object({
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string().length(2),
    zip5: z.string().length(5),
    zip4: z.string().optional(),
  }),
  deliveredBySeller: z.boolean().default(false),
  exemptCert: z.object({
    certificateID: z.string().optional(),
    certificateNumber: z.string().optional(),
  }).optional(),
})

// PayPal validation schemas
export const paypalCreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    variantId: z.string().optional(),
  })).min(1),
  shippingCost: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  shippingAddress: z.object({
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    countryCode: z.string().default('US'),
  }).optional(),
})

export const paypalCaptureOrderSchema = z.object({
  orderID: z.string().min(1),
  payerID: z.string().optional(),
  cartItems: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    variantId: z.string().optional(),
  })),
  shippingAddress: z.object({
    recipient_name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country_code: z.string(),
  }).optional(),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
  }).optional(),
})

// Admin validation schemas
export const promotionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed', 'bogo', 'free_shipping']),
  discount_value: z.number().nonnegative(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  is_active: z.boolean().default(true),
  min_purchase_amount: z.number().nonnegative().optional(),
  max_uses: z.number().int().positive().optional(),
  conditions: z.record(z.string(), z.unknown()).optional(),
})

// Product validation schemas
export const productUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  retail_price_cents: z.number().int().nonnegative().optional(),
  sale_price_cents: z.number().int().nonnegative().nullable().optional(),
  base_price_cents: z.number().int().nonnegative().optional(),
  compare_price_cents: z.number().int().nonnegative().nullable().optional(),
  stock_level: z.number().int().nonnegative().optional(),
  track_inventory: z.boolean().optional(),
  allow_purchases: z.boolean().optional(),
  is_visible: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  weight: z.number().nonnegative().optional(),
  width: z.number().nonnegative().optional(),
  height: z.number().nonnegative().optional(),
  depth: z.number().nonnegative().optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  min_purchase_quantity: z.number().int().positive().optional(),
  max_purchase_quantity: z.number().int().positive().optional(),
})

// Email/Mailchimp validation schemas
export const mailchimpEventSchema = z.object({
  email: z.string().email(),
  eventName: z.string().min(1),
  properties: z.record(z.string(), z.unknown()).optional(),
})

// Type exports for use in components
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>
export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CalculateShippingInput = z.infer<typeof calculateShippingSchema>
export type CalculateTaxInput = z.infer<typeof calculateTaxSchema>
export type PayPalCreateOrderInput = z.infer<typeof paypalCreateOrderSchema>
export type PayPalCaptureOrderInput = z.infer<typeof paypalCaptureOrderSchema>
export type PromotionInput = z.infer<typeof promotionSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type MailchimpEventInput = z.infer<typeof mailchimpEventSchema>