import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EnhancedProductsManager } from '@/components/admin/enhanced-products-manager'

interface SearchParams {
  page?: string
  search?: string
  status?: string
  category?: string
  brand?: string
}

export default async function EnhancedAdminProductsPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
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
  
  // Parse query params
  const currentPage = parseInt(searchParams.page || '1')
  const pageSize = 20
  const offset = (currentPage - 1) * pageSize
  
  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands!brand_id(*),
      categories:product_categories(
        category_id,
        category:categories(*)
      ),
      variants:product_variants(*),
      images:product_images(*),
      options:product_options(
        option_id,
        option:global_options(*)
      )
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)
  
  // Apply filters
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,sku.ilike.%${searchParams.search}%,slug.ilike.%${searchParams.search}%`)
  }
  
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }
  
  if (searchParams.brand && searchParams.brand !== 'all') {
    query = query.eq('brand_id', searchParams.brand)
  }
  
  const { data: products, count } = await query
  
  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_visible', true)
    .is('deleted_at', null)
    .order('display_order')
  
  // Fetch brands
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  // Fetch global options
  const { data: globalOptions } = await supabase
    .from('global_options')
    .select(`
      *,
      values:global_option_values(*)
    `)
    .eq('is_active', true)
    .order('display_order')
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Enhanced Product Management</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive product catalog management with variants, images, and PayPal sync
          </p>
        </div>
        
        <EnhancedProductsManager 
          initialProducts={products || []}
          categories={categories || []}
          brands={brands || []}
          globalOptions={globalOptions || []}
          totalCount={count || 0}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}