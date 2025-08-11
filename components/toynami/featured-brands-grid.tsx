import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedBrands, type Brand } from '@/lib/data/brands'
import { getImageSrc } from '@/lib/utils/image-utils'
import { IMAGE_CONFIG } from '@/lib/config/images'

export async function FeaturedBrandsGrid() {
  // Fetch 6 featured brands from database
  const brands = await getFeaturedBrands(6)
  
  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <div className="featured-brands-section">
      <div className="container mx-auto px-4">
        <h2 className="homepage-section-heading text-center mb-8">
          FEATURED BRANDS
        </h2>
        
        {/* Brands Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group block"
            >
              <div className="relative">
                {/* Brand Banner */}
                <div className="relative w-full aspect-[650/300] bg-gray-100 overflow-hidden">
                  {brand.banner_url ? (
                    <Image
                      src={
                        brand.banner_url.startsWith('http') 
                          ? getImageSrc(brand.banner_url)
                          : `${IMAGE_CONFIG.baseUrl}/${brand.banner_url}`
                      }
                      alt={brand.name}
                      width={650}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // Fallback if no banner
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-4xl font-bold text-gray-400">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Brand Name */}
                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}