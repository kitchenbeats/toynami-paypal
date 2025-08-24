import { Suspense } from 'react'
import { OrdersManager } from './orders-manager'
import { createClient } from '@/lib/supabase/server'
import { HelpLink } from '@/components/admin/help-link'

export default async function OrdersPage() {
  const supabase = await createClient()
  
  // Check admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div>Unauthorized</div>
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return <div>Unauthorized - Admin access required</div>
  }

  // Fetch shop orders from database
  const { data: orders, count } = await supabase
    .from('orders')
    .select(`
      *,
      user:users(email, full_name),
      order_items(
        id,
        product_id,
        variant_id,
        quantity,
        price_cents,
        product:products(name, slug),
        variant:product_variants(name, sku)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Shop Orders</h1>
          <HelpLink />
        </div>
        <p className="text-muted-foreground mt-2">
          View and manage customer orders from your store
        </p>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersManager 
          initialOrders={orders || []}
          totalCount={count || 0}
        />
      </Suspense>
    </>
  )
}