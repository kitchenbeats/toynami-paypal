import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GlobalOptionsManager } from './global-options-manager'

export default async function AdminGlobalOptionsPage() {
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
  
  // Fetch global option types with their values
  const { data: optionTypes } = await supabase
    .from('global_option_types')
    .select(`
      *,
      values:global_option_values(*)
    `)
    .order('display_order', { ascending: true })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Global Product Options</h1>
        <p className="text-muted-foreground mb-6">
          Manage reusable option types (Size, Color, Material) that can be assigned to products.
        </p>
        <GlobalOptionsManager initialOptionTypes={optionTypes || []} />
      </div>
    </div>
  )
}