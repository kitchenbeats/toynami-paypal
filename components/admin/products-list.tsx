"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Package,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ProductVariant {
  id: string;
  price_cents: number;
  stock: number;
  is_active: boolean;
  sku?: string;
}

interface ProductCategory {
  id: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductImage {
  id: string;
  image_filename: string;
  alt_text?: string;
  is_primary: boolean;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  base_price_cents: number | null;
  compare_price_cents: number | null;
  stock_level: number | null;
  track_inventory: "none" | "by product" | "by variant" | null;
  low_stock_level: number | null;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  status: string;
  allow_purchases: boolean;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  categories: ProductCategory[];
  images: ProductImage[];
  brand: Brand | null;
}

interface ProductsListProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
}

export function ProductsList({
  initialProducts,
  initialTotal,
  categories,
}: ProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(
    new Set()
  );
  const supabase = createClient();
  const limit = 10;

  const fetchProducts = async (
    newPage: number,
    categoryFilters: string[] = []
  ) => {
    setLoading(true);
    const offset = (newPage - 1) * limit;

    // First, get product IDs that match category filters
    let productIds: number[] | null = null;

    if (categoryFilters.length > 0) {
      const { data: categoryProducts } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryFilters);

      if (categoryProducts && categoryProducts.length > 0) {
        productIds = [...new Set(categoryProducts.map((cp) => cp.product_id))];
      } else {
        // No products in selected categories
        setProducts([]);
        setTotal(0);
        setLoading(false);
        return;
      }
    }

    // Now get the products
    let query = supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        sku,
        base_price_cents,
        compare_price_cents,
        stock_level,
        track_inventory,
        low_stock_level,
        is_featured,
        is_new,
        is_on_sale,
        status,
        allow_purchases,
        created_at,
        updated_at,
        variants:product_variants(id, sku, price_cents, stock, is_active, option_values),
        categories:product_categories(
          category:categories(id, name, slug)
        ),
        brand:brands(name, slug)
      `,
        { count: "exact" }
      )
      .eq("status", "active")
      .eq("is_visible", true)
      .is("deleted_at", null);

    // Apply product ID filter if categories were selected
    if (productIds) {
      query = query.in("id", productIds);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count } = await query;

    // Fetch images for products via media_usage
    let productsWithImages = data || [];
    if (productsWithImages.length > 0) {
      const productIds = productsWithImages.map(p => p.id.toString());
      
      const { data: mediaUsageData } = await supabase
        .from('media_usage')
        .select(`
          entity_id,
          field_name,
          media:media_library (
            id,
            file_url,
            alt_text
          )
        `)
        .eq('entity_type', 'product')
        .in('entity_id', productIds)
        .eq('field_name', 'primary_image'); // Only get primary images for list view
      
      // Create a map of images by product ID
      interface ProductImage {
        image_filename: string
        alt_text: string | null
      }
      
      const imagesByProduct: Record<string, ProductImage> = {};
      (mediaUsageData || []).forEach(usage => {
        if (usage.media) {
          imagesByProduct[usage.entity_id] = {
            image_filename: usage.media.file_url,
            alt_text: usage.media.alt_text
          };
        }
      });
      
      // Attach images to products
      productsWithImages = productsWithImages.map(product => ({
        ...product,
        images: imagesByProduct[product.id] ? [imagesByProduct[product.id]] : []
      }));
    }

    if (productsWithImages) {
      setProducts(productsWithImages);
      setTotal(count || 0);
    }

    setLoading(false);
  };

  const toggleFeatured = async (productId: number, currentValue: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !currentValue })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update featured status");
    } else {
      toast.success("Featured status updated");
      // Update local state
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_featured: !currentValue } : p
        )
      );
    }
  };

  const updateProductCategories = async (
    productId: number,
    categoryIds: string[]
  ) => {
    // First delete existing categories
    await supabase
      .from("product_categories")
      .delete()
      .eq("product_id", productId);

    // Then insert new ones
    if (categoryIds.length > 0) {
      const { error } = await supabase.from("product_categories").insert(
        categoryIds.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }))
      );

      if (error) {
        toast.error("Failed to update categories");
      } else {
        toast.success("Categories updated");
        // Refresh the product's categories in local state
        fetchProducts(page, selectedCategories);
      }
    } else {
      toast.success("Categories updated");
      fetchProducts(page, selectedCategories);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((c) => c !== categoryId);

    setSelectedCategories(newCategories);
    setPage(1);
    fetchProducts(1, newCategories);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage, selectedCategories);
  };

  const toggleExpanded = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getImageUrl = (product: Product) => {
    const image = product.images?.[0];
    if (!image) return null;

    const filename = image.image_filename;
    if (!filename) return null;

    // Handle different CDN sources
    if (filename.startsWith("http")) {
      return filename;
    } else if (filename.includes("bigcommerce")) {
      return `https://cdn11.bigcommerce.com/s-2x00x/${filename}`;
    } else {
      return `https://www.toynami.com/uploads/${filename}`;
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Active Products ({total})</h3>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter by Category ({selectedCategories.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked)
                  }
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin/products">
            <Button size="sm">Manage All Products</Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Brand / Categories</th>
              <th className="text-left p-3">SKU</th>
              <th className="text-right p-3">Price</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-8 text-muted-foreground"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const hasVariants =
                  product.variants && product.variants.length > 0;
                const minPrice = hasVariants
                  ? Math.min(
                      ...product.variants.map((v) => v.price_cents)
                    ) / 100
                  : product.base_price_cents
                  ? product.base_price_cents / 100
                  : 0;

                // Smart stock calculation based on inventory tracking mode
                let stockDisplay: {
                  value: number | string;
                  color: string;
                  label?: string;
                } = { value: 0, color: "" };

                if (product.track_inventory === "none") {
                  stockDisplay = {
                    value: "∞",
                    color: "text-green-600",
                    label: "Not tracked",
                  };
                } else if (
                  product.track_inventory === "by variant" &&
                  hasVariants
                ) {
                  const totalStock = product.variants.reduce(
                    (sum: number, v) => sum + (v.stock || 0),
                    0
                  );
                  const activeVariants = product.variants.filter(
                    (v) => v.is_active
                  );
                  const lowStock = product.low_stock_level || 5;

                  stockDisplay = {
                    value: totalStock,
                    color:
                      totalStock === 0
                        ? "text-red-500"
                        : totalStock <= lowStock
                        ? "text-yellow-600"
                        : "",
                    label: `${activeVariants.length} active variant${
                      activeVariants.length !== 1 ? "s" : ""
                    }`,
                  };
                } else if (product.track_inventory === "by product") {
                  const stock = product.stock_level || 0;
                  const lowStock = product.low_stock_level || 5;

                  stockDisplay = {
                    value: stock,
                    color:
                      stock === 0
                        ? "text-red-500"
                        : stock <= lowStock
                        ? "text-yellow-600"
                        : "",
                  };
                } else {
                  // Fallback for legacy data
                  const totalStock = hasVariants
                    ? product.variants.reduce(
                        (sum: number, v) => sum + (v.stock || 0),
                        0
                      )
                    : product.stock_level || 0;
                  stockDisplay = {
                    value: totalStock,
                    color: totalStock === 0 ? "text-red-500" : "",
                  };
                }

                const imageUrl = getImageUrl(product);
                const isExpanded = expandedProducts.has(product.id);

                return (
                  <Fragment key={product.id}>
                    <tr key={product.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {hasVariants && (
                            <button
                              onClick={() => toggleExpanded(product.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={
                                  product.images?.[0]?.alt_text || product.name
                                }
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/${product.slug}`}
                              className="hover:underline font-medium"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              {product.is_new && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-blue-500"
                                >
                                  New
                                </Badge>
                              )}
                              {product.is_on_sale && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Sale
                                </Badge>
                              )}
                              {hasVariants && (
                                <span className="text-xs text-muted-foreground">
                                  {product.variants.length} variant
                                  {product.variants.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {product.brand && (
                            <div className="text-sm font-medium">
                              {product.brand.name}
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-auto py-1"
                              >
                                <div className="flex flex-wrap gap-1">
                                  {product.categories?.length > 0 ? (
                                    <>
                                      {product.categories
                                        .slice(0, 1)
                                        .map((pc) => (
                                          <span
                                            key={pc.category.id}
                                            className="text-xs"
                                          >
                                            {pc.category.name}
                                          </span>
                                        ))}
                                      {product.categories.length > 1 && (
                                        <span className="text-xs text-muted-foreground">
                                          +{product.categories.length - 1}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      No categories
                                    </span>
                                  )}
                                </div>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                              <DropdownMenuLabel>
                                Assign Categories
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {categories.map((category) => {
                                const isChecked = product.categories?.some(
                                  (pc) => pc.category.id === category.id
                                );
                                return (
                                  <DropdownMenuCheckboxItem
                                    key={category.id}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentCategoryIds =
                                        product.categories?.map(
                                          (pc) => pc.category.id
                                        ) || [];

                                      const newCategoryIds = checked
                                        ? [...currentCategoryIds, category.id]
                                        : currentCategoryIds.filter(
                                            (id) => id !== category.id
                                          );

                                      updateProductCategories(
                                        product.id,
                                        newCategoryIds
                                      );
                                    }}
                                  >
                                    {category.name}
                                  </DropdownMenuCheckboxItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {product.sku || (
                            <span className="text-muted-foreground italic">
                              No SKU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div>
                          {product.compare_price_cents &&
                            product.compare_price_cents > minPrice * 100 && (
                              <span className="text-xs text-muted-foreground line-through block">
                                $
                                {(product.compare_price_cents / 100).toFixed(2)}
                              </span>
                            )}
                          <div className="font-medium">
                            ${minPrice.toFixed(2)}
                            {hasVariants && product.variants.length > 1 && (
                              <span className="text-xs text-muted-foreground block">
                                {(() => {
                                  const prices = product.variants.map(
                                    (v) => v.price_cents / 100
                                  );
                                  const maxPrice = Math.max(...prices);
                                  return minPrice !== maxPrice
                                    ? `- $${maxPrice.toFixed(2)}`
                                    : "";
                                })()}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div>
                          <span className={`font-medium ${stockDisplay.color}`}>
                            {stockDisplay.value}
                          </span>
                          {stockDisplay.label && (
                            <span className="text-xs text-muted-foreground block">
                              {stockDisplay.label}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() =>
                              toggleFeatured(product.id, product.is_featured)
                            }
                            className="p-1 hover:scale-110 transition-transform"
                            title={
                              product.is_featured
                                ? "Remove from featured"
                                : "Add to featured"
                            }
                          >
                            <Star
                              className={`h-5 w-5 ${
                                product.is_featured
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                          {!product.allow_purchases && (
                            <Badge variant="outline" className="text-xs">
                              No purchases
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/${product.slug}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasVariants && (
                      <tr
                        key={`${product.id}-variants`}
                        className="bg-muted/20"
                      >
                        <td colSpan={7} className="p-0">
                          <div className="px-8 py-3 border-b">
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-muted-foreground">
                                  <th className="text-left pb-2">SKU</th>
                                  <th className="text-left pb-2">Options</th>
                                  <th className="text-right pb-2">Price</th>
                                  <th className="text-right pb-2">Stock</th>
                                  <th className="text-center pb-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants.map((variant) => (
                                  <tr key={variant.id} className="text-sm">
                                    <td className="py-1">
                                      {variant.sku || "N/A"}
                                    </td>
                                    <td className="py-1">
                                      {variant.option_values ? (
                                        <div className="flex gap-1">
                                          {Object.entries(
                                            variant.option_values
                                          ).map(([key, value]) => (
                                            <Badge
                                              key={key}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {key}: {value as string}
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          Default
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-1 text-right">
                                      ${(variant.price_cents / 100).toFixed(2)}
                                    </td>
                                    <td className="py-1 text-right">
                                      <span
                                        className={
                                          variant.stock > 0
                                            ? ""
                                            : "text-red-500"
                                        }
                                      >
                                        {variant.stock || 0}
                                      </span>
                                    </td>
                                    <td className="py-1 text-center">
                                      <Badge
                                        variant={
                                          variant.is_active
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {variant.is_active
                                          ? "Active"
                                          : "Inactive"}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
            of {total} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={pageNum === page ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
