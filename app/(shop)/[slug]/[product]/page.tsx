import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailServer } from '@/components/products/product-detail-server'
import { RelatedProducts } from '@/components/products/related-products'
import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'
import { generateProductSEO, generateMetadata as generateSEOMetadata } from '@/lib/seo/utils'

interface PageProps {
  params: Promise<{
    slug: string
    product: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: categorySlug, product: productSlug } = await params
  const supabase = await createClient()

  // Get comprehensive product data for SEO
  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      search_keywords,
      base_price_cents,
      compare_price_cents,
      stock_level,
      sku,
      is_on_sale,
      is_featured,
      is_new,
      tags,
      brand:brands(name, slug),
      categories:product_categories(category:categories(name, slug))
    `)
    .eq('slug', productSlug)
    .single()

  // Get images via media_usage
  if (product) {
    const { data: mediaUsageData } = await supabase
      .from('media_usage')
      .select(`
        field_name,
        media:media_library (
          id,
          file_url,
          alt_text,
          title
        )
      `)
      .eq('entity_type', 'product')
      .eq('entity_id', product.id.toString())
      .order('field_name')

    // Transform media usage data to images array
    product.images = (mediaUsageData || []).map(usage => ({
      image_filename: usage.media?.file_url || '',
      alt_text: usage.media?.alt_text || '',
      is_primary: usage.field_name === 'primary_image'
    }))
  }

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false }
    }
  }

  // Use our SEO utility for consistent metadata generation
  const seoData = generateProductSEO(product)
  seoData.url = `/${categorySlug}/${productSlug}`
  
  return generateSEOMetadata(seoData)
}

async function getProduct(productSlug: string) {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      option_assignments:product_option_assignments(
        is_required,
        display_order,
        option_type:global_option_types(
          id,
          name,
          display_name,
          input_type,
          values:global_option_values(
            id,
            value,
            display_name,
            hex_color,
            sku_suffix,
            is_default
          )
        )
      ),
      option_pricing:product_option_pricing(
        option_value_id,
        price_adjustment_cents,
        stock_override,
        is_available
      )
    `)
    .eq('slug', productSlug)
    .single()
  
  if (error) {
    return null
  }
  
  if (!product) {
    return null
  }
  
  // Get images via media_usage
  const { data: mediaUsageData } = await supabase
    .from('media_usage')
    .select(`
      field_name,
      media:media_library (
        id,
        file_url,
        alt_text,
        title
      )
    `)
    .eq('entity_type', 'product')
    .eq('entity_id', product.id.toString())
    .order('field_name')

  // Transform media usage data to images array
  product.images = (mediaUsageData || []).map(usage => ({
    id: usage.media?.id,
    image_filename: usage.media?.file_url || '',
    alt_text: usage.media?.alt_text || '',
    is_primary: usage.field_name === 'primary_image',
    media: usage.media
  }))
  
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

async function getRelatedProducts(productId: string, categoryId?: string, brandId?: string) {
  const supabase = await createClient()
  
  let relatedProducts = []
  
  // First try same category
  if (categoryId) {
    const { data: categoryProductIds } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId)
      .neq('product_id', productId)
    
    if (categoryProductIds && categoryProductIds.length > 0) {
      const productIds = categoryProductIds.map(p => p.product_id)
      
      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          base_price_cents,
          stock_level,
          track_inventory,
          brand:brands!brand_id(name, slug),
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
        .eq('status', 'active')
        .is('deleted_at', null)
        .gt('stock_level', 0)
        .limit(4)
      
      relatedProducts = products || []
    }
  }
  
  // If less than 4, try same brand
  if (relatedProducts.length < 4 && brandId) {
    const excludeIds = [productId, ...relatedProducts.map(p => p.id)]
    
    const { data: brandProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        base_price_cents,
        stock_level,
        track_inventory,
        brand:brands!brand_id(name, slug),
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
      .eq('brand_id', brandId)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('is_visible', true)
      .eq('allow_purchases', true)
      .eq('status', 'active')
      .is('deleted_at', null)
      .gt('stock_level', 0)
      .limit(4 - relatedProducts.length)
    
    if (brandProducts) {
      relatedProducts = [...relatedProducts, ...brandProducts]
    }
  }
  
  // If still less than 4, get any in-stock products
  if (relatedProducts.length < 4) {
    const excludeIds = [productId, ...relatedProducts.map(p => p.id)]
    
    const { data: otherProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        base_price_cents,
        stock_level,
        track_inventory,
        brand:brands!brand_id(name, slug),
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
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('is_visible', true)
      .eq('allow_purchases', true)
      .eq('status', 'active')
      .is('deleted_at', null)
      .gt('stock_level', 0)
      .order('created_at', { ascending: false })
      .limit(4 - relatedProducts.length)
    
    if (otherProducts) {
      relatedProducts = [...relatedProducts, ...otherProducts]
    }
  }
  
  if (!relatedProducts || relatedProducts.length === 0) {
    return []
  }
  
  // Fetch images for related products via media_usage
  const productIds = relatedProducts.map(p => p.id.toString())
  
  const { data: mediaUsageData } = await supabase
    .from('media_usage')
    .select(`
      entity_id,
      field_name,
      media:media_library (
        id,
        file_url,
        alt_text
      )
    `)
    .eq('entity_type', 'product')
    .in('entity_id', productIds)
    .order('field_name')
  
  // Attach images to products
  const imagesByProduct: Record<string, any[]> = {}
  ;(mediaUsageData || []).forEach(usage => {
    if (usage.media) {
      const productId = usage.entity_id
      if (!imagesByProduct[productId]) {
        imagesByProduct[productId] = []
      }
      imagesByProduct[productId].push({
        image_filename: usage.media.file_url,
        alt_text: usage.media.alt_text,
        is_primary: usage.field_name === 'primary_image'
      })
    }
  })
  
  // Sort images so primary is first
  Object.keys(imagesByProduct).forEach(productId => {
    imagesByProduct[productId].sort((a, b) => {
      if (a.is_primary) return -1
      if (b.is_primary) return 1
      return 0
    })
  })
  
  const productsWithImages = relatedProducts.map(product => ({
    ...product,
    images: imagesByProduct[product.id] || []
  }))
  
  return productsWithImages
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
  
  // Get category ID and brand ID for related products
  const categoryId = category?.id
  const brandId = product.brand_id
  
  // Get related products
  const relatedProducts = await getRelatedProducts(
    product.id.toString(), 
    categoryId?.toString(), 
    brandId?.toString()
  )
  
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
  
  const productUrl = `${defaultUrl}/${categorySlug}/${productSlug}`

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData 
        type="product" 
        data={product} 
        url={productUrl}
      />
      
      {/* Breadcrumb Structured Data */}
      <StructuredData
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: category?.name || "Category", url: `/${categorySlug}` },
            { name: product.name, url: `/${categorySlug}/${productSlug}` }
          ]
        }}
      />

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