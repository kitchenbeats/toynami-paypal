// Admin Panel Types
// Centralized type definitions for admin components

export interface AdminUser {
  id: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface SyncLog {
  id: string
  sync_type: string
  status: 'success' | 'error' | 'partial'
  message?: string
  items_synced?: number
  items_failed?: number
  error_details?: Record<string, unknown> | string | null
  created_at: string
}

// Re-export data types for admin use
export type {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Brand,
  Banner,
  BlogPost,
  CustomerGroup,
} from '@/lib/data'

// Admin specific extended types
export interface ProductWithRelations extends Product {
  brand?: Brand
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  images?: ProductImage[]
  customer_group_prices?: CustomerGroupPrice[]
}

export interface ProductCategory {
  id: string
  product_id: string
  category_id: string
  display_order?: number
  category?: Category
}

export interface CustomerGroupPrice {
  id: string
  product_id: string
  customer_group_id: string
  price_cents: number
  customer_group?: CustomerGroup
}

export interface GlobalOption {
  id: string
  name: string
  type: 'text' | 'select' | 'multi_select' | 'number' | 'boolean' | 'date'
  required: boolean
  values?: GlobalOptionValue[]
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GlobalOptionValue {
  id: string
  option_id: string
  value: string
  label: string
  is_default: boolean
  sort_order: number
}

export interface ProductOption {
  id: string
  product_id: string
  option_id: string
  required: boolean
  option?: GlobalOption
}

// Settings types
export interface Setting {
  id: string
  key: string
  value: string
  category: 'general' | 'social' | 'seo' | 'payment' | 'shipping' | 'email'
  description?: string
  updated_at: string
}

// Admin action types
export interface AdminAction<T = unknown> {
  type: 'create' | 'update' | 'delete' | 'bulk_update' | 'bulk_delete'
  entity: string
  data?: T
  ids?: string[]
  user_id: string
  timestamp: string
}

// Table filter and sort types
export interface TableFilters {
  search?: string
  status?: string[]
  categories?: string[]
  brands?: string[]
  featured?: boolean
  visible?: boolean
  stock?: 'in_stock' | 'out_of_stock' | 'low_stock'
  price_range?: {
    min?: number
    max?: number
  }
}

export interface TableSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface TablePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Form types for admin operations
export interface ProductFormData {
  name: string
  slug: string
  sku?: string
  description?: string
  brand_id?: string
  status: 'active' | 'draft' | 'archived'
  is_featured: boolean
  is_visible: boolean
  is_new: boolean
  sort_order: number
  base_price_cents?: number
  compare_at_price_cents?: number
  stock_level?: number
  track_inventory: 'none' | 'by product' | 'by variant'
  allow_purchases: boolean
  min_purchase_quantity: number
  max_purchase_quantity?: number
  preorder_release_date?: string
  preorder_message?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  categories: string[]
  images: File[]
  variants?: ProductVariantFormData[]
  options?: string[]
  customer_group_prices?: {
    group_id: string
    price_cents: number
  }[]
}

export interface ProductVariantFormData {
  sku: string
  price_cents: number
  compare_at_price_cents?: number
  stock: number
  is_active: boolean
  option_values: Record<string, string>
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  is_featured: boolean
  is_visible: boolean
  display_order: number
  meta_title?: string
  meta_description?: string
}

export interface BrandFormData {
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  is_featured: boolean
  is_visible: boolean
  display_order: number
}

export interface BannerFormData {
  name: string
  position: 'upper' | 'middle' | 'lower' | 'hero'
  link_url?: string
  link_text?: string
  desktop_image_url: string
  mobile_image_url?: string
  is_active: boolean
  start_date?: string
  end_date?: string
  display_order: number
}

export interface BlogPostFormData {
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  featured_image_url?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  tags?: string[]
  meta_title?: string
  meta_description?: string
}

export interface CustomerGroupFormData {
  name: string
  slug: string
  description?: string
  tier_level: number
  discount_percentage?: number
  min_purchase_amount?: number
  is_active: boolean
}

export interface GlobalOptionFormData {
  name: string
  type: 'text' | 'select' | 'multi_select' | 'number' | 'boolean' | 'date'
  required: boolean
  display_order: number
  is_active: boolean
  values?: {
    value: string
    label: string
    is_default: boolean
    sort_order: number
  }[]
}

// Response types
export interface AdminApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface BulkOperationResult {
  success: boolean
  processed: number
  failed: number
  errors?: Array<{
    id: string
    error: string
  }>
}

// Import the base types from data layer
import type {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Brand,
  CustomerGroup,
} from '@/lib/data'