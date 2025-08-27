import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsManager } from "./products-manager";
import { HelpLink } from '@/components/admin/help-link';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!userData?.is_admin) {
    redirect("/");
  }

  // Fetch ALL products (including inactive) with comprehensive data
  const { data: products, count } = await supabase
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
      brand:brands(id, name, slug)
    `,
      { count: "exact" }
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);
  
  // Get images via media_usage for all products
  let productsWithImages = products || [];
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
          alt_text,
          title
        )
      `)
      .eq('entity_type', 'product')
      .in('entity_id', productIds)
      .order('field_name');
    
    // Group images by product
    interface ProductImage {
      image_filename: string
      alt_text: string | null
      is_primary: boolean
    }
    
    const imagesByProduct: Record<string, ProductImage[]> = {};
    
    (mediaUsageData || []).forEach(usage => {
      if (!usage.media) return;
      
      const productId = usage.entity_id;
      if (!imagesByProduct[productId]) {
        imagesByProduct[productId] = [];
      }
      
      imagesByProduct[productId].push({
        image_filename: usage.media.file_url,
        alt_text: usage.media.alt_text,
        is_primary: usage.field_name === 'primary_image'
      });
    });
    
    // Attach images to products
    productsWithImages = productsWithImages.map(product => ({
      ...product,
      images: imagesByProduct[product.id] || []
    }));
  }

  // Get all categories for filtering
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("deleted_at", null)
    .order("name");

  // Get all brands for filtering
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .is("deleted_at", null)
    .order("name");

  // Get last sync status
  const { data: lastSync } = await supabase
    .from("sync_logs")
    .select("*")
    .eq("sync_type", "products")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <HelpLink />
        </div>
        <div className="text-sm text-muted-foreground">
          {lastSync && (
            <span>
              Last PayPal sync: {new Date(lastSync.created_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <ProductsManager
        initialProducts={productsWithImages || []}
        initialTotal={count || 0}
        categories={categories || []}
        brands={brands || []}
        lastSync={lastSync}
      />
    </div>
  );
}
