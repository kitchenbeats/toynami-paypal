import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'VF-1S Valkyrie Roy Focker Special Edition',
    brand: 'Robotech',
    price: 249.99,
    comparePrice: 299.99,
    image: '/images/product-placeholder.jpg',
    slug: 'vf-1s-valkyrie',
    inStock: true,
    rating: 4.5,
    reviews: 23,
    isNew: true,
  },
  {
    id: 2,
    name: 'Voltron Legendary Defender Complete Set',
    brand: 'Voltron',
    price: 189.99,
    image: '/images/product-placeholder.jpg',
    slug: 'voltron-defender',
    inStock: true,
    rating: 5,
    reviews: 45,
    isSale: true,
  },
  {
    id: 3,
    name: 'Naruto Uzumaki Sage Mode Figure',
    brand: 'Naruto',
    price: 79.99,
    image: '/images/product-placeholder.jpg',
    slug: 'naruto-figure',
    inStock: true,
    rating: 4.8,
    reviews: 67,
  },
  {
    id: 4,
    name: 'Macross Delta VF-31 Siegfried',
    brand: 'Macross',
    price: 299.99,
    image: '/images/product-placeholder.jpg',
    slug: 'macross-vf31',
    inStock: false,
    rating: 4.9,
    reviews: 12,
  },
  {
    id: 5,
    name: 'Acid Rain World Speeder MK II',
    brand: 'Acid Rain',
    price: 149.99,
    comparePrice: 179.99,
    image: '/images/product-placeholder.jpg',
    slug: 'acid-rain-speeder',
    inStock: true,
    rating: 4.7,
    reviews: 8,
    isSale: true,
  },
  {
    id: 6,
    name: 'Emily the Strange Collectible Doll',
    brand: 'Emily',
    price: 59.99,
    image: '/images/product-placeholder.jpg',
    slug: 'emily-doll',
    inStock: true,
    rating: 4.6,
    reviews: 34,
    isNew: true,
  },
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square relative overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground/50">Product Image</p>
                </div>
              </div>
              
              <div className="absolute top-2 left-2 flex gap-2">
                {product.isNew && <Badge className="bg-green-500">New</Badge>}
                {product.isSale && <Badge variant="destructive">Sale</Badge>}
                {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
              </div>

              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </Link>
          
          <CardContent className="p-4">
            <Link href={`/products/${product.slug}`}>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors min-h-[3rem]">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold">${product.price}</p>
                {product.comparePrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${product.comparePrice}
                  </p>
                )}
              </div>
            </Link>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full"
              disabled={!product.inStock}
              variant={product.inStock ? 'default' : 'secondary'}
              onClick={(e) => {
                e.preventDefault()
                if (product.inStock) {
                  console.log('Add to cart:', product.id)
                }
              }}
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