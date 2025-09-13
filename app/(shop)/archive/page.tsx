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
  title: 'Archive - Past Collections & Limited Editions',
  description: 'Explore our archive of past collections, limited editions, and sold-out items. Browse the history of premium collectibles from Toynami.',
  keywords: ['collectible archive', 'past collections', 'limited editions', 'sold out items', 'collectible history', 'vintage toys'],
  openGraph: {
    title: 'Archive - Past Collections & Limited Editions | Toynami Store',
    description: 'Explore our archive of past collections, limited editions, and sold-out items.',
    type: 'website',
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Collectibles Archive - Toynami Store'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive - Past Collections & Limited Editions | Toynami Store',
    description: 'Explore our archive of past collections, limited editions, and sold-out items.',
    images: ['/twitter-image.png']
  }
}

async function getArchivedBrands() {
  const supabase = await createClient()
  
  // Get all brands that have archived products
  const { data: brandsWithArchived } = await supabase
    .from('products')
    .select('brand_id')
    .eq('status', 'archived')
    .not('brand_id', 'is', null)
  
  if (!brandsWithArchived || brandsWithArchived.length === 0) {
    return []
  }
  
  // Get unique brand IDs
  const uniqueBrandIds = [...new Set(brandsWithArchived.map(p => p.brand_id))]
  
  // Get brand details
  const { data: brands } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      slug,
      logo_url,
      banner_url_2,
      description
    `)
    .in('id', uniqueBrandIds)
    .order('name')
  
  return brands || []
}

async function getArchivedProductCounts() {
  const supabase = await createClient()
  
  // Get archived product counts for each brand
  const { data: counts } = await supabase
    .from('products')
    .select('brand_id')
    .eq('status', 'archived')
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

export default async function ArchivePage() {
  const [brands, productCounts] = await Promise.all([
    getArchivedBrands(),
    getArchivedProductCounts()
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
                <BreadcrumbPage className="text-white font-medium">Archive</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-5xl font-bold">Product Archive</h1>
          <p className="text-gray-300 mt-3 text-lg">
            Explore our past collections and limited edition releases
          </p>
        </div>
      </div>

      {/* Archive Info Banner */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-900">Archive Collection</h3>
              <p className="text-amber-800 mt-1">
                These items are no longer available for purchase. Browse our catalog to see the amazing collectibles we've produced over the years.
              </p>
            </div>
          </div>
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
                href={`/archive/${brand.slug}`}
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
                          {productCount} Archived {productCount === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Archive Badge */}
                  <div className="absolute top-4 right-4 bg-gray-900/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Archive
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <span className="text-lg font-semibold">View Archive</span>
                      <p className="text-sm mt-1">
                        {productCount} archived {productCount === 1 ? 'item' : 'items'}
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
            <p className="text-gray-500">No archived products at this time.</p>
            <p className="text-gray-400 text-sm mt-2">Products must have status='archived' and a brand assigned to appear here.</p>
          </div>
        )}
      </div>
    </>
  )
}