'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'

const relatedProducts = [
  {
    id: 1,
    name: 'VF-1J Valkyrie',
    brand: 'Robotech',
    price: '$199.99',
    slug: 'vf-1j-valkyrie',
    inStock: true,
  },
  {
    id: 2,
    name: 'SDF-1 Macross Ship',
    brand: 'Robotech',
    price: '$349.99',
    slug: 'sdf1-macross',
    inStock: true,
  },
  {
    id: 3,
    name: 'Rick Hunter Pilot Figure',
    brand: 'Robotech',
    price: '$49.99',
    slug: 'rick-hunter',
    inStock: true,
  },
  {
    id: 4,
    name: 'Zentraedi Battle Pod',
    brand: 'Robotech',
    price: '$149.99',
    slug: 'zentraedi-pod',
    inStock: false,
  },
]

export function RelatedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
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
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-lg font-bold mt-2">{product.price}</p>
            </Link>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full"
              size="sm"
              disabled={!product.inStock}
              variant={product.inStock ? 'default' : 'secondary'}
            >
              {product.inStock ? 'Quick Add' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}