"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Heart } from "lucide-react";
import { getImageSrc } from "@/lib/utils/image-utils";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price_cents?: number;
  stock_level?: number;
  track_inventory?: string;
  preorder_release_date?: string;
  preorder_message?: string;
  brand?: {
    name: string;
    slug: string;
  };
  categories?: Array<{
    category?: {
      slug: string;
      name: string;
    };
  }>;
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
}

interface ProductsGridProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export function ProductsGrid({
  products,
  totalCount,
  currentPage,
  perPage,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const totalPages = Math.ceil(totalCount / perPage);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  const getPrice = (product: Product) => {
    // First check if product has variants with prices
    if (product.variants && product.variants.length > 0) {
      const variantPrices = product.variants
        .filter((v) => v.price_cents > 0)
        .map((v) => v.price_cents);
      if (variantPrices.length > 0) {
        return Math.min(...variantPrices);
      }
    }
    // Fall back to base price
    return product.base_price_cents || 0;
  };

  const getStock = (product: Product) => {
    // Check stock_level first (for products with track_inventory = 'by product')
    if (product.track_inventory === 'by product' && product.stock_level !== undefined) {
      return product.stock_level;
    }
    // Check variants
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce(
        (total, variant) => total + (variant.stock || 0),
        0
      );
    }
    // If not tracking inventory, assume in stock
    if (product.track_inventory === 'none') {
      return 999;
    }
    return 0;
  };

  const isPreOrder = (product: Product) => {
    // Check if product has preorder release date
    if (product.preorder_release_date) {
      return true;
    }
    // Check if product name contains "preorder"
    if (product.name && product.name.toLowerCase().includes('preorder')) {
      return true;
    }
    // Check if product is in "Pre Orders" category
    if (product.categories && product.categories.length > 0) {
      const hasPreOrderCategory = product.categories.some(
        (pc: any) => pc.category && pc.category.slug === 'pre-orders'
      );
      if (hasPreOrderCategory) {
        return true;
      }
    }
    return false;
  };

  const getProductUrl = (product: Product) => {
    // Determine the best category path for the product
    if (product.categories && product.categories.length > 0) {
      // Priority order for special categories
      const specialCategories = ['pre-orders', 'convention-exclusives', 'new-products', 'on-sale', 'the-archive'];
      
      for (const special of specialCategories) {
        const hasSpecial = product.categories.some(
          (pc: any) => pc.category && pc.category.slug === special
        );
        if (hasSpecial) {
          return `/${special}/${product.slug}`;
        }
      }
      
      // Use first regular category
      const firstCategory = product.categories[0];
      if (firstCategory?.category?.slug) {
        return `/${firstCategory.category.slug}/${product.slug}`;
      }
    }
    
    // Fallback to brand if no categories
    if (product.brand?.slug) {
      return `/brands/${product.brand.slug}/${product.slug}`;
    }
    
    // Final fallback to products
    return `/products/${product.slug}`;
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find((img) => img.is_primary);
    return primaryImage || product.images?.[0];
  };

  const updateURL = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    router.push(`/products?${current.toString()}`);
  };

  const handlePerPageChange = (newPerPage: string) => {
    updateURL({ per_page: newPerPage, page: "1" });
  };

  const handleSortChange = (sort: string) => {
    updateURL({ sort, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="products-page-container">
      {/* Products Header */}
      <div className="products-header">
        <div className="products-header-left">
          <p className="products-count">
            Showing {(currentPage - 1) * perPage + 1}-
            {Math.min(currentPage * perPage, totalCount)} of {totalCount}{" "}
            products
          </p>
        </div>

        <div className="products-header-right">
          {/* Sort Dropdown */}
          <div className="sort-container">
            <label htmlFor="sort" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured Items</option>
              <option value="newest">Newest Items</option>
              <option value="best-selling">Best Selling</option>
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
              <option value="price-asc">Price: Ascending</option>
              <option value="price-desc">Price: Descending</option>
              <option value="review">By Review</option>
              <option value="by-product">By Product</option>
              <option value="year-oldest">Year: Oldest First</option>
              <option value="year-newest">Year: Newest First</option>
            </select>
          </div>

          {/* Per Page Selector */}
          <div className="per-page-container">
            <label htmlFor="perPage" className="per-page-label">
              Show:
            </label>
            <select
              id="perPage"
              value={perPage}
              onChange={(e) => handlePerPageChange(e.target.value)}
              className="per-page-select"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
              <option value="48">48</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="figma-frame-container">
        <div className="figma-frame-div products-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" data-columns="3">
          {products.map((product) => {
            const price = getPrice(product);
            const stock = getStock(product);
            const image = getPrimaryImage(product);
            const hasError = imageErrors.has(product.id);
            const inStock = stock > 0;
            const productIsPreOrder = isPreOrder(product);

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
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                      <div
                        className={
                          productIsPreOrder
                            ? "figma-pre-order-wrapper"
                            : inStock
                            ? "figma-in-stock-wrapper"
                            : "figma-out-of-stock-wrapper"
                        }
                      >
                        <b
                          className={
                            productIsPreOrder
                              ? "figma-pre-order"
                              : inStock
                              ? "figma-in-stock"
                              : "figma-out-of-stock"
                          }
                        >
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
                                className="figma-brand-link"
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

                        <div className="figma-frame-group">
                          <div className="figma-add-to-cart-parent">
                            <button
                              type="button"
                              className="figma-add-to-cart-btn"
                              onClick={() => {
                                if (productIsPreOrder && !user) {
                                  // Redirect to login with return URL to product page
                                  const returnUrl = encodeURIComponent(getProductUrl(product));
                                  window.location.href = `/auth/login?redirectTo=${returnUrl}`;
                                } else {
                                  window.location.href = getProductUrl(product);
                                }
                              }}
                              disabled={!productIsPreOrder && !inStock}
                            >
                              <b className="figma-add-to-cart">
                                {productIsPreOrder
                                  ? user 
                                    ? "PRE-ORDER NOW"
                                    : "LOGIN TO PRE-ORDER"
                                  : inStock
                                  ? "ADD TO CART"
                                  : "OUT OF STOCK"}
                              </b>
                              <Plus className="figma-add-icon" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="figma-add-to-wishlist-parent"
                            onClick={() => {
                              window.location.href = getProductUrl(product);
                            }}
                          >
                            <b className="figma-add-to-wishlist">
                              ADD TO WISHLIST
                            </b>
                            <Heart className="figma-wishlist-icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn pagination-prev"
              aria-label="Previous page"
            >
              <ChevronLeft className="pagination-icon" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="pagination-numbers">
              {/* Always show first page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`pagination-number ${
                  currentPage === 1 ? "active" : ""
                }`}
              >
                1
              </button>

              {/* Show dots if needed */}
              {currentPage > 3 && <span className="pagination-dots">...</span>}

              {/* Show pages around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (page === 1 || page === totalPages) return false;
                  return Math.abs(page - currentPage) <= 1;
                })
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {/* Show dots if needed */}
              {currentPage < totalPages - 2 && (
                <span className="pagination-dots">...</span>
              )}

              {/* Always show last page if more than 1 page */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`pagination-number ${
                    currentPage === totalPages ? "active" : ""
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn pagination-next"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
