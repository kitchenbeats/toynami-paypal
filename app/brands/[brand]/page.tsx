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

interface PageProps {
  params: Promise<{
    brand: string
  }>
  searchParams: Promise<{
    page?: string
    per_page?: string
    sort?: string
    category?: string
    min_price?: string
    max_price?: string
    in_stock?: string
    search?: string
  }>
}

async function getBrandInfo(slug: string) {
  const supabase = await createClient()
  
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  return brand
}

async function getProducts(brandSlug: string, searchParams: Awaited<PageProps['searchParams']>) {
  const params = searchParams
  const supabase = await createClient()
  
  // Get brand info
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', brandSlug)
    .single()
  
  if (!brand) return { products: [], totalCount: 0, currentPage: 1, perPage: 12 }
  
  // Pagination
  const page = parseInt(params.page || '1')
  const perPage = parseInt(params.per_page || '12')
  const offset = (page - 1) * perPage
  
  // Build base query for count
  let countQuery = supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', brand.id)
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
      images:product_images(
        image_filename,
        alt_text,
        is_primary
      ),
      brand:brands!brand_id(name, slug),
      categories:product_categories(
        category:categories(slug, name)
      )
    `)
    .eq('brand_id', brand.id)
    .eq('status', 'active')
    .eq('is_visible', true)
    .eq('allow_purchases', true)
    .is('deleted_at', null)
  
  // Apply category filter
  if (params.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    
    if (categoryData) {
      const { data: productIds } = await supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', categoryData.id)
      
      if (productIds && productIds.length > 0) {
        const ids = productIds.map(p => p.product_id)
        query = query.in('id', ids)
        countQuery = countQuery.in('id', ids)
      }
    }
  }
  
  // Apply price filters
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) * 100 : 0
    const maxPrice = params.max_price ? parseFloat(params.max_price) * 100 : 999999999
    
    query = query.gte('base_price_cents', minPrice).lte('base_price_cents', maxPrice)
    countQuery = countQuery.gte('base_price_cents', minPrice).lte('base_price_cents', maxPrice)
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
  
  return {
    products,
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

export default async function BrandProductsPage({ params, searchParams }: PageProps) {
  const { brand: brandSlug } = await params
  const search = await searchParams
  
  const brand = await getBrandInfo(brandSlug)
  
  if (!brand) {
    notFound()
  }
  
  const [productsData, filterData] = await Promise.all([
    getProducts(brandSlug, search),
    getFilterData()
  ])
  
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
                  <BreadcrumbLink href="/brands" className="text-gray-300 hover:text-white transition-colors">
                    Brands
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">{brand.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-5xl font-bold">{brand.name}</h1>
            {brand.description && (
              <p className="text-gray-300 mt-3 text-lg">{brand.description}</p>
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
                  hideBrandFilter={true} // Hide brand filter since we're already on a brand page
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