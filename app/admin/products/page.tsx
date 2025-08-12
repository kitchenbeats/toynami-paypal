import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductsManager } from './products-manager'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!userData?.is_admin) {
    redirect('/')
  }
  
  // Fetch ALL products (including inactive) with comprehensive data
  const { data: products, count } = await supabase
    .from('products')
    .select(`
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
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)
  
  // Get all categories for filtering
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .is('deleted_at', null)
    .order('name')
  
  // Get all brands for filtering
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug')
    .is('deleted_at', null)
    .order('name')
  
  // Get last sync status
  const { data: lastSync } = await supabase
    .from('sync_logs')
    .select('*')
    .eq('sync_type', 'products')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div className="text-sm text-muted-foreground">
            {lastSync && (
              <span>
                Last PayPal sync: {new Date(lastSync.created_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <ProductsManager 
          initialProducts={products || []} 
          initialTotal={count || 0}
          categories={categories || []}
          brands={brands || []}
          lastSync={lastSync}
        />
      </div>
    </div>
  )
}