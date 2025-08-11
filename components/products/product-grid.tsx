'use client'

import { ProductCard } from '@/components/toynami/product-card-new'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  brand?: { name: string; slug: string }
  brand_id?: string
  variants?: Array<{
    id: string
    price_cents: number
    stock: number
    sku?: string
    is_active: boolean
  }>
  images?: Array<{
    image_filename: string
    alt_text?: string
    is_primary: boolean
  }>
  categories?: Array<{
    category: { name: string; slug: string }
  }>
  base_price_cents?: number
  compare_price_cents?: number
  stock_level?: number
  track_inventory?: string
  is_featured: boolean
  is_new: boolean
  rating?: number
  review_count?: number
  created_at: string
}

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
}

export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // Max 3 columns even if 4 requested
  }

  return (
    <div className={`figma-frame-div ${gridCols[columns > 3 ? 3 : columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}