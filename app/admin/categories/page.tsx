import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CategoriesManager } from './categories-manager'

export default async function AdminCategoriesPage() {
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
  
  // Fetch all categories with parent info
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      parent:parent_id(name)
    `)
    .order('display_order', { ascending: true })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
        <CategoriesManager initialCategories={categories || []} />
      </div>
    </div>
  )
}