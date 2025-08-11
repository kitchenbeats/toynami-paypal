import { createClient } from '@/lib/supabase/server'
import { FeaturedProducts } from './featured-products'
import { Search } from 'lucide-react'

async function getFeaturedProducts() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
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
      brand:brands!brand_id(name, slug)
    `)
    .eq('is_featured', true)
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(5) // 1 large featured + 4 smaller grid items

  return products || []
}

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts()

  return (
    <div className="figma-featured-section gradient-product">
      {/* Mobile Search Bar */}
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

      <div className="figma-featured-products-parent container">
        <h2 className="figma-featured-products homepage-section-heading">
          Featured Products
        </h2>
        
        <FeaturedProducts products={products} />
      </div>
    </div>
  )
}