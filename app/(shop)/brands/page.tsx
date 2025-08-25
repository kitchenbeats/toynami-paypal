import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'
import { IMAGE_CONFIG } from '@/lib/config/images'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Directory - Premium Collectible Brands',
  description: 'Explore our collection of premium collectible brands including exclusive licenses. Shop authentic figures, toys, and merchandise from top manufacturers.',
  keywords: ['collectible brands', 'toy brands', 'figure manufacturers', 'premium collectibles', 'licensed merchandise', 'authentic toys'],
  openGraph: {
    title: 'Brand Directory - Premium Collectible Brands | Toynami Store',
    description: 'Explore our collection of premium collectible brands including exclusive licenses.',
    type: 'website',
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Premium Collectible Brands - Toynami Store'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Directory - Premium Collectible Brands | Toynami Store',
    description: 'Explore our collection of premium collectible brands including exclusive licenses.',
    images: ['/twitter-image.png']
  }
}

async function getBrands() {
  const supabase = await createClient()
  
  const { data: brands } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      logo_url,
      banner_url_2,
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
                  className="group relative block overflow-hidden transition-all duration-300"
                >
                  {/* Banner Container with exact 650x145 aspect ratio */}
                  <div className="relative w-full" style={{ aspectRatio: '650/145' }}>
                    {(brand.banner_url_2 || brand.logo_url) ? (
                      <Image
                        src={
                          brand.banner_url_2 
                            ? (brand.banner_url_2.startsWith('http') 
                                ? getImageSrc(brand.banner_url_2)
                                : `${IMAGE_CONFIG.baseUrl}/${brand.banner_url_2}`)
                            : (brand.logo_url.startsWith('http') 
                                ? getImageSrc(brand.logo_url)
                                : `${IMAGE_CONFIG.baseUrl}/${brand.logo_url}`)
                        }
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 650px"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--toynami-primary-blue)' }}>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-white">
                            {brand.name}
                          </h3>
                          <p className="text-sm text-white/80 mt-1">
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