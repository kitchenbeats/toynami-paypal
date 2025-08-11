import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CustomerGroupsManager } from './customer-groups-manager'

export default async function AdminCustomerGroupsPage() {
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
  
  // Fetch all customer groups
  const { data: groups } = await supabase
    .from('customer_groups')
    .select('*')
    .order('priority', { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Customer Groups</h1>
        <CustomerGroupsManager initialGroups={groups || []} />
      </div>
    </div>
  )
}