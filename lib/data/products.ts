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
  option_values?: Record<string, string | number | boolean>;
}

export interface ProductImage {
  id: string;
  filename: string;
  file_url: string;
  alt_text?: string;
  title?: string;
  position?: number;
  is_primary?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

// Helper function to get images for products via media_usage
async function getProductImages(productIds: string[]): Promise<Record<string, ProductImage[]>> {
  if (productIds.length === 0) return {};
  
  const supabase = await createClient();
  
  const { data: usageData, error } = await supabase
    .from('media_usage')
    .select(`
      entity_id,
      field_name,
      media:media_library (
        id,
        filename,
        file_url,
        alt_text,
        title,
        sort_order
      )
    `)
    .eq('entity_type', 'product')
    .in('entity_id', productIds)
    .order('field_name', { ascending: true });

  if (error) {
    console.error('Error fetching product images:', error);
    return {};
  }

  // Group images by product ID
  const imagesByProduct: Record<string, ProductImage[]> = {};
  
  (usageData || []).forEach(usage => {
    if (!usage.media) return;
    
    const productId = usage.entity_id;
    if (!imagesByProduct[productId]) {
      imagesByProduct[productId] = [];
    }
    
    imagesByProduct[productId].push({
      id: usage.media.id,
      filename: usage.media.filename,
      file_url: usage.media.file_url,
      alt_text: usage.media.alt_text,
      title: usage.media.title,
      position: usage.media.sort_order || 0,
      is_primary: usage.field_name === 'primary_image'
    });
  });
  
  // Sort images by position
  Object.values(imagesByProduct).forEach(images => {
    images.sort((a, b) => (a.position || 0) - (b.position || 0));
  });
  
  return imagesByProduct;
}

export async function getFeaturedProducts(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _position: "homepage" | "category" | "brand" = "homepage",
  limit: number = 4
) {
  const supabase = await createClient();
  // const now = new Date().toISOString();

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
  // Get all product IDs that need group checking
  const productsNeedingGroupCheck = (data as Product[]).filter(
    product => product.is_visible && 
    product.status === "active" && 
    product.visibility_type === "groups"
  );
  
  // Batch fetch all group permissions in one query
  const groupPermissions: Record<string, boolean> = {};
  if (productsNeedingGroupCheck.length > 0 && groupIds.length > 0) {
    const productIds = productsNeedingGroupCheck.map(p => p.id);
    
    const { data: productGroups } = await supabase
      .from("product_customer_groups")
      .select("product_id, can_view")
      .in("product_id", productIds)
      .in("group_id", groupIds)
      .eq("can_view", true);
    
    // Create a map for O(1) lookup
    if (productGroups) {
      productGroups.forEach(pg => {
        groupPermissions[pg.product_id] = true;
      });
    }
  }
  
  // Filter products based on visibility rules
  const visibleProducts = [];
  for (const product of data as Product[]) {
    // Check basic visibility
    if (!product.is_visible || product.status !== "active") continue;
    
    // Check customer group visibility
    if (product.visibility_type === "private") continue;
    if (product.visibility_type === "groups") {
      if (groupIds.length === 0 || !groupPermissions[product.id]) continue;
    }
    
    visibleProducts.push(product);
    if (visibleProducts.length >= limit) break;
  }
  
  // Get images for all visible products
  if (visibleProducts.length > 0) {
    const productIds = visibleProducts.map(p => p.id);
    const imagesByProduct = await getProductImages(productIds);
    
    // Attach images to products
    visibleProducts.forEach(product => {
      product.images = imagesByProduct[product.id] || [];
    });
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

  const product = data as Product;
  if (product) {
    // Get images for this product
    const imagesByProduct = await getProductImages([product.id]);
    product.images = imagesByProduct[product.id] || [];
  }
  
  return product;
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

  const products = data as Product[];
  
  // Get images for all products
  if (products.length > 0) {
    const productIds = products.map(p => p.id);
    const imagesByProduct = await getProductImages(productIds);
    
    // Attach images to products
    products.forEach(product => {
      product.images = imagesByProduct[product.id] || [];
    });
  }

  return products;
}

export async function getProductsByBrand(brand: string, limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*)
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

  const products = data as Product[];
  
  // Get images for all products
  if (products.length > 0) {
    const productIds = products.map(p => p.id);
    const imagesByProduct = await getProductImages(productIds);
    
    // Attach images to products
    products.forEach(product => {
      product.images = imagesByProduct[product.id] || [];
    });
  }

  return products;
}
