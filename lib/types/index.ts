// Re-export all types for easier imports
export * from './admin'

// Export database types from data layer
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