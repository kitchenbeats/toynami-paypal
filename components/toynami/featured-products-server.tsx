import { createClient } from '@/lib/supabase/server'
import { FeaturedProducts } from './featured-products'
import { Search } from 'lucide-react'

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
      images:product_images(
        image_filename,
        alt_text,
        is_primary
      ),
      brands(name, slug)
    `)
  
  // Filter by brand if provided
  if (brandId) {
    query = query.eq('brand_id', brandId)
  }
  
  // First try to get featured products
  let { data: featuredProducts } = await query
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
    return featuredProducts?.slice(0, 5) || []
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
        images:product_images(
          image_filename,
          alt_text,
          is_primary
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
  return products.slice(offset, offset + limit)
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