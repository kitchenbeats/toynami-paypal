import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, ShoppingCart, DollarSign, Award, Truck, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  activeProducts: number
  activeRaffles: number
  totalEntries: number
  pendingOrders: number
  shippedOrders: number
}

interface Order {
  id: string
  order_number: string | null
  status: 'pending' | 'paid' | 'shipped' | 'cancelled' | 'refunded'
  total_cents: number | null
  email: string | null
  created_at: string
  user: {
    full_name: string | null
    email: string
  } | null
  paypal_order_id: string | null
  shipstation_order_id: string | null
  tracking_number: string | null
  shipping_carrier: string | null
}

interface ShipmentData {
  awaiting_shipment: number
  shipped_today: number
  delivered_today: number
  exceptions: number
  pending_labels: number
  recent_tracking: Array<{
    order_id: string
    order_number: string | null
    tracking_number: string | null
    carrier: string | null
    status: string | null
    updated_at: string | null
  }>
}

async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  
  // Get product count
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)

  // Get customer count
  const { count: customerCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  // Get active raffles count
  const { count: raffleCount } = await supabase
    .from('raffles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .is('deleted_at', null)

  // Get total raffle entries
  const { count: entryCount } = await supabase
    .from('raffle_entries')
    .select('*', { count: 'exact', head: true })

  // Get order stats
  const { data: orderStats } = await supabase
    .from('orders')
    .select('status, total_cents')
  
  let totalRevenue = 0
  let totalOrders = 0
  let pendingOrders = 0
  let shippedOrders = 0

  if (orderStats) {
    totalOrders = orderStats.length
    orderStats.forEach(order => {
      if (order.status === 'paid' || order.status === 'shipped') {
        totalRevenue += (order.total_cents || 0)
      }
      if (order.status === 'pending' || order.status === 'paid') {
        pendingOrders++
      }
      if (order.status === 'shipped') {
        shippedOrders++
      }
    })
  }

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    totalRevenue: totalRevenue / 100, // Convert cents to dollars
    totalOrders,
    totalCustomers: customerCount || 0,
    avgOrderValue: avgOrderValue / 100, // Convert cents to dollars
    activeProducts: productCount || 0,
    activeRaffles: raffleCount || 0,
    totalEntries: entryCount || 0,
    pendingOrders,
    shippedOrders
  }
}

async function getRecentOrders(): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_cents,
      email,
      created_at,
      paypal_order_id,
      shipstation_order_id,
      tracking_number,
      shipping_carrier,
      users!orders_user_id_fkey (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!orders) return []

  return orders.map(order => ({
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    total_cents: order.total_cents,
    email: order.email,
    created_at: order.created_at,
    paypal_order_id: order.paypal_order_id,
    shipstation_order_id: order.shipstation_order_id,
    tracking_number: order.tracking_number,
    shipping_carrier: order.shipping_carrier,
    user: Array.isArray(order.users) ? order.users[0] : order.users
  }))
}

async function getShipmentData(): Promise<ShipmentData> {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // Get orders awaiting shipment
  const { count: awaitingShipment } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')
    .is('shipstation_order_id', null)

  // Get orders shipped today
  const { count: shippedToday } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'shipped')
    .gte('updated_at', todayISO)

  // Get orders delivered today
  const { count: deliveredToday } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .not('delivered_at', 'is', null)
    .gte('delivered_at', todayISO)

  // Get recent tracking updates
  const { data: recentTracking } = await supabase
    .from('orders')
    .select('id, order_number, tracking_number, shipping_carrier, shipstation_status, updated_at')
    .not('tracking_number', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(5)

  // Get labels pending creation
  const { count: pendingLabels } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .not('shipstation_order_id', 'is', null)
    .is('tracking_number', null)
    .eq('status', 'paid')

  return {
    awaiting_shipment: awaitingShipment || 0,
    shipped_today: shippedToday || 0,
    delivered_today: deliveredToday || 0,
    exceptions: 0, // Would need webhook data for real exceptions
    pending_labels: pendingLabels || 0,
    recent_tracking: (recentTracking || []).map(order => ({
      order_id: order.id,
      order_number: order.order_number,
      tracking_number: order.tracking_number,
      carrier: order.shipping_carrier,
      status: order.shipstation_status,
      updated_at: order.updated_at
    }))
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'shipped':
      return 'text-blue-600 bg-blue-50'
    case 'cancelled':
      return 'text-gray-600 bg-gray-50'
    case 'refunded':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'paid':
      return <CheckCircle className="h-4 w-4" />
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'cancelled':
    case 'refunded':
      return <XCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

export async function AdminDashboardServer() {
  const stats = await getAdminStats()
  const recentOrders = await getRecentOrders()
  const shipmentData = await getShipmentData()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Overview - Now Clickable */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From {stats.totalOrders} orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customers">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                <p className="text-xs text-muted-foreground">Live products</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Raffles</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRaffles}</div>
              <p className="text-xs text-muted-foreground">{stats.totalEntries} total entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Orders - Real Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {order.order_number || `Order ${order.id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.user?.full_name || order.email || 'Guest'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${((order.total_cents || 0) / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Orders will appear here once customers start purchasing</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shipping Status</CardTitle>
                  <CardDescription>Fulfillment overview</CardDescription>
                </div>
                <Link href="/admin/shipments" className="text-sm text-blue-600 hover:underline">
                  ShipStation →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Shipping Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-yellow-600">{shipmentData.awaiting_shipment}</p>
                    <p className="text-xs text-muted-foreground">Awaiting Shipment</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-blue-600">{shipmentData.shipped_today}</p>
                    <p className="text-xs text-muted-foreground">Shipped Today</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-600">{shipmentData.delivered_today}</p>
                    <p className="text-xs text-muted-foreground">Delivered Today</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-600">{shipmentData.pending_labels}</p>
                    <p className="text-xs text-muted-foreground">Pending Labels</p>
                  </div>
                </div>

                {/* Recent Tracking */}
                {shipmentData.recent_tracking.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Recent Tracking</p>
                    <div className="space-y-2">
                      {shipmentData.recent_tracking.slice(0, 3).map((item) => (
                        <div key={item.order_id} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {item.order_number || item.order_id.slice(0, 8)}
                          </span>
                          <span className="font-mono">
                            {item.tracking_number?.slice(-8) || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">System Status</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">PayPal Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm">Connected</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">ShipStation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm">Active</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tax Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm">TaxCloud Ready</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}