/**
 * Mailchimp API Type Definitions
 */

export interface MailchimpMemberData {
  email_address: string
  status_if_new?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending'
  status?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending'
  merge_fields?: {
    FNAME?: string
    LNAME?: string
    PHONE?: string
    [key: string]: string | undefined
  }
  tags?: string[]
  language?: string
  vip?: boolean
  timestamp_signup?: string
  timestamp_opt?: string
  ip_signup?: string
  ip_opt?: string
}

export interface MailchimpCustomerData {
  id: string
  email_address: string
  opt_in_status: boolean
  company?: string
  first_name?: string
  last_name?: string
  orders_count?: number
  total_spent?: number
  address?: {
    address1?: string
    address2?: string
    city?: string
    province?: string
    province_code?: string
    postal_code?: string
    country?: string
    country_code?: string
  }
}

export interface MailchimpOrderData {
  id: string
  customer: {
    id: string
    email_address?: string
    opt_in_status?: boolean
    company?: string
    first_name?: string
    last_name?: string
  }
  store_id?: string
  campaign_id?: string
  financial_status?: 'pending' | 'paid' | 'cancelled' | 'refunded'
  fulfillment_status?: 'pending' | 'shipped' | 'partial' | 'delivered'
  currency_code?: string
  order_total?: number
  order_url?: string
  discount_total?: number
  tax_total?: number
  shipping_total?: number
  tracking_code?: string
  processed_at_foreign?: string
  cancelled_at_foreign?: string
  updated_at_foreign?: string
  shipping_address?: MailchimpAddress
  billing_address?: MailchimpAddress
  promos?: Array<{
    code: string
    amount_discounted: number
    type: 'fixed' | 'percentage'
  }>
  lines?: MailchimpOrderLine[]
  outreach?: {
    id?: string
  }
  tracking_number?: string
  tracking_carrier?: string
  tracking_url?: string
}

export interface MailchimpOrderLine {
  id: string
  product_id: string
  product_variant_id?: string
  quantity: number
  price: number
  discount?: number
  product_title?: string
  product_variant_title?: string
}

export interface MailchimpAddress {
  name?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  province_code?: string
  postal_code?: string
  country?: string
  country_code?: string
  phone?: string
}

export interface MailchimpCartData {
  id: string
  customer: {
    id: string
    email_address?: string
    opt_in_status?: boolean
    company?: string
    first_name?: string
    last_name?: string
  }
  campaign_id?: string
  checkout_url?: string
  currency_code?: string
  order_total?: number
  tax_total?: number
  lines?: Array<{
    id: string
    product_id: string
    product_variant_id?: string
    quantity: number
    price: number
    product_title?: string
    product_variant_title?: string
  }>
}

export interface MailchimpProductData {
  id: string
  title: string
  handle?: string
  url?: string
  description?: string
  type?: string
  vendor?: string
  image_url?: string
  variants?: Array<{
    id: string
    title: string
    url?: string
    sku?: string
    price: number
    inventory_quantity?: number
    image_url?: string
    visibility?: string
    created_at?: string
    updated_at?: string
  }>
  images?: Array<{
    id: string
    url: string
    variant_ids?: string[]
  }>
  published_at_foreign?: string
}