import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

async function getBrands() {
  const supabase = await createClient()
  
  const { data: brands } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      logo_url,
      description,
      is_active
    `)
    .eq('is_active', true)
    .order('name')
  
  return brands || []
}

async function getBrandProductCounts() {
  const supabase = await createClient()
  
  // Get product counts for each brand
  const { data: counts } = await supabase
    .from('products')
    .select('brand_id')
    .eq('is_visible', true)
    .eq('status', 'active')
    .not('brand_id', 'is', null)
  
  // Count products per brand
  const brandCounts: Record<string, number> = {}
  counts?.forEach(item => {
    if (item.brand_id) {
      brandCounts[item.brand_id] = (brandCounts[item.brand_id] || 0) + 1
    }
  })
  
  return brandCounts
}

export default async function BrandsPage() {
  const [brands, productCounts] = await Promise.all([
    getBrands(),
    getBrandProductCounts()
  ])
  
  return (
    <>
        {/* Hero Section */}
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
                  <BreadcrumbPage className="text-white font-medium">Brands</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-5xl font-bold">Our Brands</h1>
            <p className="text-gray-300 mt-3 text-lg">
              Explore our collection of premium brands and exclusive licenses
            </p>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="container mx-auto px-4 py-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {brands.map((brand) => {
              const productCount = productCounts[brand.id] || 0
              
              return (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Banner Container with exact 650x145 aspect ratio */}
                  <div className="relative w-full" style={{ aspectRatio: '650/145' }}>
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 650px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                            {brand.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {productCount} {productCount === 1 ? 'Product' : 'Products'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <span className="text-lg font-semibold">View Products</span>
                        <p className="text-sm mt-1">
                          {productCount} {productCount === 1 ? 'item' : 'items'} available
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          
          {brands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No brands available at this time.</p>
            </div>
          )}
        </div>
    </>
  )
}