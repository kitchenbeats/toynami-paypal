import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductsManager } from './products-manager'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/signin')
  }
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!userData?.is_admin) {
    redirect('/')
  }
  
  // Fetch products with all necessary fields for management
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      sku,
      status,
      is_featured,
      is_visible,
      is_new,
      sort_order,
      price_cents,
      stock_level,
      created_at,
      variants:product_variants(count),
      images:product_images(count),
      categories:product_categories(
        category:categories(name, slug)
      )
    `)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(100)
  
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
          lastSync={lastSync}
        />
      </div>
    </div>
  )
}