import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ShipmentDetailManager } from './shipment-detail-manager'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check auth
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

  // Get shipment directly from ShipStation
  try {
    const shipstation = getShipStationV1Client()
    const response = await shipstation.getOrderById(id)
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch shipment:', response.error)
      redirect('/admin/shipments')
    }
    
    return <ShipmentDetailManager shipment={response.data} />
  } catch (error) {
    console.error('Error loading shipment:', error)
    redirect('/admin/shipments')
  }
}