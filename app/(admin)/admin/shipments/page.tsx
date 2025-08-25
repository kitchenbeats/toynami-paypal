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
  let shipstationOrders: Array<{
    id: string
    orderNumber: string
    orderDate: string
    orderStatus: string
    shipTo: { name: string; city: string; state: string }
    orderTotal: number
    items?: Array<{ name: string; quantity: number }>
  }> = []
  let totalCount = 0
  let shipstationConnected = false
  let warehouses: Array<{
    warehouseId: string
    warehouseName: string
    isDefault: boolean
  }> = []
  let tags: Array<{
    tagId: number
    name: string
    color: string
  }> = []
  let carriers: Array<{
    code: string
    name: string
    accountNumber?: string
    requiresFundedAccount: boolean
    balance?: number
  }> = []
  let stores: Array<{
    storeId: number
    storeName: string
    marketplaceId: number
    marketplaceName: string
    accountName?: string
    createDate: string
    modifyDate: string
    storeStatus: string
    active: boolean
    refreshDate?: string
    lastRefreshAttempt?: string
    autoRefresh: boolean
  }> = []
  
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
      console.error('Error in catch block:', error)
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