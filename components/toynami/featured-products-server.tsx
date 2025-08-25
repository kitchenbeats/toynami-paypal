import { createClient } from '@/lib/supabase/server'
import { FeaturedProducts } from './featured-products'
import { Search } from 'lucide-react'

interface ProductImage {
  image_filename: string
  alt_text?: string
  is_primary: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  base_price_cents?: number
  stock_level?: number
  track_inventory?: string
  preorder_release_date?: string
  preorder_message?: string
  sort_order?: number
  categories?: Array<{
    category?: {
      slug: string
      name: string
    }
  }>
  variants?: Array<{
    id: string
    price_cents: number
    stock: number
    is_active: boolean
  }>
  brands?: {
    name: string
    slug: string
  }
  images?: ProductImage[]
}

interface MediaUsage {
  entity_id: string
  field_name: string
  media?: {
    id: string
    file_url: string
    alt_text?: string
    title?: string
  }
}

async function attachImagesToProducts(products: Product[]): Promise<Product[]> {
  if (!products || products.length === 0) return products
  
  const supabase = await createClient()
  const productIds = products.map(p => p.id.toString())
  
  // Get images via media_usage
  const { data: mediaUsageData } = await supabase
    .from('media_usage')
    .select(`
      entity_id,
      field_name,
      media:media_library (
        id,
        file_url,
        alt_text,
        title
      )
    `)
    .eq('entity_type', 'product')
    .in('entity_id', productIds)
    .order('field_name')
  
  // Group images by product
  const imagesByProduct: Record<string, ProductImage[]> = {}
  
  const typedMediaUsageData = mediaUsageData as MediaUsage[] | null
  ;(typedMediaUsageData || []).forEach(usage => {
    if (!usage.media) return
    
    const productId = usage.entity_id
    if (!imagesByProduct[productId]) {
      imagesByProduct[productId] = []
    }
    
    imagesByProduct[productId].push({
      image_filename: usage.media.file_url,
      alt_text: usage.media.alt_text,
      is_primary: usage.field_name === 'primary_image'
    })
  })
  
  // Attach images to products
  return products.map(product => ({
    ...product,
    images: imagesByProduct[product.id] || []
  }))
}

async function getFeaturedProducts(brandId?: string, limit: number = 13, page: number = 1) {
  const supabase = await createClient()
  const offset = (page - 1) * limit
  
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      base_price_cents,
      stock_level,
      track_inventory,
      preorder_release_date,
      preorder_message,
      sort_order,
      categories:product_categories(
        category:categories(slug, name)
      ),
      variants:product_variants(
        id,
        price_cents,
        stock,
        is_active
      ),
      brands(name, slug)
    `)
  
  // Filter by brand if provided
  if (brandId) {
    query = query.eq('brand_id', brandId)
  }
  
  // First try to get featured products
  const { data: featuredProducts } = await query
    .eq('is_featured', true)
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  // For home page (limit 5), only use featured products
  if (limit === 5 && (!featuredProducts || featuredProducts.length === 0)) {
    return []
  }
  
  // For home page, return only first 5 featured products
  if (limit === 5) {
    const productsToReturn = featuredProducts?.slice(0, 5) || []
    return await attachImagesToProducts(productsToReturn)
  }
  
  // For brand pages, fill with latest products if not enough featured
  let products = featuredProducts || []
  
  if (products.length < limit) {
    let fallbackQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        base_price_cents,
        stock_level,
        track_inventory,
        preorder_release_date,
        preorder_message,
        sort_order,
        categories:product_categories(
          category:categories(slug, name)
        ),
        variants:product_variants(
          id,
          price_cents,
          stock,
          is_active
        ),
        brands(name, slug)
      `)
    
    // Filter by brand if provided
    if (brandId) {
      fallbackQuery = fallbackQuery.eq('brand_id', brandId)
    }
    
    // Exclude already fetched featured products
    const featuredIds = products.map(p => p.id)
    if (featuredIds.length > 0) {
      fallbackQuery = fallbackQuery.not('id', 'in', `(${featuredIds.join(',')})`)
    }
    
    const { data: latestProducts } = await fallbackQuery
      .eq('status', 'active')
      .eq('is_visible', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit - products.length)
    
    if (latestProducts) {
      products = [...products, ...latestProducts]
    }
  }
  
  // Apply pagination for the final result
  const paginatedProducts = products.slice(offset, offset + limit)
  return await attachImagesToProducts(paginatedProducts)
}

export async function FeaturedProductsSection({ 
  brandId, 
  showWrapper = true,
  showTitle = true,
  showSearchBar = true,
  limit = 5,
  page = 1,
  showPagination = false
}: { 
  brandId?: string
  showWrapper?: boolean
  showTitle?: boolean
  showSearchBar?: boolean
  limit?: number
  page?: number
  showPagination?: boolean
} = {}) {
  const products = await getFeaturedProducts(brandId, limit, page)

  // For brand pages, just return the products component
  if (!showWrapper) {
    return (
      <>
        <FeaturedProducts products={products} />
        {showPagination && products.length === limit && (
          <div className="text-center mt-8">
            <div className="inline-flex gap-2">
              {page > 1 && (
                <a 
                  href={`?page=${page - 1}`} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2 bg-blue-500 text-white rounded">
                Page {page}
              </span>
              {products.length === limit && (
                <a 
                  href={`?page=${page + 1}`} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // For home page, include the full wrapper with gradient and search
  return (
    <div className="figma-featured-section gradient-product">
      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="mobile-search-bar-section">
          <div className="container">
            <div className="mobile-search-wrapper">
              <div className="mobile-search-trigger" data-dropdown="quickSearch" data-options="align:left">
                <div className="mobile-search-form">
                  <input
                    type="text"
                    className="mobile-search-input"
                    placeholder="Search"
                    readOnly
                  />
                  <Search className="mobile-search-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="figma-featured-products-parent container">
        {showTitle && (
          <h2 className="figma-featured-products homepage-section-heading">
            Featured Products
          </h2>
        )}
        
        <FeaturedProducts products={products} />
      </div>
    </div>
  )
}