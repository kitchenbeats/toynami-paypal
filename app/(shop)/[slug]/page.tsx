import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductsGrid } from '@/components/products/products-grid'
import { ProductFilters } from '@/components/products/product-filters'
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
import { generateCategorySEO, generateMetadata as generateSEOMetadata } from '@/lib/seo/utils'

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
    per_page?: string
    sort?: string
    brand?: string
    min_price?: string
    max_price?: string
    in_stock?: string
    search?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  // Check if it's a category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description, meta_title, meta_description, meta_keywords, image_url, banner_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (category) {
    // Get product count for this category
    const { count } = await supabase
      .from('product_categories')
      .select('product_id', { count: 'exact', head: true })
      .eq('category_id', category.id)

    // Use our SEO utility for consistent metadata generation
    const categoryWithCount = { ...category, productCount: count || 0 }
    const seoData = generateCategorySEO(categoryWithCount)
    seoData.url = `/${slug}`
    
    return generateSEOMetadata(seoData)
  }

  // Check if it's a CMS page
  const { data: page } = await supabase
    .from('pages')
    .select('title, content, meta_title, meta_description, meta_keywords')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (page) {
    const title = page.meta_title || page.title
    const description = page.meta_description || 
      (page.content ? page.content.replace(/<[^>]*>/g, '').substring(0, 160) : `${page.title} - Toynami Store`)
    const keywords = page.meta_keywords?.split(',').map((k: string) => k.trim()) || [page.title.toLowerCase()]

    const pageUrl = `${defaultUrl}/${slug}`

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'article',
        url: pageUrl,
        siteName: 'Toynami Store',
        images: [{
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/twitter-image.png']
      },
      alternates: {
        canonical: pageUrl
      },
      other: {
        'page:type': 'cms'
      }
    }
  }

  // Return default if nothing found (will trigger 404)
  return {
    title: 'Page Not Found',
    robots: {
      index: false,
      follow: false
    }
  }
}

async function getCategoryInfo(slug: string) {
  const supabase = await createClient()
  
  
  // Check if it's a category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (category) {
    return { type: 'category', data: category }
  }
  
  // Check if it's a CMS page
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (page) {
    return { type: 'page', data: page }
  }
  
  return null
}

