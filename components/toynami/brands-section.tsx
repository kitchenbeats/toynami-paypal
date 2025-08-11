import Link from 'next/link'
import { getFeaturedBrands, type Brand } from '@/lib/data/brands'

// Fallback data for when database is empty
const fallbackBrands: Brand[] = [
  {
    id: '1',
    slug: 'robotech',
    name: 'Robotech',
    logo_url: '/images/robotech-logo.png',
    is_featured: true,
    sort_order: 1,
    search_keywords: 'robotech macross veritech valkyrie'
  },
  {
    id: '2',
    slug: 'voltron',
    name: 'Voltron',
    logo_url: '/images/voltron-logo.png',
    is_featured: true,
    sort_order: 2,
    search_keywords: 'voltron defender lions'
  },
  {
    id: '3',
    slug: 'naruto',
    name: 'Naruto Shippuden',
    logo_url: '/images/naruto-shippuden-logo.png',
    is_featured: true,
    sort_order: 3,
    search_keywords: 'naruto shippuden ninja anime'
  },
  {
    id: '4',
    slug: 'macross',
    name: 'Macross',
    logo_url: '/images/macross-logo.png',
    is_featured: true,
    sort_order: 4,
    search_keywords: 'macross delta frontier'
  },
  {
    id: '5',
    slug: 'acid-rain',
    name: 'Acid Rain World',
    logo_url: '/images/acid-rain-logo.png',
    is_featured: true,
    sort_order: 5,
    search_keywords: 'acid rain military mecha'
  },
  {
    id: '6',
    slug: 'emily',
    name: 'Emily the Strange',
    logo_url: '/images/emily-the-strange-logo.png',
    is_featured: true,
    sort_order: 6,
    search_keywords: 'emily strange goth alternative'
  }
]

export async function BrandsSection() {
  // Fetch brands from database (server-side)
  let brands = await getFeaturedBrands(6)
  
  // Use fallback if no brands in database
  if (!brands || brands.length === 0) {
    brands = fallbackBrands
  }
  return (
    <div className="figma-brands-section">
      <div className="figma-brands-parent container">
        <h2 className="figma-brands homepage-section-heading">
          BRANDS
        </h2>
        
        {/* Brands Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-square relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-center font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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