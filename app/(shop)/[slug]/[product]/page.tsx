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
import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'

interface PageProps {
  params: Promise<{
    slug: string
    product: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: categorySlug, product: productSlug } = await params
  const supabase = await createClient()

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

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
      video_url,
      preorder_release_date,
      preorder_message,
      brand:brands(id, name, slug),
      images:product_images(image_filename, alt_text, is_primary, position),
      variants:product_variants(id, price_cents, stock, is_active, sku, option_values),
      categories:product_categories(category:categories(name, slug))
    `)
    .eq('slug', productSlug)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false }
    }
  }

  // Get primary image
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const imageUrl = primaryImage?.image_filename 
    ? `${defaultUrl}/images/products/${primaryImage.image_filename}`
    : '/opengraph-image.png'

  // Build SEO content
  const brandName = product.brand?.name || ''
  const baseTitle = product.meta_title || `${product.name}${brandName ? ` - ${brandName}` : ''}`
  const title = `${baseTitle} - Collectibles & Toys`
  
  const description = product.meta_description || 
    `${product.description ? product.description.substring(0, 140) : `Shop ${product.name}${brandName ? ` from ${brandName}` : ''} at Toynami Store.`} Premium collectible${product.is_on_sale ? ' on sale' : ''}${product.is_new ? ', new release' : ''}.`

  // Build keywords from multiple sources
  const keywords: string[] = []
  if (product.meta_keywords) keywords.push(...product.meta_keywords.split(',').map((k: string) => k.trim()))
  if (product.search_keywords) keywords.push(...product.search_keywords.split(',').map((k: string) => k.trim()))
  if (product.tags) keywords.push(...product.tags)
  if (brandName) keywords.push(brandName.toLowerCase())
  
  // Add category names
  const categoryNames = product.categories?.map(pc => pc.category.name.toLowerCase()) || []
  keywords.push(...categoryNames)
  
  // Add product-specific keywords
  keywords.push(product.name.toLowerCase(), 'collectible', 'toy', 'figure')
  if (product.sku) keywords.push(product.sku.toLowerCase())

  // Price information
  const price = product.base_price_cents / 100
  const comparePrice = product.compare_price_cents ? product.compare_price_cents / 100 : null
  const availability = product.stock_level > 0 ? 'in stock' : 'out of stock'

  const productUrl = `${defaultUrl}/${categorySlug}/${productSlug}`

  // Build rich product metadata
  return {
    title,
    description,
    keywords: [...new Set(keywords)], // Remove duplicates
    openGraph: {
      title: baseTitle,
      description,
      type: 'website',
      url: productUrl,
      siteName: 'Toynami Store',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 1200,
        alt: primaryImage?.alt_text || product.name
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: productUrl
    },
    other: {
      // Rich product metadata
      'product:price:amount': price.toString(),
      'product:price:currency': 'USD',
      'product:availability': availability,
      'product:brand': brandName,
      'product:category': categoryNames.join(', '),
      'product:sku': product.sku || '',
      'product:condition': 'new',
      ...(comparePrice && { 'product:price:compare': comparePrice.toString() }),
      ...(product.is_on_sale && { 'product:sale': 'true' }),
      ...(product.is_featured && { 'product:featured': 'true' }),
      ...(product.is_new && { 'product:new': 'true' }),
      ...(product.preorder_release_date && { 
        'product:preorder': 'true',
        'product:release_date': product.preorder_release_date 
      })
    }
  }
}

async function getProduct(productSlug: string) {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
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