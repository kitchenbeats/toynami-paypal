"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import { getImageSrc } from "@/lib/utils/image-utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand?: {
      name: string;
      slug: string;
    };
    variants?: Array<{
      id: string;
      price_cents: number;
      stock: number;
      is_active: boolean;
    }>;
    images?: Array<{
      image_filename: string;
      alt_text?: string;
      is_primary: boolean;
    }>;
  };
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getPrice = () => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price_cents));
    }
    return 0;
  };

  const getStock = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce(
        (total, variant) => total + (variant.stock || 0),
        0
      );
    }
    return 0;
  };

  const getPrimaryImage = () => {
    const primaryImage = product.images?.find((img) => img.is_primary);
    return primaryImage || product.images?.[0];
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const price = getPrice();
  const stock = getStock();
  const primaryImage = getPrimaryImage();
  const inStock = stock > 0;

  // Large featured product card
  if (featured) {
    return (
      <div className="main-featured-product-container">
        <div className="main-featured-product-image-parent">
          <Link href={`/products/${product.slug}`}>
            {primaryImage && !imageError ? (
              <Image
                src={getImageSrc(primaryImage.image_filename)}
                alt={primaryImage.alt_text || product.name}
                title={product.name}
                fill
                className="main-featured-product-image"
                onError={handleImageError}
              />
            ) : (
              <div className="main-featured-product-image-placeholder">
                <span>{product.name.charAt(0)}</span>
              </div>
            )}
          </Link>
        </div>

        <div className="main-featured-product-content">
          {/* Status banner */}
          <div className="figma-in-stock-wrapper">
            <b className={inStock ? "in-stock" : "out-of-stock"}>
              {inStock ? "IN STOCK" : "OUT OF STOCK"}
            </b>
          </div>

          <div className="productbox-container1-110-parent">
            <b className="productbox-container1">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </b>

            <div className="div">
              <div className="price-section price-section--withoutTax">
                <span className="price price--withoutTax">
                  ${(price / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="frame-group">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                price={price}
                inStock={inStock}
                className="add-to-cart-parent"
              />

              <WishlistButton
                productId={product.id}
                className="add-to-wishlist-parent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular product card
  return (
    <div className="figma-small-card-wrapper">
      <article className="card figma-card">
        <div className="figma-card-container">
          <div className="figma-image-parent">
            <Link href={`/products/${product.slug}`}>
              {primaryImage && !imageError ? (
                <Image
                  src={getImageSrc(primaryImage.image_filename)}
                  alt={primaryImage.alt_text || product.name}
                  fill
                  className="figma-card-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="figma-card-image-placeholder">
                  <span>{product.name.charAt(0)}</span>
                </div>
              )}
            </Link>

            {/* Stock status badge */}
            <div
              className={
                inStock
                  ? "figma-in-stock-wrapper"
                  : "figma-out-of-stock-wrapper"
              }
            >
              <b className={inStock ? "figma-in-stock" : "figma-out-of-stock"}>
                {inStock ? "IN STOCK" : "OUT OF STOCK"}
              </b>
            </div>

            <div className="figma-frame-parent">
              <div className="figma-product-info">
                {product.brand && (
                  <div className="figma-product-brand">
                    <Link
                      href={`/brands/${product.brand.slug}`}
                      className="figma-brand-link"
                    >
                      {product.brand.name}
                    </Link>
                  </div>
                )}

                <b className="figma-product-title">
                  <Link href={`/products/${product.slug}`}>{product.name}</Link>
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

              <div className="figma-frame-group">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  price={price}
                  inStock={inStock}
                  className="figma-add-to-cart-parent"
                />

                <WishlistButton
                  productId={product.id}
                  className="figma-add-to-wishlist-parent"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
