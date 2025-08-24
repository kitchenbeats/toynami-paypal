import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BrandsManager } from './brands-manager'

export default async function AdminBrandsPage() {
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
  
  // Fetch all brands
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('display_order', { ascending: true })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Brands</h1>
        <BrandsManager initialBrands={brands || []} />
      </div>
    </div>
  )
}