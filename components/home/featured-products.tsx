import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'

const featuredProducts = [
  {
    id: 1,
    name: 'VF-1S Valkyrie Roy Focker',
    brand: 'Robotech',
    price: '$249.99',
    image: '/images/product-placeholder.jpg',
    slug: 'vf-1s-valkyrie',
    inStock: true,
  },
  {
    id: 2,
    name: 'Voltron Legendary Defender',
    brand: 'Voltron',
    price: '$189.99',
    image: '/images/product-placeholder.jpg',
    slug: 'voltron-defender',
    inStock: true,
  },
  {
    id: 3,
    name: 'Naruto Uzumaki Figure',
    brand: 'Naruto',
    price: '$79.99',
    image: '/images/product-placeholder.jpg',
    slug: 'naruto-figure',
    inStock: true,
  },
  {
    id: 4,
    name: 'Macross Delta VF-31',
    brand: 'Macross',
    price: '$299.99',
    image: '/images/product-placeholder.jpg',
    slug: 'macross-vf31',
    inStock: false,
  },
]

export function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-shadow">
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square relative overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground/50">Product Image</p>
                </div>
              </div>
              {!product.inStock && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded">
                  Out of Stock
                </div>
              )}
              <button
                className="absolute top-2 left-2 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Add to wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </Link>
          <CardContent className="p-4">
            <Link href={`/products/${product.slug}`}>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-lg font-bold mt-2">{product.price}</p>
            </Link>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full"
              disabled={!product.inStock}
              variant={product.inStock ? 'default' : 'secondary'}
            >
              {product.inStock ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}