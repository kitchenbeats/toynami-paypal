'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    brand?: { name: string; slug: string }
    brand_id?: string
    base_price_cents?: number
    compare_price_cents?: number
    msrp_cents?: number
    stock_level?: number
    track_inventory?: string
    variants?: Array<{
      id: string
      price_cents: number
      stock: number
      sku?: string
      is_active: boolean
    }>
    images?: Array<{
      image_filename: string
      alt_text?: string
      is_primary: boolean
    }>
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // Get price
  const getPrice = () => {
    if (product.base_price_cents && product.base_price_cents > 0) {
      return product.base_price_cents / 100
    }
    if (product.variants && product.variants.length > 0) {
      const variantPrices = product.variants
        .filter(v => v.price_cents > 0)
        .map(v => v.price_cents)
      if (variantPrices.length > 0) {
        return Math.min(...variantPrices) / 100
      }
    }
    return 0
  }

  // Get stock  
  const getStock = () => {
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

  // Get primary image
  const getPrimaryImage = () => {
    const primaryImage = product.images?.find(img => img.is_primary)
    return primaryImage || product.images?.[0]
  }

  const price = getPrice()
  const comparePrice = product.compare_price_cents ? product.compare_price_cents / 100 : null
  const msrpPrice = product.msrp_cents ? product.msrp_cents / 100 : null
  const stock = getStock()
  const primaryImage = getPrimaryImage()
  const isInStock = stock > 0
  const isOnSale = comparePrice && comparePrice > price

  return (
    <article className="product-card-wrapper">
      <article className="card figma-card">
        <div className="figma-card-container">
          <div className="figma-image-parent">
            <Link href={`/products/${product.slug}`}>
              {primaryImage ? (
                <Image
                  src={getImageSrc(primaryImage.image_filename)}
                  alt={primaryImage.alt_text || product.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="figma-card-image"
                />
              ) : (
                <div className="figma-card-image-placeholder">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </div>
              )}
            </Link>

            <div className={isInStock ? "figma-in-stock-wrapper" : "figma-out-of-stock-wrapper"}>
              <b className={isInStock ? "figma-in-stock" : "figma-out-of-stock"}>
                {isInStock ? "IN STOCK" : "OUT OF STOCK"}
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
                  <Link href={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </b>
                
                <div className="figma-product-price">
                  {msrpPrice && msrpPrice > price && (
                    <div className="price-section price-section--withoutTax rrp-price--withoutTax" style={{ display: msrpPrice > price ? 'block' : 'none' }}>
                      MSRP:
                      <span data-product-rrp-price-without-tax="" className="price price--rrp">
                        ${msrpPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {comparePrice && comparePrice > price && (
                    <div className="price-section price-section--withoutTax non-sale-price--withoutTax" style={{ display: comparePrice > price ? 'block' : 'none' }}>
                      Was:
                      <span data-product-non-sale-price-without-tax="" className="price price--non-sale">
                        ${comparePrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="price-section price-section--withoutTax">
                    <span className="price-label"> </span>
                    <span className="price-now-label" style={{ display: isOnSale ? 'inline' : 'none' }}>
                      Now:
                    </span>
                    <span data-product-price-without-tax="" className="price price--withoutTax">
                      ${price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="figma-frame-child"></div>

              <div className="figma-frame-group" data-product-categories="">
                <div className="figma-add-to-cart-parent">
                  <a
                    href=""
                    data-event-type="product-click"
                    className="figma-add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      if (isInStock) {
                        console.log('Add to cart:', product.id)
                        // TODO: Implement add to cart functionality
                      }
                    }}
                  >
                    <b className="figma-add-to-cart">
                      {isInStock ? 'Add to Cart' : 'OUT OF STOCK'}
                    </b>
                    <svg
                      className="figma-add-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                      />
                    </svg>
                  </a>
                </div>

                <a
                  href="#"
                  className="figma-add-to-wishlist-parent"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Add to wishlist:', product.id)
                    // TODO: Implement wishlist functionality
                  }}
                >
                  <b className="figma-add-to-wishlist">ADD TO WISHLIST</b>
                  <svg
                    className="figma-wishlist-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </article>
  )
}