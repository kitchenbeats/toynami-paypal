'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ProductOptionsSelector } from './product-options-selector'
import { getImageSrc } from '@/lib/utils/image-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {} from '@/components/ui/card'
import { ShoppingCart, Heart, Share2, Shield, Truck, Package,  ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/hooks/use-cart'
import { toast } from 'sonner'

interface ProductImage {
  id: string
  media_id?: string
  image_filename?: string // legacy field
  alt_text?: string
  is_primary: boolean
  position?: number
  media?: {
    id: string
    file_url: string
    title?: string
    alt_text?: string
  }
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
  sku?: string
  retail_price_cents?: number
  sale_price_cents?: number
  calculated_price_cents?: number
  base_price_cents?: number
  compare_price_cents?: number
  stock_level?: number
  track_inventory?: string
  variants: ProductVariant[]
  images: ProductImage[]
  categories: Array<{ name: string; slug: string }>
  warranty?: string
  condition?: string
  weight?: number
  width?: number
  height?: number
  depth?: number
  customFields?: Record<string, unknown>
  minTierOrder?: number
  preorder_release_date?: string
  preorder_message?: string
  min_purchase_quantity?: number
  max_purchase_quantity?: number | null
  options?: Array<{
    id: string
    name: string
    display_name: string
    input_type: string
    is_required: boolean
    values: Array<{
      id: string
      option_id: string
      value: string
      display_value?: string
      hex_color?: string
      sku_suffix: string
      is_default: boolean
    }>
  }>
  option_pricing?: Array<{
    option_value_id: string
    price_adjustment_cents: number
    stock_override?: number
    is_available: boolean
  }>
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { addItem } = useCart()
  
  // Handle min/max purchase quantities (0 defaults to 1)
  const minQty = product.min_purchase_quantity && product.min_purchase_quantity > 0 ? product.min_purchase_quantity : 1
  const maxQty = product.max_purchase_quantity || null
  
  const [quantity, setQuantity] = useState(minQty)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [quantityMessage, setQuantityMessage] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [optionPriceAdjustment, setOptionPriceAdjustment] = useState(0)
  const [optionStock] = useState<number | null>(null)
  
  // Handle option selection changes
  const handleOptionSelectionChange = useCallback((selections: Record<string, string>, priceAdjustment: number) => {
    setSelectedOptions(selections)
    setOptionPriceAdjustment(priceAdjustment)
  }, [])
  
  // Get user authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

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

  // Calculate pricing and stock
  const activeVariants = product.variants.filter(v => v.is_active)
  const currentVariant = activeVariants[selectedVariant] || activeVariants[0]
  
  // Get price - prioritize: variant price > sale price > retail price > calculated price > base price
  let basePrice = 0
  if (currentVariant && currentVariant.price_cents) {
    basePrice = currentVariant.price_cents / 100
  } else if (product.sale_price_cents) {
    basePrice = product.sale_price_cents / 100
  } else if (product.retail_price_cents) {
    basePrice = product.retail_price_cents / 100
  } else if (product.calculated_price_cents) {
    basePrice = product.calculated_price_cents / 100
  } else if (product.base_price_cents) {
    basePrice = product.base_price_cents / 100
  }
  
  // Add option price adjustments
  const price = basePrice + optionPriceAdjustment
  
  // Get compare price for showing savings
  const comparePrice = product.compare_price_cents ? product.compare_price_cents / 100 : 
                       (product.retail_price_cents && product.sale_price_cents ? product.retail_price_cents / 100 : null)
  
  // Get stock - check product level first, then variant
  let stock = 0
  let sku = product.sku || 'N/A'
  
  if (product.track_inventory === 'by product' && product.stock_level !== undefined) {
    stock = product.stock_level
  } else if (product.track_inventory === 'by variant' && currentVariant) {
    stock = currentVariant.stock || 0
    sku = currentVariant.sku || product.sku || 'N/A'
  } else if (product.track_inventory === 'none') {
    stock = 999 // Assume in stock if not tracking
  } else if (currentVariant) {
    stock = currentVariant.stock || 0
  }
  
  // Check if product is in stock (considering option stock if applicable)
  // If options exist and optionStock is set (not null), use it. Otherwise use base stock
  const hasOptionsWithStock = product.options && product.options.length > 0 && optionStock !== null
  const effectiveStock = hasOptionsWithStock ? optionStock : stock
  const inStock = hasOptionsWithStock ? (optionStock > 0) : (stock > 0)
  
  // Check if product is pre-order
  const isPreOrder = () => {
    // Check preorder_release_date field
    if (product.preorder_release_date) {
      return true
    }
    // Check if product is in "Pre Orders" category
    if (product.categories && product.categories.length > 0) {
      const hasPreOrderCategory = product.categories.some(
        (category) => category.slug === 'pre-orders'
      )
      if (hasPreOrderCategory) {
        return true
      }
    }
    return false
  }
  
  const productIsPreOrder = isPreOrder()

  // Quantity handlers
  const decreaseQuantity = useCallback(() => {
    const newQty = Math.max(minQty, quantity - 1)
    setQuantity(newQty)
    if (maxQty === 1) {
      setQuantityMessage('🎯 Limited Edition: 1 per customer')
    } else {
      setQuantityMessage(null)
    }
  }, [minQty, quantity, maxQty])

  const increaseQuantity = useCallback(() => {
    // If stock is unlimited (null from options), use a high number for calculations
    const stockLimit = effectiveStock || 999
    const maxAllowed = maxQty ? Math.min(stockLimit, maxQty) : stockLimit
    const newQty = Math.min(maxAllowed, quantity + 1)
    setQuantity(newQty)
    
    if (maxQty && newQty >= maxQty) {
      if (maxQty === 1) {
        setQuantityMessage('🎯 Limited Edition: 1 per customer')
      } else {
        setQuantityMessage(`🎯 Maximum ${maxQty} per customer for this exclusive item`)
      }
    } else {
      setQuantityMessage(null)
    }
  }, [quantity, maxQty, effectiveStock])

  const handleQuantityInput = useCallback((val: number) => {
    // If stock is unlimited (null from options), use a high number for calculations
    const stockLimit = effectiveStock || 999
    const maxAllowed = maxQty ? Math.min(stockLimit, maxQty) : stockLimit
    const newQty = Math.min(maxAllowed, Math.max(minQty, val))
    setQuantity(newQty)
    
    // Set friendly messages
    if (maxQty && val > maxQty) {
      if (maxQty === 1) {
        setQuantityMessage('🎯 Limited Edition: 1 per customer - ensuring everyone gets a chance!')
      } else {
        setQuantityMessage(`🎯 Limited to ${maxQty} per customer for this exclusive item`)
      }
    } else if (val < minQty) {
      setQuantityMessage(`Minimum order quantity is ${minQty}`)
    } else {
      setQuantityMessage(null)
    }
  }, [minQty, maxQty, effectiveStock])

  // Image handling
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : []

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length)
  }

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }
  
  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    try {
      // Build options string for cart display
      const optionsString = product.options?.map(option => {
        const selectedValueId = selectedOptions[option.id]
        const selectedValue = option.values.find((v) => v.id === selectedValueId)
        return selectedValue ? `${option.display_name}: ${selectedValue.display_name}` : ''
      }).filter(Boolean).join(', ')
      
      await addItem({
        productId: product.id,
        options: optionsString,
        selectedOptions: selectedOptions,
        variantId: currentVariant?.id,
        productName: product.name,
        price: price * 100, // Convert back to cents for cart
        quantity: quantity,
        image: displayImages[0]?.media?.file_url || displayImages[0]?.image_filename || product.image_url,
        weight: product.weight || 1.0, // Default to 1 lb if not specified
        dimensions: product.width && product.height && product.depth ? {
          length: Number(product.depth) || 12,
          width: Number(product.width) || 12,
          height: Number(product.height) || 6
        } : undefined,
        min_purchase_quantity: minQty,
        max_purchase_quantity: maxQty
      })
      
      toast.success(`Added to cart`, {
        description: `${quantity} × ${product.name} added to your cart`
      })
      
      // Reset quantity to minimum after adding
      setQuantity(minQty)
    } catch (error) {
        console.error('Error in catch block:', error)
      toast.error('Failed to add item to cart', {
        description: 'Please try again.'
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
          {displayImages.length > 0 && displayImages[selectedImage] ? (
            <Image
              src={getImageSrc(displayImages[selectedImage].media?.file_url || displayImages[selectedImage].image_filename)}
              alt={displayImages[selectedImage].alt_text || displayImages[selectedImage].media?.alt_text || product.name}
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
                className={`relative aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                  selectedImage === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={getImageSrc(image.media?.file_url || image.image_filename)}
                  alt={image.alt_text || image.media?.alt_text || product.name}
                  fill
                  sizes="(min-width: 1024px) 12vw, (min-width: 768px) 15vw, 22vw"
                  className="object-cover"
                  quality={90}
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
            <Badge variant={productIsPreOrder ? 'outline' : inStock ? 'default' : 'secondary'} className={productIsPreOrder ? 'border-blue-500 text-blue-600' : ''}>
              {productIsPreOrder ? 'Pre-Order' : inStock ? `${stock} in stock` : 'Out of Stock'}
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

        {/* Product Options */}
        {product.options && product.options.length > 0 && (
          <div className="border-t pt-4">
            <ProductOptionsSelector
              options={product.options}
              pricing={product.option_pricing || []}
              onSelectionChange={handleOptionSelectionChange}
            />
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity <= minQty}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min={minQty}
                  max={maxQty || stock}
                  value={quantity}
                  onChange={(e) => handleQuantityInput(parseInt(e.target.value) || minQty)}
                  className="w-16 text-center border-none focus:outline-none"
                />
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity >= (maxQty ? Math.min(effectiveStock || 999, maxQty) : (effectiveStock || 999))}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Friendly message for quantity limits */}
            {quantityMessage && (
              <p className="text-sm text-blue-600 ml-20">{quantityMessage}</p>
            )}
            
            {/* Show limit info upfront for limited editions */}
            {maxQty === 1 && !quantityMessage && (
              <p className="text-sm text-blue-600 ml-20">🎯 Limited Edition: 1 per customer</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 cursor-pointer disabled:cursor-not-allowed"
              disabled={(!productIsPreOrder && !inStock) || isAddingToCart}
              onClick={() => {
                if (productIsPreOrder && !user) {
                  // Redirect to login with return URL to product page
                  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
                  window.location.href = `/auth/login?redirectTo=${returnUrl}`
                } else {
                  handleAddToCart()
                }
              }}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              {isAddingToCart ? 'Adding...' : productIsPreOrder
                ? user 
                  ? 'Pre-Order Now'
                  : 'Login to Pre-Order'
                : inStock 
                ? 'Add to Cart' 
                : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" className="px-6 cursor-pointer hover:bg-gray-50">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-6 cursor-pointer hover:bg-gray-50">
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
          <TabsList className="grid w-full grid-cols-2 gap-4 h-auto p-0 bg-transparent" role="tablist">
            <TabsTrigger 
              value="description" 
              className="w-full py-2 text-sm border-b-2 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:border-gray-200"
              role="tab"
              aria-selected="true"
              aria-controls="description-content"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="w-full py-2 text-sm border-b-2 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:border-gray-200"
              role="tab"
              aria-selected="false"
              aria-controls="specifications-content"
            >
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4" id="description-content" role="tabpanel" aria-labelledby="description-tab">
            <div className="p-6 bg-white border rounded-lg">
              {product.description ? (
                <div className="prose prose-sm max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 text-gray-700">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-4" id="specifications-content" role="tabpanel" aria-labelledby="specifications-tab">
            <div className="p-6 bg-white border rounded-lg">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}