'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus } from 'lucide-react'
import { getImageSrc } from '@/lib/utils/image-utils'
import { useCart } from '@/lib/hooks/use-cart'
import { useState } from 'react'
import { toast } from 'sonner'
import { WishlistButton } from '@/components/toynami/wishlist-button'

interface Product {
  id: string
  name: string
  slug: string
  base_price_cents?: number
  stock_level?: number
  track_inventory?: string
  preorder_release_date?: string
  preorder_message?: string
  brand?: {
    name: string
    slug: string
  }
  categories?: Array<{
    category?: {
      slug: string
      name: string
    }
  }>
  variants?: Array<{
    id: string
    price_cents: number
    stock: number
    is_active: boolean
  }>
  images?: Array<{
    image_filename: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())

  const getPrice = (product: Product) => {
    // Check variants first
    if (product.variants && product.variants.length > 0) {
      const variantPrices = product.variants
        .filter((v) => v.price_cents > 0)
        .map((v) => v.price_cents)
      if (variantPrices.length > 0) {
        return Math.min(...variantPrices)
      }
    }
    return product.base_price_cents || 0
  }

  const getStock = (product: Product) => {
    if (product.track_inventory === 'by product' && product.stock_level !== undefined) {
      return product.stock_level
    }
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0)
    }
    if (product.track_inventory === 'none') {
      return 999
    }
    return 0
  }

  const isPreOrder = (product: Product) => {
    return !!(product.preorder_release_date || 
             (product.name && product.name.toLowerCase().includes('preorder')) ||
             product.categories?.some(pc => pc.category?.slug === 'pre-orders'))
  }

  const getProductUrl = (product: Product) => {
    if (product.categories && product.categories.length > 0) {
      const specialCategories = ['pre-orders', 'convention-exclusives', 'new-products', 'on-sale']
      
      for (const special of specialCategories) {
        if (product.categories.some(pc => pc.category?.slug === special)) {
          return `/${special}/${product.slug}`
        }
      }
      
      const firstCategory = product.categories[0]
      if (firstCategory?.category?.slug) {
        return `/${firstCategory.category.slug}/${product.slug}`
      }
    }
    
    if (product.brand?.slug) {
      return `/brands/${product.brand.slug}/${product.slug}`
    }
    
    return `/products/${product.slug}`
  }

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(prev => new Set(prev).add(product.id))
    
    try {
      const price = getPrice(product)
      const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
      
      await addItem({
        productId: product.id,
        variantId: product.variants?.[0]?.id,
        productName: product.name,
        price: price,
        quantity: 1,
        image: primaryImage?.image_filename,
        min_purchase_quantity: 1,
        max_purchase_quantity: null
      })
      
      toast.success('Added to cart', {
        description: `${product.name} added to your cart`
      })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      toast.error('Failed to add item to cart')
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = getPrice(product)
          const stock = getStock(product)
          const inStock = stock > 0
          const productIsPreOrder = isPreOrder(product)
          const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
          
          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
              <div className="aspect-square relative overflow-hidden bg-muted rounded-t-lg">
                <Link href={getProductUrl(product)}>
                  {primaryImage ? (
                    <Image
                      src={getImageSrc(primaryImage.image_filename)}
                      alt={primaryImage.alt_text || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground/50">No Image</p>
                      </div>
                    </div>
                  )}
                </Link>
                
                {/* Stock badge */}
                {productIsPreOrder ? (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs rounded font-semibold">
                    PRE-ORDER
                  </div>
                ) : !inStock ? (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded">
                    Out of Stock
                  </div>
                ) : null}
                
                {/* Wishlist button - outside of Link so it's clickable */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <WishlistButton 
                    productId={product.id} 
                    className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-white hover:scale-110"
                  />
                </div>
              </div>
              
              <CardContent className="p-4 flex-1 flex flex-col">
                <Link href={getProductUrl(product)} className="flex flex-col h-full">
                  {product.brand && (
                    <p className="text-sm text-muted-foreground mb-1">{product.brand.name}</p>
                  )}
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors flex-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold mt-2">
                    ${(price / 100).toFixed(2)}
                  </p>
                </Link>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 mt-auto">
                <Button
                  className="w-full"
                  size="sm"
                  disabled={(!productIsPreOrder && !inStock) || addingToCart.has(product.id)}
                  onClick={() => handleAddToCart(product)}
                >
                  {addingToCart.has(product.id) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Adding...
                    </>
                  ) : productIsPreOrder ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Pre-Order
                    </>
                  ) : inStock ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Add
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}