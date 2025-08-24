import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { getBannersByPosition } from '@/lib/data/banners'

export async function TopBanner() {
  // Get current path for page targeting
  const headersList = await headers()
  const currentPath = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'
  
  // Fetch active banners for "upper" position (top of site)
  const banners = await getBannersByPosition('upper', currentPath)
  
  // No banners? Don't render anything
  if (!banners || banners.length === 0) {
    return null
  }

  // Get banner image URL
  const getBannerImageUrl = (banner: any) => {
    if (!banner.image_url) return null
    
    // If it's already a full URL, return as is
    if (banner.image_url.startsWith('http')) {
      return banner.image_url
    }
    
    // Otherwise it's a path in our bucket
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/products/${banner.image_url}`
  }
  
  return (
    <>
      {banners.map((banner) => {
        const imageUrl = getBannerImageUrl(banner)
        const textAlignment = banner.text_alignment || 'center'
        
        // If banner has image - show as FULL banner
        if (imageUrl) {
          return (
            <div key={banner.id} className="relative w-full h-24 md:h-32 overflow-hidden">
              {banner.button_url ? (
                <Link 
                  href={banner.button_url}
                  className="block w-full h-full group"
                  target={banner.button_url.startsWith('http') ? '_blank' : '_self'}
                >
                  <BannerWithImage 
                    banner={banner} 
                    imageUrl={imageUrl} 
                    textAlignment={textAlignment}
                  />
                </Link>
              ) : (
                <BannerWithImage 
                  banner={banner} 
                  imageUrl={imageUrl} 
                  textAlignment={textAlignment}
                />
              )}
            </div>
          )
        }
        
        // No image - show as thin notification bar
        return (
          <div key={banner.id} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 text-center relative">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {banner.button_url ? (
                  <Link 
                    href={banner.button_url}
                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                    target={banner.button_url.startsWith('http') ? '_blank' : '_self'}
                  >
                    {banner.title && (
                      <span className="font-semibold text-sm">{banner.title}</span>
                    )}
                    {banner.description && (
                      <span className="text-xs opacity-90">{banner.description}</span>
                    )}
                    {banner.button_text && (
                      <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-medium ml-2">
                        {banner.button_text}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    {banner.title && (
                      <span className="font-semibold text-sm">{banner.title}</span>
                    )}
                    {banner.description && (
                      <span className="text-xs opacity-90">{banner.description}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

interface BannerWithImageProps {
  banner: any
  imageUrl: string
  textAlignment: string
}

function BannerWithImage({ banner, imageUrl, textAlignment }: BannerWithImageProps) {
  const getTextAlignClass = (alignment: string) => {
    switch(alignment) {
      case 'left': return 'text-left justify-start'
      case 'right': return 'text-right justify-end'
      default: return 'text-center justify-center'
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={banner.image_alt || banner.title || banner.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="100vw"
        priority
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black group-hover:opacity-60 transition-opacity duration-300"
        style={{ 
          opacity: banner.overlay_opacity || 0.3,
          backgroundColor: banner.background_color ? `${banner.background_color}80` : undefined
        }}
      />
      
      {/* Content */}
      <div className={`relative h-full flex flex-col items-center ${getTextAlignClass(textAlignment)} px-4`}>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          {banner.title && (
            <h2 
              className="text-lg md:text-xl font-bold group-hover:scale-105 transition-transform duration-300"
              style={{ color: banner.text_color || 'white' }}
            >
              {banner.title}
            </h2>
          )}
          
          {banner.description && (
            <p 
              className="text-sm md:text-base opacity-90"
              style={{ color: banner.text_color || 'white' }}
            >
              {banner.description}
            </p>
          )}
          
          {banner.button_text && banner.button_url && (
            <span 
              className="inline-block px-4 py-2 rounded-lg font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg text-xs md:text-sm"
              style={{ 
                backgroundColor: banner.button_color || '#3b82f6',
                color: banner.button_text_color || 'white'
              }}
            >
              {banner.button_text}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}