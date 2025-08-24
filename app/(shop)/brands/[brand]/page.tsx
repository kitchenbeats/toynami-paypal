import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FeaturedProductsSection } from '@/components/toynami/featured-products-server'
import { AnnouncementsSection } from '@/components/toynami/announcements-section'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'
import { IMAGE_CONFIG } from '@/lib/config/images'
import { unstable_cache } from 'next/cache'
import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'

interface PageProps {
  params: Promise<{
    brand: string
  }>
  searchParams: Promise<{ page?: string }>
}

const getBrandInfo = unstable_cache(
  async (slug: string) => {
    const supabase = await createClient()
    
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    return brand
  },
  ['brand-info'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: (slug: string) => [`brand-slug-${slug}`]
  }
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params
  const supabase = await createClient()

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  // Get comprehensive brand data for SEO
  const { data: brand } = await supabase
    .from('brands')
    .select(`
      id,
      name,
      description,
      search_keywords,
      logo_url,
      banner_url,
      banner_url_2
    `)
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .single()

  if (!brand) {
    return {
      title: 'Brand Not Found',
      robots: { index: false, follow: false }
    }
  }

  // Get product count and sample products for this brand
  const [{ count }, { data: sampleProducts }] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      .eq('status', 'active')
      .eq('is_visible', true),
    supabase
      .from('products')
      .select('name, base_price_cents')
      .eq('brand_id', brand.id)
      .eq('status', 'active')
      .eq('is_visible', true)
      .limit(3)
  ])

  // Build SEO content
  const title = `${brand.name} Collectibles & Toys - Premium Merchandise`
  const description = brand.description ||
    `Shop ${brand.name} collectibles and toys at Toynami Store. ${count ? `Browse ${count} premium ${brand.name} products` : `Discover ${brand.name} merchandise`} including figures, toys, and exclusive items.`

  // Build keywords
  const keywords: string[] = [
    brand.name.toLowerCase(),
    `${brand.name.toLowerCase()} collectibles`,
    `${brand.name.toLowerCase()} toys`,
    `${brand.name.toLowerCase()} figures`,
    `${brand.name.toLowerCase()} merchandise`,
    'collectibles', 'toys', 'figures', 'premium', 'authentic'
  ]

  if (brand.search_keywords) {
    keywords.push(...brand.search_keywords.split(',').map((k: string) => k.trim()))
  }

  // Add product names as keywords
  if (sampleProducts) {
    sampleProducts.forEach(product => {
      keywords.push(product.name.toLowerCase())
    })
  }

  const brandUrl = `${defaultUrl}/brands/${brandSlug}`
  const imageUrl = brand.banner_url_2 || brand.banner_url || brand.logo_url || '/opengraph-image.png'
  const fullImageUrl = imageUrl.startsWith('http') 
    ? getImageSrc(imageUrl)
    : imageUrl.startsWith('/') 
      ? `${defaultUrl}${imageUrl}`
      : `${IMAGE_CONFIG.baseUrl}/${imageUrl}`

  return {
    title,
    description,
    keywords: [...new Set(keywords)], // Remove duplicates
    openGraph: {
      title: `${brand.name} Collectibles & Toys | Toynami Store`,
      description,
      type: 'website',
      url: brandUrl,
      siteName: 'Toynami Store',
      images: [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: `${brand.name} - Toynami Store`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} Collectibles & Toys | Toynami Store`,
      description,
      images: [fullImageUrl]
    },
    alternates: {
      canonical: brandUrl
    },
    other: {
      'brand:name': brand.name,
      'product:count': count?.toString() || '0',
      'brand:category': 'collectibles'
    }
  }
}

export default async function BrandProductsPage({ params, searchParams }: PageProps) {
  const { brand: brandSlug } = await params
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page, 10) || 1
  
  const brand = await getBrandInfo(brandSlug)
  
  if (!brand) {
    notFound()
  }
  
  // Add dynamic cache tag for this specific brand
  // This allows us to invalidate just this brand's page when its images change
  
  return (
    <>
      {/* Brand Header Banner - 9:2 aspect ratio */}
      <div className="brand-series-header" style={{ width: '100%', aspectRatio: '9/2', backgroundColor: 'var(--toynami-dark, #231f20)', position: 'relative', overflow: 'hidden' }}>
        {brand.banner_url_2 && (
          <Image
            src={
              brand.banner_url_2.startsWith('http') 
                ? getImageSrc(brand.banner_url_2)
                : `${IMAGE_CONFIG.baseUrl}/${brand.banner_url_2}`
            }
            alt={brand.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        )}
        {!brand.banner_url_2 && (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-white">{brand.name}</h1>
          </div>
        )}
      </div>

      {/* Brand Products Section */}
      <div className="brand-products-section" style={{ 
        background: 'linear-gradient(180deg, #fff 0%, #ffa314 100%)',
        padding: '40px 20px'
      }}>
        <div className="container mx-auto px-4" style={{ maxWidth: '1374px' }}>
          <h1 className="text-center pt-12 mb-8 figma-brands homepage-section-heading">
            <span>{brand.name}</span>{' '}
            <span style={{ color: 'var(--toynami-primary-blue)' }}>Products</span>
          </h1>
          <FeaturedProductsSection 
            brandId={brand.id} 
            showWrapper={false}
            showTitle={false}
            showSearchBar={false}
            limit={13}
            page={currentPage}
            showPagination={true}
          />
          <div className="pb-12"></div>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <AnnouncementsSection limit={2} />
        </div>
      </div>
    </>
  )
}