import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BannersManagerImproved } from './banners-manager-improved'

export default async function AdminBannersPage() {
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
  
  // Fetch all banners grouped by position
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true })
    .order('slot_number', { ascending: true })
  
  return <BannersManagerImproved initialBanners={banners || []} />
}