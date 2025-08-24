import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MailchimpManager } from './mailchimp-manager'

export default async function AdminEmailPage() {
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
  
  // Get current settings
  const { data: settings } = await supabase
    .from('mailchimp_settings')
    .select('*')
    .single()
  
  // Get sync stats
  const { data: syncStats } = await supabase
    .from('mailchimp_sync_status')
    .select('sync_status')
  
  const stats = {
    totalSynced: syncStats?.filter(s => s.sync_status === 'synced').length || 0,
    pending: syncStats?.filter(s => s.sync_status === 'pending').length || 0,
    failed: syncStats?.filter(s => s.sync_status === 'failed').length || 0
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email Marketing</h1>
        <MailchimpManager initialSettings={settings} stats={stats} />
      </div>
    </div>
  )
}