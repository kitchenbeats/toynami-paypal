'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ShoppingCart, Heart, Share2, Shield, Truck, Package, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImage {
  filename: string
  alt: string
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  price_cents: number
  compare_at_price_cents?: number
  stock: number
  sku: string
  is_active: boolean
}

interface Product {
  id: string
  name: string
  description?: string
  brand: string
  slug: string
  variants: ProductVariant[]
  images: ProductImage[]
  categories: Array<{ name: string; slug: string }>
  warranty?: string
  condition?: string
  weight?: number
  width?: number
  height?: number
  depth?: number
  customFields?: any
  minTierOrder?: number
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)

  // Initialize variant from URL parameters
  useEffect(() => {
    const variantSku = searchParams.get('variant')
    if (variantSku) {
      const activeVariants = product.variants.filter(v => v.is_active)
      const variantIndex = activeVariants.findIndex(v => v.sku === variantSku)
      if (variantIndex !== -1) {
        setSelectedVariant(variantIndex)
      }
    }
  }, [searchParams, product.variants])

  // Update URL when variant changes
  const updateVariantInUrl = (variantIndex: number) => {
    const activeVariants = product.variants.filter(v => v.is_active)
    const variant = activeVariants[variantIndex]
    
    if (variant) {
      const params = new URLSearchParams(searchParams)
      params.set('variant', variant.sku)
      router.replace(`?${params.toString()}`, { shallow: true })
    }
    
    setSelectedVariant(variantIndex)
  }

  // Calculate pricing and stock from variants
  const activeVariants = product.variants.filter(v => v.is_active)
  const currentVariant = activeVariants[selectedVariant] || activeVariants[0]
  
  const price = currentVariant ? currentVariant.price_cents / 100 : 0
  const comparePrice = currentVariant?.compare_at_price_cents ? currentVariant.compare_at_price_cents / 100 : null
  const stock = currentVariant?.stock || 0
  const sku = currentVariant?.sku || 'N/A'
  const inStock = stock > 0

  // Image handling
  const displayImages = product.images.length > 0 
    ? product.images 
    : []

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length)
  }

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
          {displayImages.length > 0 && displayImages[selectedImage] ? (
            <Image
              src={getImageSrc(displayImages[selectedImage].filename)}
              alt={displayImages[selectedImage].alt}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 60vw, 100vw"
              className="object-cover"
              onError={(e) => {
                // Hide broken image instead of setting a new src
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-6xl font-bold text-gray-300">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Image Navigation */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={getImageSrc(image.filename)}
                  alt={image.alt}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${price.toFixed(2)}</span>
              {comparePrice && (
                <span className="text-lg text-muted-foreground line-through">${comparePrice.toFixed(2)}</span>
              )}
            </div>
            {comparePrice && (
              <Badge variant="destructive">
                Save ${(comparePrice - price).toFixed(2)}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant={inStock ? 'default' : 'secondary'}>
              {inStock ? `${stock} in stock` : 'Out of Stock'}
            </Badge>
            <span className="text-sm text-muted-foreground">SKU: {sku}</span>
          </div>
        </div>

        {/* Variants Selection */}
        {activeVariants.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Options:</label>
            <div className="grid grid-cols-2 gap-2">
              {activeVariants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => updateVariantInUrl(index)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    selectedVariant === index
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {variant.sku} - ${(variant.price_cents / 100).toFixed(2)}
                  {variant.stock <= 0 && <span className="text-red-500 ml-1">(Out)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-16 text-center border-none focus:outline-none"
              />
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={!inStock}
              onClick={() => console.log('Add to cart:', { productId: product.id, variantId: currentVariant?.id, quantity })}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium">Authenticity</span>
            <span className="text-xs text-muted-foreground">Guaranteed</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium">Free Shipping</span>
            <span className="text-xs text-muted-foreground">Orders $100+</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Package className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium">Collector</span>
            <span className="text-xs text-muted-foreground">Packaging</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <Card className="p-6">
              {product.description ? (
                <div className="prose prose-sm max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                  <span className="font-medium">SKU</span>
                  <span className="text-muted-foreground">{sku}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                  <span className="font-medium">Brand</span>
                  <span className="text-muted-foreground">{product.brand}</span>
                </div>
                {product.condition && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                    <span className="font-medium">Condition</span>
                    <span className="text-muted-foreground capitalize">{product.condition}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                    <span className="font-medium">Weight</span>
                    <span className="text-muted-foreground">{product.weight}g</span>
                  </div>
                )}
                {(product.width && product.height) && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                    <span className="font-medium">Dimensions</span>
                    <span className="text-muted-foreground">
                      {product.width} × {product.height}{product.depth ? ` × ${product.depth}` : ''} cm
                    </span>
                  </div>
                )}
                {product.warranty && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                    <span className="font-medium">Warranty</span>
                    <span className="text-muted-foreground">{product.warranty}</span>
                  </div>
                )}
                {product.categories.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
                    <span className="font-medium">Categories</span>
                    <div className="flex flex-wrap gap-1">
                      {product.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}