import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboardServer } from '@/components/admin/admin-dashboard-server'

export default async function AdminPage() {
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
    <main className="min-h-screen">
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your store</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdminDashboardServer />
      </div>
    </main>
  )
}