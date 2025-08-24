import { HeroCarousel } from '@/components/toynami/hero-carousel-server'
import { FeaturedBanners } from '@/components/toynami/featured-banners'
import { FeaturedProductsSection } from '@/components/toynami/featured-products-server'
import { FeaturedBrandsGrid } from '@/components/toynami/featured-brands-grid'
import { AnnouncementsSection } from '@/components/toynami/announcements-section'
import { YouTubeSection } from '@/components/toynami/youtube-section'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()

  // Get SEO settings from database
  const { data: settings } = await supabase
    .from('settings')
    .select('seo_title_suffix, seo_default_description, seo_keywords')
    .single()

  // Get featured products for dynamic description
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('name, brand:brands(name)')
    .eq('is_featured', true)
    .eq('is_visible', true)
    .eq('status', 'active')
    .is('deleted_at', null)
    .limit(5)

  // Get featured brands for keywords
  const { data: featuredBrands } = await supabase
    .from('brands')
    .select('name')
    .eq('is_featured', true)
    .eq('is_active', true)
    .is('deleted_at', null)
    .limit(10)

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  // Build dynamic keywords from brands and settings
  const brandNames = featuredBrands?.map(b => b.name.toLowerCase()) || []
  const baseKeywords = ["collectibles", "toys", "figures", "pop culture", "merchandise"]
  const dynamicKeywords = [...baseKeywords, ...brandNames]
  
  if (settings?.seo_keywords) {
    dynamicKeywords.push(...settings.seo_keywords.split(',').map((k: string) => k.trim()))
  }

  // Build dynamic description
  const productNames = featuredProducts?.slice(0, 3).map(p => p.name) || []
  let description = "Shop premium collectibles, toys, and exclusive merchandise at Toynami Store."
  
  if (productNames.length > 0) {
    description += ` Featuring ${productNames.join(', ')} and more authentic figures, limited editions, and pop culture items.`
  }

  return {
    title: 'Home',
    description,
    keywords: dynamicKeywords,
    openGraph: {
      title: 'Toynami Store - Premium Collectibles & Toys',
      description,
      type: 'website',
      url: defaultUrl,
      siteName: 'Toynami Store',
      images: [{
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Toynami Store - Premium Collectibles & Toys'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Toynami Store - Premium Collectibles & Toys',
      description,
      images: ['/twitter-image.png']
    },
    alternates: {
      canonical: defaultUrl
    },
    other: {
      'product:count': featuredProducts?.length.toString() || '0',
      'brand:count': featuredBrands?.length.toString() || '0'
    }
  }
}

export default function Home() {
  return (
    <>
      
      {/* Hero Section */}
      <HeroCarousel />
      
      {/* Main Content */}
      <div className="main full">
        
        {/* FEATURED PRODUCTS SECTION */}
        <div className="section-spacing">
          <FeaturedProductsSection limit={5} />
        </div>
        
        {/* FEATURED BRANDS SECTION */}
        <div className="section-spacing">
          <FeaturedBrandsGrid />
        </div>
        
        {/* ANNOUNCEMENTS SECTION */}
        <div className="section-spacing figma-announcements-parent" style={{ marginBottom: '5rem' }}>
          <AnnouncementsSection />
        </div>
        
        {/* YOUTUBE SECTION */}
        <div className="mb-12">
          <YouTubeSection />
        </div>
        
        {/* BEGIN MID FEATURED BANNERS */}
        <FeaturedBanners position="middle" />
        {/* END MID FEATURED BANNERS */}
        
        {/* BEGIN LOWER FEATURED BANNERS */}
        <FeaturedBanners position="lower" />
        {/* END LOWER FEATURED BANNERS */}
      </div>
    </>
  )
}