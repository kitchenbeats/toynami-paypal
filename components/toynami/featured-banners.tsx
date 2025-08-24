import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { getBannersByPosition, getBannerConfig, type Banner } from '@/lib/data/banners'

interface FeaturedBannersProps {
  position: 'upper' | 'middle' | 'lower'
}

export async function FeaturedBanners({ position }: FeaturedBannersProps) {
  // Get current path for page targeting
  const headersList = await headers()
  const currentPath = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'
  
  // Fetch active banners from database with page targeting
  const banners = await getBannersByPosition(position, currentPath)
  const config = await getBannerConfig()
  
  // No banners? Don't render anything
  if (!banners || banners.length === 0) {
    return null
  }
  
  // Get banner image URL
  const getBannerImageUrl = (banner: Banner) => {
    if (!banner.image_url) return null
    
    // If it's already a full URL, return as is
    if (banner.image_url.startsWith('http')) {
      return banner.image_url
    }
    
    // Otherwise it's a path in our bucket
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/products/${banner.image_url}`
  }

  // Determine column count based on position
  const columnCount = config[`${position}_columns` as keyof typeof config] || 2
  
  // Get grid classes based on column count
  const getGridCols = (count: number) => {
    switch(count) {
      case 1: return 'grid-cols-1'
      case 3: return 'grid-cols-1 md:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2'
    }
  }

  // Get banner styling based on position
  const getPositionClasses = (pos: string) => {
    switch(pos) {
      case 'upper':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3'
      case 'middle':
        return 'py-8 bg-gray-50'
      case 'lower':
        return 'py-8 bg-white'
      default:
        return 'py-8'
    }
  }

  // Render banner based on position
  if (position === 'upper') {
    // Upper banners are notification-style banners
    return (
      <div className={getPositionClasses(position)}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="text-center">
                {banner.button_url ? (
                  <Link 
                    href={banner.button_url}
                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                    target={banner.button_url.startsWith('http') ? '_blank' : '_self'}
                  >
                    {banner.title && (
                      <span className="font-semibold">{banner.title}</span>
                    )}
                    {banner.description && (
                      <span className="text-sm opacity-90">{banner.description}</span>
                    )}
                    {banner.button_text && (
                      <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {banner.button_text}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    {banner.title && (
                      <span className="font-semibold">{banner.title}</span>
                    )}
                    {banner.description && (
                      <span className="text-sm opacity-90">{banner.description}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Middle and Lower banners are card-style promotional banners
  return (
    <section className={getPositionClasses(position)}>
      <div className="container mx-auto px-4">
        <div className={`grid gap-6 ${getGridCols(columnCount)}`}>
          {banners.map((banner) => {
            const imageUrl = getBannerImageUrl(banner)
            
            return (
              <div key={banner.id} className="group relative overflow-hidden rounded-lg shadow-lg bg-white">
                {banner.button_url ? (
                  <Link 
                    href={banner.button_url}
                    className="block"
                    target={banner.button_url.startsWith('http') ? '_blank' : '_self'}
                  >
                    <BannerCard banner={banner} imageUrl={imageUrl} />
                  </Link>
                ) : (
                  <BannerCard banner={banner} imageUrl={imageUrl} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface BannerCardProps {
  banner: Banner
  imageUrl: string | null
}

function BannerCard({ banner, imageUrl }: BannerCardProps) {
  const textAlignment = banner.text_alignment || 'center'
  
  const getTextAlignClass = (alignment: string) => {
    switch(alignment) {
      case 'left': return 'text-left'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }

  return (
    <div className="relative h-64 md:h-80">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={banner.image_alt || banner.title || banner.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-60"
            style={{ 
              opacity: banner.overlay_opacity || 0.3,
              backgroundColor: banner.background_color ? `${banner.background_color}80` : undefined
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className={`relative h-full flex flex-col justify-center p-6 ${getTextAlignClass(textAlignment)}`}>
        {banner.title && (
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2 transition-transform duration-300 group-hover:scale-105"
            style={{ color: banner.text_color || (imageUrl ? 'white' : '#1f2937') }}
          >
            {banner.title}
          </h2>
        )}
        
        {banner.subtitle && (
          <p 
            className="text-lg md:text-xl mb-3 opacity-90"
            style={{ color: banner.text_color || (imageUrl ? 'white' : '#6b7280') }}
          >
            {banner.subtitle}
          </p>
        )}
        
        {banner.description && (
          <p 
            className="text-sm md:text-base mb-4 opacity-80"
            style={{ color: banner.text_color || (imageUrl ? 'white' : '#6b7280') }}
          >
            {banner.description}
          </p>
        )}
        
        {banner.button_text && banner.button_url && (
          <div className={textAlignment === 'center' ? 'flex justify-center' : textAlignment === 'right' ? 'flex justify-end' : 'flex justify-start'}>
            <span 
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
              style={{ 
                backgroundColor: banner.button_color || '#3b82f6',
                color: banner.button_text_color || 'white'
              }}
            >
              {banner.button_text}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}