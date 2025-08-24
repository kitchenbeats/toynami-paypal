import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'
import { ShipStationManager } from './shipstation-manager'

export default async function ShipStationSettingsPage() {
  const supabase = await createClient()
  
  // Check admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div>Unauthorized</div>
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return <div>Unauthorized - Admin access required</div>
  }

  // Get current configuration
  const blockedStores = process.env.SHIPSTATION_BLOCKED_STORES?.split(',').map(id => id.trim()) || []
  const currentStoreId = process.env.SHIPSTATION_STORE_ID || null

  // Try to fetch stores from ShipStation
  let stores: any[] = []
  let connected = false
  
  try {
    const client = getShipStationV1Client()
    const response = await client.makeRequest('/stores')
    
    if (response.success) {
      connected = true
      stores = response.data || []
    }
  } catch (error) {
    console.log('ShipStation not connected:', error)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ShipStation Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage ShipStation integration and store configuration
        </p>
      </div>

      <ShipStationManager
        stores={stores}
        blockedStores={blockedStores}
        currentStoreId={currentStoreId}
        connected={connected}
      />
    </div>
  )
}