async function getProducts(categorySlug: string, searchParams: Awaited<PageProps['searchParams']>) {
  const params = searchParams
  const supabase = await createClient()
  
  // Get category info
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()
  
  if (!category) return { products: [], totalCount: 0, currentPage: 1, perPage: 12 }
  
  // Pagination
  const page = parseInt(params.page || '1')
  const perPage = parseInt(params.per_page || '12')
  const offset = (page - 1) * perPage
  
  // Build base query for count
  let countQuery = supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('is_visible', true)
    .eq('allow_purchases', true)
    .is('deleted_at', null)
  
  // Build query for data
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      base_price_cents,
      stock_level,
      track_inventory,
      is_visible,
      allow_purchases,
      status,
      sort_order,
      created_at,
      preorder_release_date,
      preorder_message,
      variants:product_variants(
        id,
        price_cents,
        stock,
        is_active
      ),
      brand:brands!brand_id(name, slug),
      categories:product_categories(
        category:categories(slug, name)
      )
    `)
    .eq('status', 'active')
    .eq('is_visible', true)
    .eq('allow_purchases', true)
    .is('deleted_at', null)
  
  // Special handling for "brands" category - show all products with brands
  if (categorySlug === 'brands') {
    // Don't filter by category, just ensure products have brands
    query = query.not('brand_id', 'is', null)
    countQuery = countQuery.not('brand_id', 'is', null)
  } else {
    // Filter by category for other categories
    const { data: productIds } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', category.id)
    
    if (productIds && productIds.length > 0) {
      const ids = productIds.map(p => p.product_id)
      query = query.in('id', ids)
      countQuery = countQuery.in('id', ids)
    } else {
      // No products in this category
      return { products: [], totalCount: 0, currentPage: page, perPage }
    }
  }
  
  // Apply price filters
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) * 100 : 0
    const maxPrice = params.max_price ? parseFloat(params.max_price) * 100 : 999999999
    
    query = query.gte('base_price_cents', minPrice).lte('base_price_cents', maxPrice)
    countQuery = countQuery.gte('base_price_cents', minPrice).lte('base_price_cents', maxPrice)
  }
  
  // Apply brand filter
  if (params.brand) {
    const { data: brandData } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', params.brand)
      .single()
    
    if (brandData) {
      query = query.eq('brand_id', brandData.id)
      countQuery = countQuery.eq('brand_id', brandData.id)
    }
  }
  
  // Apply search filter
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
    countQuery = countQuery.ilike('name', `%${params.search}%`)
  }
  
  // Get total count
  const { count } = await countQuery
  
  // Apply sorting
  switch (params.sort) {
    case 'featured':
      query = query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      break
    case 'newest':
      query = query.order('id', { ascending: false })
      break
    case 'best-selling':
      query = query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      break
    case 'name-asc':
      query = query.order('name', { ascending: true })
      break
    case 'name-desc':
      query = query.order('name', { ascending: false })
      break
    case 'price-asc':
      query = query.order('base_price_cents', { ascending: true, nullsFirst: false })
      break
    case 'price-desc':
      query = query.order('base_price_cents', { ascending: false, nullsFirst: false })
      break
    case 'year-oldest':
      query = query.order('id', { ascending: true })
      break
    case 'year-newest':
      query = query.order('id', { ascending: false })
      break
    default:
      query = query.order('id', { ascending: false })
      break
  }
  
  // Apply pagination
  query = query.range(offset, offset + perPage - 1)
  
  const { data: products } = await query
  
  // Get images for all products via media_usage
  let productsWithImages = products || []
  
  if (productsWithImages.length > 0) {
    const productIds = productsWithImages.map(p => p.id.toString())
    
    // Query media_usage to get images for these products
    const { data: mediaUsageData } = await supabase
      .from('media_usage')
      .select(`
        entity_id,
        field_name,
        media:media_library (
          id,
          filename,
          file_url,
          alt_text,
          title,
          sort_order
        )
      `)
      .eq('entity_type', 'product')
      .in('entity_id', productIds)
      .order('field_name', { ascending: true })
    
    // Group images by product
    interface ProductImage {
      image_filename: string
      alt_text: string | null
      is_primary: boolean
    }
    
    const imagesByProduct: Record<string, ProductImage[]> = {}
    
    ;(mediaUsageData || []).forEach(usage => {
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
    productsWithImages = productsWithImages.map(product => ({
      ...product,
      images: imagesByProduct[product.id] || []
    }))
  }
  
  return {
    products: productsWithImages,
    totalCount: count || 0,
    currentPage: page,
    perPage
  }
}

async function getFilterData() {
  const supabase = await createClient()
  
  const [categoriesResult, brandsResult, priceRangeResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .eq('show_in_menu', true)
      .is('deleted_at', null)
      .order('display_order'),
    supabase
      .from('brands')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('products')
      .select('base_price_cents')
      .eq('status', 'active')
      .eq('is_visible', true)
      .eq('allow_purchases', true)
      .is('deleted_at', null)
      .not('base_price_cents', 'is', null)
      .gt('base_price_cents', 0)
  ])
  
  const prices = priceRangeResult.data?.map(p => p.base_price_cents).filter(p => p > 0) || []
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 50000
  
  return {
    categories: categoriesResult.data || [],
    brands: brandsResult.data || [],
    priceRange: {
      min: Math.floor(minPrice / 100),
      max: Math.ceil(maxPrice / 100)
    }
  }
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const search = await searchParams
  
  // Get page/category info
  const pageInfo = await getCategoryInfo(slug)
  
  if (!pageInfo) {
    notFound()
  }
  
  // If it's a CMS page, render the page content
  if (pageInfo.type === 'page') {
    const page = pageInfo.data
    return (
      <>
        <div className="hero-section">
            <div className="container mx-auto px-4 relative z-10 text-white py-12">
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-gray-300 hover:text-white transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">{page.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-5xl font-bold">{page.title}</h1>
            </div>
          </div>
          
        <div className="container mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </>
    )
  }
  
  // Otherwise it's a category page - render products
  const category = pageInfo.data
  const [productsData, filterData] = await Promise.all([
    getProducts(slug, search),
    getFilterData()
  ])
  
  return (
    <>
      {/* Category Structured Data */}
      <StructuredData 
        type="category" 
        data={category} 
        url={`/${slug}`}
      />
      
      <div className="hero-section">
          <div className="container mx-auto px-4 relative z-10 text-white py-12">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">{category.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-5xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-gray-300 mt-3 text-lg">{category.description}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="pt-12 pb-16">
            <div className="grid lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <ProductFilters
                  categories={filterData.categories}
                  brands={filterData.brands}
                  priceRange={filterData.priceRange}
                />
              </aside>
              
              <div className="lg:col-span-3">
                <Suspense fallback={<div>Loading products...</div>}>
                  <ProductsGrid 
                    products={productsData.products}
                    totalCount={productsData.totalCount}
                    currentPage={productsData.currentPage}
                    perPage={productsData.perPage}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}