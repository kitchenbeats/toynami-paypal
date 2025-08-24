import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddProductForm } from './add-product-form'

export default async function AddProductPage() {
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
  
  // Get categories and brands for dropdowns
  const [categoriesResult, brandsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .is('deleted_at', null)
      .order('name'),
    supabase
      .from('brands')
      .select('id, name, slug')
      .is('deleted_at', null)
      .order('name')
  ])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        <AddProductForm 
          categories={categoriesResult.data || []}
          brands={brandsResult.data || []}
        />
      </div>
    </div>
  )
}