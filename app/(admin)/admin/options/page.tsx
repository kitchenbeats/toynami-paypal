import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SimpleOptionsManager } from './simple-options-manager'
import { HelpLink } from '@/components/admin/help-link'

export default async function AdminGlobalOptionsPage() {
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
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-3xl font-bold">Global Product Options</h1>
          <HelpLink />
        </div>
        <p className="text-muted-foreground mb-6">
          Create reusable options like Size and Color that can be applied to products.
        </p>
        <SimpleOptionsManager 
          initialOptions={optionTypes?.map(type => ({
            id: type.id,
            display_name: type.display_name,
            option_name: type.name,
            type: type.input_type === 'dropdown' ? 'dropdown' :
                  type.input_type === 'radio' ? 'radio' :
                  type.input_type === 'color' || type.input_type === 'swatches' ? 'swatches' : 'buttons',
            values: type.values?.map(v => ({
              id: v.id,
              value: v.value,
              label: v.display_name,
              sku_suffix: v.sku_suffix || '',
              is_default: v.is_default
            })) || [],
            is_active: type.is_active
          })) || []}
        />
      </div>
    </div>
  )
}