import Link from 'next/link'
import { getBannersByPosition, getBannerConfig, type Banner } from '@/lib/data/banners'

interface FeaturedBannersProps {
  position: 'upper' | 'middle' | 'lower'
}


export async function FeaturedBanners({ position }: FeaturedBannersProps) {
  // Fetch active banners from database
  const banners = await getBannersByPosition(position)
  const config = await getBannerConfig()
  
  // No banners? Don't render anything
  if (!banners || banners.length === 0) {
    return null
  }
  
  // Determine column count based on position
  const columnCount = config[`${position}_columns` as keyof typeof config] || 2
  const columnClass = columnCount === 1 ? 'one-column' : columnCount === 3 ? 'three-columns' : 'two-columns'
  
  const getAlignmentClass = (alignment?: string) => {
    if (alignment === 'center') return 'center-aligned'
    if (alignment === 'right') return 'right-aligned'
    return ''
  }

  const renderBanner = (banner: Banner, index: number) => {
    const categoryClass = `banner-${index + 1}`
    const isExternal = banner.button_url?.startsWith('http')
    
    return (
      <li key={banner.id} className={`category ${categoryClass}`}>
        <div className="category-link-container">
          <div className="zoom-image-container">
            {banner.button_url ? (
              <Link
                href={banner.button_url}
                className="category-image-link"
                target={isExternal ? '_blank' : '_self'}
              >
                {banner.image_url && (
                  <img
                    className="category-image"
                    src={banner.image_url}
                    alt={banner.image_alt || banner.title || ''}
                    title={banner.name}
                  />
                )}
                <div className={`text-wrapper ${getAlignmentClass(banner.text_alignment)}`}>
                  {banner.title && (
                    <h1 className={`featured-banner-title ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.title}
                    </h1>
                  )}
                  {banner.description && (
                    <p className={`featured-banner-text ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.description}
                    </p>
                  )}
                  {banner.subtitle && (
                    <p className={`featured-banner-byline-text ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="category-static">
                {banner.image_url && (
                  <img
                    className="category-image"
                    src={banner.image_url}
                    alt={banner.image_alt || banner.title || ''}
                    title={banner.name}
                  />
                )}
                <div className={`text-wrapper ${getAlignmentClass(banner.text_alignment)}`}>
                  {banner.title && (
                    <h1 className={`featured-banner-title ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.title}
                    </h1>
                  )}
                  {banner.description && (
                    <p className={`featured-banner-text ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.description}
                    </p>
                  )}
                  {banner.subtitle && (
                    <p className={`featured-banner-byline-text ${getAlignmentClass(banner.text_alignment)}`}>
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className={`featured-categories-banner ${columnClass} ${position}-banners section-spacing`}>
      <ul className="featured-categories">
        {banners.map((banner, index) => renderBanner(banner, index))}
        <div className="clear"></div>
      </ul>
    </div>
  )
}