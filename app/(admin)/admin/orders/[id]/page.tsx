import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderDetailManager } from './order-detail-manager'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'

interface PageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: PageProps) {
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

  // Fetch order details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      user:users(id, email, full_name, phone),
      order_items(
        id,
        product_id,
        variant_id,
        quantity,
        price_cents,
        product:products(id, name, slug, sku, weight),
        variant:product_variants(id, name, sku, weight)
      ),
      shipstation_sync_logs(
        id,
        action,
        success,
        error_message,
        created_at
      ),
      shipstation_labels(
        id,
        shipment_id,
        carrier_code,
        service_code,
        tracking_number,
        label_url,
        shipping_cost,
        voided,
        created_at
      )
    `)
    .eq('id', params.id)
    .single()

  if (!order) {
    notFound()
  }

  // Try to fetch ShipStation data if connected
  let shipstationOrder = null
  let shipstationShipments = []
  let carriers = []
  let warehouses = []
  let tags = []
  
  if (order.shipstation_order_id) {
    try {
      const client = getShipStationV1Client()
      
      // Fetch order from ShipStation
      const orderRes = await client.getOrderById(order.shipstation_order_id)
      if (orderRes.success) {
        shipstationOrder = orderRes.data
      }
      
      // Fetch shipments for this order
      const shipmentsRes = await client.listShipments({
        orderId: order.shipstation_order_id
      })
      if (shipmentsRes.success) {
        shipstationShipments = shipmentsRes.data?.shipments || []
      }
      
      // Fetch available carriers, warehouses, and tags for actions
      const [carriersRes, warehousesRes, tagsRes] = await Promise.all([
        client.getCarriers(),
        client.listWarehouses(),
        client.listTags()
      ])
      
      carriers = carriersRes.data || []
      warehouses = warehousesRes.data || []
      tags = tagsRes.data || []
      
    } catch (error) {
      console.error('Failed to fetch ShipStation data:', error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <OrderDetailManager
        order={order}
        shipstationOrder={shipstationOrder}
        shipstationShipments={shipstationShipments}
        carriers={carriers}
        warehouses={warehouses}
        tags={tags}
      />
    </div>
  )
}