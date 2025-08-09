'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ShoppingCart, Heart, Share2, Shield, Truck, Package, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductDetailProps {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock product data - in production, fetch from Supabase
  const product = {
    id: 1,
    name: 'VF-1S Valkyrie Roy Focker Special Edition',
    brand: 'Robotech',
    price: 249.99,
    comparePrice: 299.99,
    sku: 'RT-VF1S-001',
    inStock: true,
    stockCount: 5,
    rating: 4.5,
    reviews: 23,
    images: [
      '/images/product-placeholder.jpg',
      '/images/product-placeholder.jpg',
      '/images/product-placeholder.jpg',
      '/images/product-placeholder.jpg',
    ],
    description: `The VF-1S Valkyrie Roy Focker Special Edition is a premium collectible figure from the legendary Robotech series. This meticulously crafted piece features incredible attention to detail, authentic paint schemes, and fully articulated joints for dynamic posing.

Perfect for collectors and fans of the series, this special edition includes exclusive accessories and comes in premium packaging designed for display.`,
    features: [
      'Highly detailed sculpt with authentic paint application',
      'Fully articulated with over 30 points of movement',
      'Includes exclusive pilot figure',
      'Premium collector packaging',
      'Limited edition certificate of authenticity',
      'Scale: 1/100',
      'Material: High-quality ABS plastic',
    ],
    specifications: {
      'Product Code': 'RT-VF1S-001',
      'Scale': '1/100',
      'Material': 'ABS Plastic',
      'Height': '15cm',
      'Width': '20cm (wingspan)',
      'Weight': '450g',
      'Release Date': 'March 2024',
      'Manufacturer': 'Toynami',
    },
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden bg-muted rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-20 w-20 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground/50">Product Image</p>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-muted rounded-md overflow-hidden border-2 ${
                selectedImage === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
            <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.comparePrice}
              </span>
            )}
            {product.comparePrice && (
              <Badge variant="destructive">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </Badge>
            )}
          </div>
          {product.inStock ? (
            <p className="text-sm text-green-600">✓ In Stock ({product.stockCount} available)</p>
          ) : (
            <p className="text-sm text-destructive">Out of Stock</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-muted"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-muted"
                disabled={quantity >= product.stockCount}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1" disabled={!product.inStock}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Free Shipping</p>
              <p className="text-muted-foreground">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Secure Payment</p>
              <p className="text-muted-foreground">100% Protected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Easy Returns</p>
              <p className="text-muted-foreground">30 Day Policy</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 space-y-4">
            <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <dl className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <dt className="font-medium">{key}:</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}