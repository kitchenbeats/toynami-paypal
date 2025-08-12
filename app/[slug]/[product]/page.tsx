import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailServer } from '@/components/products/product-detail-server'
import { RelatedProducts } from '@/components/products/related-products'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageProps {
  params: Promise<{
    slug: string
    product: string
  }>
}

async function getProduct(productSlug: string) {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*)
    `)
    .eq('slug', productSlug)
    .single()
  
  if (error) {
    return null
  }
  
  if (!product) {
    return null
  }
  
  return product
}

async function getCategoryInfo(categorySlug: string) {
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', categorySlug)
    .single()
  
  return category
}

async function getRelatedProducts(productId: string, categoryIds: string[]) {
  const supabase = await createClient()
  
  // Get products from the same categories
  const { data: relatedProductIds } = await supabase
    .from('product_categories')
    .select('product_id')
    .in('category_id', categoryIds)
    .neq('product_id', productId)
    .limit(20)
  
  if (!relatedProductIds || relatedProductIds.length === 0) {
    // Fallback to newest products
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
        brand:brands!brand_id(name, slug),
        images:product_images(
          image_filename,
          alt_text,
          is_primary
        ),
        variants:product_variants(
          id,
          price_cents,
          stock,
          is_active
        ),
        categories:product_categories(
          category:categories(slug, name)
        )
      `)
      .eq('is_visible', true)
      .eq('allow_purchases', true)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(8)
    
    return products || []
  }
  
  const productIds = relatedProductIds.map(p => p.product_id)
  
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
      brand:brands!brand_id(name, slug),
      images:product_images(
        image_filename,
        alt_text,
        is_primary,
        position
      ),
      variants:product_variants(
        id,
        price_cents,
        stock,
        is_active
      ),
      categories:product_categories(
        category:categories(slug, name)
      )
    `)
    .in('id', productIds)
    .eq('is_visible', true)
    .eq('allow_purchases', true)
    .limit(8)
  
  return products || []
}

export default async function ProductPage({ params }: PageProps) {
  const { slug: categorySlug, product: productSlug } = await params
  
  // Get the product
  const product = await getProduct(productSlug)
  
  if (!product) {
    notFound()
  }
  
  // Get category info for breadcrumb
  const category = await getCategoryInfo(categorySlug)
  
  // Get related products - skip for now since we don't have categories loaded
  const relatedProducts: any[] = []
  
  return (
    <>
      {/* Hero Section with Breadcrumbs */}
      <div className="hero-section">
        <div className="container mx-auto px-4 relative z-10 text-white py-12">
          <h1 className="text-5xl font-bold">{product.name}</h1>
          <p>Price: ${product.base_price_cents / 100}</p>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <ProductDetailServer slug={productSlug} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </>
  )
}