import { createClient } from "../supabase/server";
import { getUserCustomerGroups } from "./customer-groups";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  brand?: string;
  sku?: string;
  status: 'active' | 'draft' | 'archived';
  is_featured: boolean;
  is_visible: boolean;
  is_new?: boolean;
  sort_order: number;
  price_cents?: number;
  compare_at_price_cents?: number;
  stock_level?: number;
  track_inventory?: boolean;
  allow_purchases?: boolean;
  min_purchase_quantity?: number;
  max_purchase_quantity?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  categories?: Category[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price_cents: number;
  compare_at_price_cents?: number;
  stock: number;
  is_active: boolean;
  option_values?: any;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_filename: string;
  alt_text?: string;
  position?: number;
  is_primary: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

// FeaturedProduct interface removed - we now use products.is_featured directly

export async function getFeaturedProducts(
  position: "homepage" | "category" | "brand" = "homepage",
  limit: number = 4
) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Get user's customer groups for filtering
  const userGroups = await getUserCustomerGroups();
  const groupIds = userGroups.map((g) => g.id);

  // Now using products.is_featured directly instead of featured_products table
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*),
      visibility_type,
      purchasability_type
    `
    )
    .eq("is_featured", true)
    .eq("is_visible", true)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit * 2); // Get extra in case some are filtered out

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  // Filter by product visibility and customer groups
  const visibleProducts = [];
  for (const product of data as any[]) {
    // Check basic visibility (already filtered in query, but double-check)
    if (!product.is_visible || product.status !== "active") continue;

    // Check customer group visibility
    if (product.visibility_type === "private") continue;
    if (product.visibility_type === "groups" && groupIds.length > 0) {
      // Check if user's groups can view this product
      const { data: productGroups } = await supabase
        .from("product_customer_groups")
        .select("can_view")
        .eq("product_id", product.id)
        .in("group_id", groupIds)
        .eq("can_view", true)
        .limit(1);

      if (!productGroups || productGroups.length === 0) continue;
    }

    visibleProducts.push(product);
    if (visibleProducts.length >= limit) break;
  }

  return visibleProducts;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*),
      categories:product_categories (
        category:categories (*)
      )
    `
    )
    .eq("slug", slug)
    .eq("is_visible", true)
    .eq("status", "active")
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as any;
}

export async function getProductsByCategory(
  categorySlug: string,
  limit?: number
) {
  const supabase = await createClient();

  // First get the category
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  let query = supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*),
      categories:product_categories!inner (
        category_id
      )
    `
    )
    .eq("product_categories.category_id", category.id)
    .eq("is_visible", true)
    .eq("status", "active")
    .is("deleted_at", null);

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return data as any[];
}

export async function getProductsByBrand(brand: string, limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*)
    `
    )
    .eq("brand", brand)
    .eq("is_visible", true)
    .eq("status", "active")
    .is("deleted_at", null);

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products by brand:", error);
    return [];
  }

  return data as any[];
}
