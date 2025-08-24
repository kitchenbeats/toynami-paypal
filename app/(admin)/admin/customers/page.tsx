import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CustomersManager } from './customers-manager'

export default async function AdminCustomersPage() {
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
  
  // Fetch all customers with their order count
  const { data: customers } = await supabase
    .from('users')
    .select(`
      id,
      email,
      full_name,
      phone,
      is_admin,
      created_at,
      updated_at,
      last_sign_in_at,
      email_confirmed_at
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Customer Management</h1>
        <CustomersManager initialCustomers={customers || []} />
      </div>
    </div>
  )
}