import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { MediaManagerPage } from './media-manager-page'

export default async function MediaPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      {/* Full-width media page */}
      <div className="lg:pl-64 w-full">
        <div className="w-full h-screen">
          <MediaManagerPage />
        </div>
      </div>
    </div>
  )
}