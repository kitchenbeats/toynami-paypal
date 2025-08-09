import Link from 'next/link'
import { Card } from '@/components/ui/card'

const brands = [
  { id: 1, name: 'Robotech', slug: 'robotech', logo: '/images/robotech-logo.png' },
  { id: 2, name: 'Voltron', slug: 'voltron', logo: '/images/voltron-logo.png' },
  { id: 3, name: 'Naruto Shippuden', slug: 'naruto', logo: '/images/naruto-logo.png' },
  { id: 4, name: 'Macross', slug: 'macross', logo: '/images/macross-logo.png' },
  { id: 5, name: 'Acid Rain World', slug: 'acid-rain', logo: '/images/acid-rain-logo.png' },
  { id: 6, name: 'Emily the Strange', slug: 'emily', logo: '/images/emily-logo.png' },
]

export function BrandLogos() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl font-bold text-primary">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-medium">{brand.name}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}