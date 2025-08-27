'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { Plus, Heart } from 'lucide-react'
import { getImageSrc } from '@/lib/utils/image-utils'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/hooks/use-cart'
import { toast } from 'sonner'

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

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const supabase = createClient()
  const { addItem } = useCart()
  
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
  
  const handleImageError = useCallback((productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId))
  }, [])

  const getPrice = (product: Product) => {
    // First check base price
    if (product.base_price_cents && product.base_price_cents > 0) {
      return product.base_price_cents
    }
    // Fall back to variant prices
    if (product.variants && product.variants.length > 0) {
      const variantPrices = product.variants
        .filter(v => v.price_cents > 0)
        .map(v => v.price_cents)
      if (variantPrices.length > 0) {
        return Math.min(...variantPrices)
      }
    }
    return 0
  }

  const getStock = (product: Product) => {
    // Check stock_level first (for products with track_inventory = 'by product')
    if (product.track_inventory === 'by product' && product.stock_level !== undefined) {
      return product.stock_level
    }
    // Check variants
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0)
    }
    // If not tracking inventory, assume in stock
    if (product.track_inventory === 'none') {
      return 999
    }
    return 0
  }

  const isPreOrder = (product: Product) => {
    // Check preorder_release_date field
    if (product.preorder_release_date) {
      return true
    }
    // Check if product is in "Pre Orders" category
    if (product.categories && product.categories.length > 0) {
      const hasPreOrderCategory = product.categories.some(
        (pc) => pc.category && pc.category.slug === 'pre-orders'
      )
      if (hasPreOrderCategory) {
        return true
      }
    }
    return false
  }

  const getProductUrl = (product: Product) => {
    // Determine the best category path for the product
    if (product.categories && product.categories.length > 0) {
      // Priority order for special categories
      const specialCategories = ['pre-orders', 'convention-exclusives', 'new-products', 'on-sale', 'the-archive']
      
      for (const special of specialCategories) {
        const hasSpecial = product.categories.some(
          (pc) => pc.category && pc.category.slug === special
        )
        if (hasSpecial) {
          return `/${special}/${product.slug}`
        }
      }
      
      // Use first regular category
      const firstCategory = product.categories[0]
      if (firstCategory?.category?.slug) {
        return `/${firstCategory.category.slug}/${product.slug}`
      }
    }
    
    // Fallback to brand if no categories
    if (product.brand?.slug) {
      return `/brands/${product.brand.slug}/${product.slug}`
    }
    
    // Final fallback
    return `/products/${product.slug}`
  }

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.is_primary)
    return primaryImage || product.images?.[0]
  }

  const handleAddToCart = async (product: Product, isPreOrder: boolean) => {
    if (isPreOrder && !user) {
      const returnUrl = encodeURIComponent(getProductUrl(product))
      window.location.href = `/auth/login?redirectTo=${returnUrl}`
      return
    }

    setAddingToCart(prev => new Set(prev).add(product.id))
    
    try {
      const price = getPrice(product)
      const primaryImage = getPrimaryImage(product)
      await addItem({
        productId: product.id,
        variantId: product.variants?.[0]?.id,
        productName: product.name,
        price: price,
        quantity: 1,
        image: primaryImage?.image_filename || product.image_url,
        weight: product.weight || 1.0, // Default to 1 lb if not specified
        dimensions: product.width && product.height && product.depth ? {
          length: Number(product.depth) || 12,
          width: Number(product.width) || 12,
          height: Number(product.height) || 6
        } : undefined,
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

  // Split products into featured (first) and grid (rest)
  const [featuredProduct, ...gridProducts] = products

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'white', opacity: 0.8 }}>
          No products available at this time.
        </p>
      </div>
    )
  }

  return (
    <div className="figma-group-parent">
      {/* Large Featured Product */}
      {featuredProduct && (
        <div className="main-featured-product-container">
          <div className="main-featured-product-image-parent">
            <Link href={getProductUrl(featuredProduct)}>
              {(() => {
                const image = getPrimaryImage(featuredProduct)
                const hasError = imageErrors.has(featuredProduct.id)
                
                if (image && !hasError) {
                  return (
                    <Image
                      src={getImageSrc(image.image_filename)}
                      alt={image.alt_text || featuredProduct.name}
                      title={featuredProduct.name}
                      fill
                      className="main-featured-product-image"
                      onError={() => handleImageError(featuredProduct.id)}
                    />
                  )
                } else {
                  return (
                    <div className="main-featured-product-image-placeholder">
                      <span>{featuredProduct.name.charAt(0)}</span>
                    </div>
                  )
                }
              })()}
            </Link>
          </div>

          <div className="main-featured-product-content">
            <div className="productbox-container1-110-parent">
              {/* Status badge in details section */}
              {isPreOrder(featuredProduct) ? (
                <div className="figma-pre-order-wrapper">
                  <b className="pre-order">PRE-ORDER</b>
                </div>
              ) : getStock(featuredProduct) > 0 ? (
                <div className="figma-in-stock-wrapper">
                  <b className="in-stock">IN STOCK</b>
                </div>
              ) : (
                <div className="figma-out-of-stock-wrapper">
                  <b className="out-of-stock">OUT OF STOCK</b>
                </div>
              )}
              
              <b className="productbox-container1">
                <Link href={getProductUrl(featuredProduct)}>
                  {featuredProduct.name}
                </Link>
              </b>
              
              <div className="div">
                <div className="price-section price-section--withoutTax">
                  <span className="price price--withoutTax">
                    ${(getPrice(featuredProduct) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="frame-group">
                <button 
                  type="button"
                  className="add-to-cart-parent"
                  onClick={() => handleAddToCart(featuredProduct, isPreOrder(featuredProduct))}
                  disabled={(!isPreOrder(featuredProduct) && getStock(featuredProduct) === 0) || addingToCart.has(featuredProduct.id)}
                >
                  <b className="add-to-cart">
                    {addingToCart.has(featuredProduct.id)
                      ? "ADDING..."
                      : isPreOrder(featuredProduct)
                      ? user 
                        ? "PRE-ORDER NOW"
                        : "LOGIN TO PRE-ORDER"
                      : getStock(featuredProduct) > 0
                      ? "ADD TO CART"
                      : "OUT OF STOCK"}
                  </b>
                  {addingToCart.has(featuredProduct.id) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <Plus className="open-heart-icon" />
                  )}
                </button>
                
                <button 
                  type="button"
                  className="add-to-wishlist-parent"
                  onClick={() => {
                    // Wishlist functionality - for future implementation
                    alert('Wishlist feature coming soon!')
                  }}
                >
                  <b className="add-to-cart">ADD TO WISHLIST</b>
                  <Heart className="open-heart-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of smaller product cards */}
      {gridProducts.length > 0 && (
        <div className="figma-frame-container">
          <div className="figma-frame-div" data-columns="4">
            {gridProducts.map((product) => {
              const price = getPrice(product)
              const stock = getStock(product)
              const image = getPrimaryImage(product)
              const hasError = imageErrors.has(product.id)
              const inStock = stock > 0
              const productIsPreOrder = isPreOrder(product)

              return (
                <div key={product.id} className="figma-small-card-wrapper">
                  <article className="card figma-card">
                    <div className="figma-card-container">
                      <div className="figma-image-parent">
                        <Link href={getProductUrl(product)}>
                          {image && !hasError ? (
                            <Image
                              src={getImageSrc(image.image_filename)}
                              alt={image.alt_text || product.name}
                              fill
                              className="figma-card-image"
                              onError={() => handleImageError(product.id)}
                            />
                          ) : (
                            <div className="figma-card-image-placeholder">
                              <span>{product.name.charAt(0)}</span>
                            </div>
                          )}
                        </Link>

                        {/* Stock/Pre-order status badge */}
                        <div className={
                          productIsPreOrder
                            ? "figma-pre-order-wrapper"
                            : inStock
                            ? "figma-in-stock-wrapper"
                            : "figma-out-of-stock-wrapper"
                        }>
                          <b className={
                            productIsPreOrder
                              ? "figma-pre-order"
                              : inStock
                              ? "figma-in-stock"
                              : "figma-out-of-stock"
                          }>
                            {productIsPreOrder
                              ? "PRE-ORDER"
                              : inStock
                              ? "IN STOCK"
                              : "OUT OF STOCK"}
                          </b>
                        </div>

                        <div className="figma-frame-parent">
                          <div className="figma-product-info">
                            {product.brand && (
                              <div className="figma-product-brand">
                                <Link 
                                  href={`/brands/${product.brand.slug}`} 
                                  className="figma-brand-link js-brand-link"
                                  data-brand-name={product.brand.name}
                                >
                                  {product.brand.name}
                                </Link>
                              </div>
                            )}
                            
                            <b className="figma-product-title">
                              <Link href={getProductUrl(product)}>
                                {product.name}
                              </Link>
                            </b>
                            
                            <div className="figma-product-price">
                              <div className="price-section price-section--withoutTax">
                                <span className="price price--withoutTax">
                                  ${(price / 100).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="figma-frame-child"></div>

                          <div className="figma-frame-group" data-product-categories="">
                            <div className="figma-add-to-cart-parent">
                              <button
                                type="button"
                                className="figma-add-to-cart-btn"
                                onClick={() => handleAddToCart(product, productIsPreOrder)}
                                disabled={(!productIsPreOrder && !inStock) || addingToCart.has(product.id)}
                              >
                                <b className="figma-add-to-cart">
                                  {addingToCart.has(product.id)
                                    ? "ADDING..."
                                    : productIsPreOrder
                                    ? user 
                                      ? "PRE-ORDER NOW"
                                      : "LOGIN TO PRE-ORDER"
                                    : inStock
                                    ? "ADD TO CART"
                                    : "OUT OF STOCK"}
                                </b>
                                {addingToCart.has(product.id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                ) : (
                                  <Plus className="figma-add-icon" />
                                )}
                              </button>
                            </div>

                            <button 
                              type="button"
                              className="figma-add-to-wishlist-parent"
                              onClick={() => {
                                window.location.href = `/products/${product.slug}`
                              }}
                            >
                              <b className="figma-add-to-wishlist">ADD TO WISHLIST</b>
                              <Heart className="figma-wishlist-icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}