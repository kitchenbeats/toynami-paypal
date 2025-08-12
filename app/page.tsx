import { HeroCarousel } from '@/components/toynami/hero-carousel-server'
import { FeaturedBanners } from '@/components/toynami/featured-banners'
import { FeaturedProductsSection } from '@/components/toynami/featured-products-server'
import { FeaturedBrandsGrid } from '@/components/toynami/featured-brands-grid'
import { AnnouncementsSection } from '@/components/toynami/announcements-section'
import { YouTubeSection } from '@/components/toynami/youtube-section'

export default function Home() {
  return (
    <>
      
      {/* Hero Section */}
      <HeroCarousel />
      
      {/* Main Content */}
      <div className="main full">
        {/* BEGIN UPPER FEATURED BANNERS */}
        <FeaturedBanners position="upper" />
        {/* END UPPER FEATURED BANNERS */}
        
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