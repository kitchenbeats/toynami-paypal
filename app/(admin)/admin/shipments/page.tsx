import { Suspense } from 'react'
import { ShipmentsManager } from './shipments-manager'
import { createClient } from '@/lib/supabase/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'
import { HelpLink } from '@/components/admin/help-link'

export default async function ShipmentsPage() {
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

  // Fetch orders from ShipStation API
  let shipstationOrders: any[] = []
  let totalCount = 0
  let shipstationConnected = false
  let warehouses: any[] = []
  let tags: any[] = []
  let carriers: any[] = []
  let stores: any[] = []
  
  try {
    const client = getShipStationV1Client()
    
    // Get orders and configuration from ShipStation
    const [ordersRes, warehousesRes, tagsRes, carriersRes, storesRes] = await Promise.all([
      client.getOrders({
        sortBy: 'OrderDate',
        sortDir: 'DESC',
        pageSize: 100,
        storeId: parseInt(process.env.SHIPSTATION_STORE_ID || '0')
      }),
      client.listWarehouses(),
      client.listTags(),
      client.getCarriers(),
      client.listStores()
    ])
    
    if (ordersRes.success) {
      shipstationConnected = true
      shipstationOrders = ordersRes.data?.orders || []
      totalCount = ordersRes.data?.total || 0
    }
    
    if (warehousesRes.success) {
      warehouses = warehousesRes.data || []
    }
    
    if (tagsRes.success) {
      tags = tagsRes.data || []
    }
    
    if (carriersRes.success) {
      carriers = carriersRes.data || []
    }

    if (storesRes.success) {
      stores = storesRes.data || []
    }
  } catch (error) {
    console.log('ShipStation not configured or unavailable:', error)
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">ShipStation Shipments</h1>
          <HelpLink />
        </div>
        <p className="text-muted-foreground mt-2">
          Manage shipping labels, track packages, and fulfill orders from ShipStation
        </p>
      </div>

      {!shipstationConnected ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ShipStation is not configured. Please add your ShipStation API credentials to environment variables.
          </p>
        </div>
      ) : (
        <Suspense fallback={<div>Loading shipments...</div>}>
          <ShipmentsManager 
            initialOrders={shipstationOrders}
            totalCount={totalCount}
            warehouses={warehouses}
            tags={tags}
            carriers={carriers}
            stores={stores}
          />
        </Suspense>
      )}
    </>
  )
}