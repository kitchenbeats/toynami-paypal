import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "./product-edit-form";

export default async function ProductEditPage({
  params: p,
}: {
  params: { id: string };
}) {
  const params = await p;
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

  const productId = parseInt(params.id);

  // Fetch complete product data with all relationships
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants(*),
      images:product_images(*),
      categories:product_categories(
        category:categories(*)
      ),
      brand:brands(*),
      customer_groups:product_customer_groups(
        group:customer_groups(*)
      ),
      option_assignments:product_option_assignments(
        option_type:global_option_types(
          *,
          values:global_option_values(*)
        )
      )
    `
    )
    .eq("id", productId)
    .single();

  if (!product) {
    redirect("/admin/products");
  }

  // Fetch all categories for selection
  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("name");

  // Fetch all brands for selection
  const { data: allBrands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");

  // Fetch all customer groups
  const { data: allCustomerGroups } = await supabase
    .from("customer_groups")
    .select("*")
    .eq("is_active", true)
    .order("priority");

  // Fetch all global option types
  const { data: allOptionTypes } = await supabase
    .from("global_option_types")
    .select(
      `
      *,
      values:global_option_values(*)
    `
    )
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="min-h-screen">
      <div className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-2">Product ID: {productId}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProductEditForm
          product={product}
          categories={allCategories || []}
          brands={allBrands || []}
          customerGroups={allCustomerGroups || []}
          optionTypes={allOptionTypes || []}
        />
      </div>
    </main>
  );
}
