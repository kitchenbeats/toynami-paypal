"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Package,
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  ShoppingCart,
  Edit,
  Trash2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  is_visible: boolean;
  status: string;
  allow_purchases: boolean;
  created_at: string;
  updated_at: string;
  variants: any[];
  categories: any[];
  images: any[];
  brand: any;
}

interface ProductsManagerProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: any[];
  brands: any[];
  lastSync: any;
}

export function ProductsManager({
  initialProducts,
  initialTotal,
  categories,
  brands,
  lastSync,
}: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(
    new Set()
  );
  const supabase = createClient();
  const limit = 50;

  const fetchProducts = async (
    newPage: number,
    categoryFilters: string[] = [],
    brandFilters: string[] = [],
    status: string = "all",
    visibility: string = "all",
    search: string = ""
  ) => {
    setLoading(true);
    const offset = (newPage - 1) * limit;

    // First, get product IDs that match category filters
    let categoryProductIds: number[] | null = null;

    if (categoryFilters.length > 0) {
      const { data: categoryProducts } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryFilters);

      if (categoryProducts && categoryProducts.length > 0) {
        categoryProductIds = [...new Set(categoryProducts.map((cp) => cp.product_id))];
      } else {
        // No products in selected categories
        setProducts([]);
        setTotal(0);
        setLoading(false);
        return;
      }
    }

    // Build the query
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
        is_visible,
        status,
        allow_purchases,
        created_at,
        updated_at,
        variants:product_variants(id, sku, price_cents, stock, is_active, option_values),
        categories:product_categories(
          category:categories(id, name, slug)
        ),
        images:product_images(
          image_filename,
          alt_text,
          is_primary
        ),
        brand:brands(id, name, slug)
      `,
        { count: "exact" }
      )
      .is("deleted_at", null);

    // Apply filters
    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (visibility === "visible") {
      query = query.eq("is_visible", true);
    } else if (visibility === "hidden") {
      query = query.eq("is_visible", false);
    }

    // Apply search
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // Apply brand filter
    if (brandFilters.length > 0) {
      query = query.in("brand_id", brandFilters);
    }

    // Apply product ID filter if categories were selected
    if (categoryProductIds) {
      query = query.in("id", categoryProductIds);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count } = await query;

    if (data) {
      setProducts(data);
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
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_featured: !currentValue } : p
        )
      );
    }
  };

  const toggleVisibility = async (productId: number, currentValue: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_visible: !currentValue })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update visibility");
    } else {
      toast.success(`Product ${!currentValue ? 'shown' : 'hidden'}`);
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_visible: !currentValue } : p
        )
      );
    }
  };

  const togglePurchases = async (productId: number, currentValue: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ allow_purchases: !currentValue })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update purchase status");
    } else {
      toast.success(`Purchases ${!currentValue ? 'enabled' : 'disabled'}`);
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, allow_purchases: !currentValue } : p
        )
      );
    }
  };

  const updateProductStatus = async (productId: number, newStatus: string) => {
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Status changed to ${newStatus}`);
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, status: newStatus } : p
        )
      );
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product? This will soft-delete it.")) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      setProducts(products.filter(p => p.id !== productId));
      setTotal(total - 1);
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
        fetchProducts(page, selectedCategories, selectedBrands, statusFilter, visibilityFilter, searchQuery);
      }
    } else {
      toast.success("Categories updated");
      fetchProducts(page, selectedCategories, statusFilter, visibilityFilter, searchQuery);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1, selectedCategories, selectedBrands, statusFilter, visibilityFilter, searchQuery);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((c) => c !== categoryId);

    setSelectedCategories(newCategories);
    setPage(1);
    fetchProducts(1, newCategories, selectedBrands, statusFilter, visibilityFilter, searchQuery);
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((b) => b !== brandId);

    setSelectedBrands(newBrands);
    setPage(1);
    fetchProducts(1, selectedCategories, newBrands, statusFilter, visibilityFilter, searchQuery);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchProducts(1, selectedCategories, selectedBrands, newStatus, visibilityFilter, searchQuery);
  };

  const handleVisibilityChange = (newVisibility: string) => {
    setVisibilityFilter(newVisibility);
    setPage(1);
    fetchProducts(1, selectedCategories, selectedBrands, statusFilter, newVisibility, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage, selectedCategories, selectedBrands, statusFilter, visibilityFilter, searchQuery);
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
    const image = product.images?.find(img => img.is_primary) || product.images?.[0];
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
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={handleVisibilityChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Categories ({selectedCategories.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Brands ({selectedBrands.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {brands.map((brand) => (
                <DropdownMenuCheckboxItem
                  key={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) =>
                    handleBrandChange(brand.id, checked)
                  }
                >
                  {brand.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} of {total} total products
      </div>

      {/* Products Table */}
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
              <th className="text-center p-3">Visibility</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
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
                      ...product.variants.map((v: any) => v.price_cents)
                    ) / 100
                  : product.base_price_cents
                  ? product.base_price_cents / 100
                  : 0;

                // Smart stock calculation
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
                    (sum: number, v: any) => sum + (v.stock || 0),
                    0
                  );
                  const activeVariants = product.variants.filter(
                    (v: any) => v.is_active
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
                  // Fallback
                  const totalStock = hasVariants
                    ? product.variants.reduce(
                        (sum: number, v: any) => sum + (v.stock || 0),
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
                                alt={product.name}
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
                                        .map((pc: any) => (
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
                                  (pc: any) => pc.category.id === category.id
                                );
                                return (
                                  <DropdownMenuCheckboxItem
                                    key={category.id}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentCategoryIds =
                                        product.categories?.map(
                                          (pc: any) => pc.category.id
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
                                    (v: any) => v.price_cents / 100
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
                        <Select
                          value={product.status}
                          onValueChange={(value) => updateProductStatus(product.id, value)}
                        >
                          <SelectTrigger className="w-[100px] mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <Badge className="bg-green-500">Active</Badge>
                            </SelectItem>
                            <SelectItem value="draft">
                              <Badge variant="secondary">Draft</Badge>
                            </SelectItem>
                            <SelectItem value="archived">
                              <Badge variant="outline">Archived</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                toggleVisibility(product.id, product.is_visible)
                              }
                              className="p-1 hover:scale-110 transition-transform"
                              title={product.is_visible ? "Hide product" : "Show product"}
                            >
                              {product.is_visible ? (
                                <Eye className="h-5 w-5 text-green-600" />
                              ) : (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                togglePurchases(product.id, product.allow_purchases)
                              }
                              className="p-1 hover:scale-110 transition-transform"
                              title={product.allow_purchases ? "Disable purchases" : "Enable purchases"}
                            >
                              <ShoppingCart
                                className={`h-5 w-5 ${
                                  product.allow_purchases
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
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
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasVariants && (
                      <tr
                        key={`${product.id}-variants`}
                        className="bg-muted/20"
                      >
                        <td colSpan={8} className="p-0">
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
                                {product.variants.map((variant: any) => (
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

      {/* Pagination */}
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