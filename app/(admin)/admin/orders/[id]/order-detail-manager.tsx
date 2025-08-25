'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Package, 
  Truck, 
  User, 
   
  DollarSign,
  
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  Tag,
  
  Ship,
  FileText,
  History,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  product_id: string
  variant_id?: string
  quantity: number
  price_cents: number
  name: string
  sku?: string
  image_url?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  customer_email?: string
  customer_name?: string
  total_cents: number
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  created_at: string
  updated_at: string
  shipping_address?: Record<string, unknown>
  billing_address?: Record<string, unknown>
  order_items?: OrderItem[]
  shipstation_sync_logs?: Array<Record<string, unknown>>
  paypal_order_id?: string
  payment_status?: string
}

interface ShipStationOrder {
  orderId?: number
  orderNumber?: string
  orderStatus?: string
  orderDate?: string
  createDate?: string
  modifyDate?: string
  warehouseId?: number
  shipTo?: Record<string, unknown>
  billTo?: Record<string, unknown>
  items?: Array<Record<string, unknown>>
  tagIds?: number[]
}

interface ShipStationShipment {
  shipmentId: number
  orderId: number
  trackingNumber?: string
  carrierCode?: string
  serviceCode?: string
  shipDate?: string
  shipmentCost?: number
  voided?: boolean
}

interface Carrier {
  code: string
  name: string
}

interface Warehouse {
  warehouseId: number
  warehouseName: string
}

interface Tag {
  tagId: number
  name: string
  color?: string
}

interface OrderDetailManagerProps {
  order: Order
  shipstationOrder: ShipStationOrder | null
  shipstationShipments?: ShipStationShipment[]
  carriers?: Carrier[]
  warehouses: Warehouse[]
  tags: Tag[]
}

export function OrderDetailManager({
  order,
  shipstationOrder,
  warehouses,
  tags
}: OrderDetailManagerProps) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [creatingLabel, setCreatingLabel] = useState(false)

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, icon: React.ComponentType }> = {
      pending: { color: 'secondary', icon: Clock },
      paid: { color: 'blue', icon: DollarSign },
      shipped: { color: 'green', icon: Truck },
      delivered: { color: 'green', icon: CheckCircle },
      cancelled: { color: 'destructive', icon: XCircle },
      refunded: { color: 'orange', icon: AlertCircle },
      on_hold: { color: 'yellow', icon: Clock }
    }

    const config = statusConfig[status] || { color: 'default', icon: Package }
    const Icon = config.icon

    return (
      <Badge variant={config.color as "default" | "secondary" | "destructive" | "outline"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  // Sync with ShipStation
  const syncWithShipStation = async () => {
    setSyncing(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/sync`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Sync failed')
      
      toast.success('Order synced with ShipStation')
      router.refresh()
    } catch (error) {
      console.error('Failed to sync with ShipStation:', error)
      toast.error('Failed to sync with ShipStation')
    } finally {
      setSyncing(false)
    }
  }

  // Create shipping label
  const createShippingLabel = async () => {
    setCreatingLabel(true)
    router.push(`/admin/orders/${order.id}/ship`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/orders')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Order {order.order_number || `#${order.id.slice(0, 8)}`}
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(order.created_at), 'PPpp')}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
        
        <div className="flex gap-2">
          {order.status === 'paid' && !order.tracking_number && (
            <Button onClick={createShippingLabel} disabled={creatingLabel}>
              <Ship className="h-4 w-4 mr-2" />
              Create Label
            </Button>
          )}
          
          {!order.shipstation_order_id && order.status === 'paid' && (
            <Button variant="outline" onClick={syncWithShipStation} disabled={syncing}>
              {syncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync to ShipStation
            </Button>
          )}
          
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.product?.name || 'Unknown Product'}
                        {item.variant?.name && ` - ${item.variant.name}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.variant?.sku || item.product?.sku || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price_cents)} × {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price_cents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal_cents || 0)}</span>
                  </div>
                  {order.discount_cents > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount_cents)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatCurrency(order.shipping_cents || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax_cents || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_cents || 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.tracking_number ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipped via {order.shipping_carrier || 'Carrier'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tracking: <span className="font-mono">{order.tracking_number}</span>
                      </p>
                      {order.shipped_at && (
                        <p className="text-sm text-muted-foreground">
                          Shipped: {format(new Date(order.shipped_at), 'PPp')}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Track Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    This order has not been shipped yet.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Ship To:</p>
                  {order.ship_to ? (
                    <div className="text-sm text-muted-foreground">
                      <p>{order.ship_to.name}</p>
                      <p>{order.ship_to.street1}</p>
                      {order.ship_to.street2 && <p>{order.ship_to.street2}</p>}
                      <p>{order.ship_to.city}, {order.ship_to.state} {order.ship_to.postalCode}</p>
                      <p>{order.ship_to.country}</p>
                      {order.ship_to.phone && <p>Phone: {order.ship_to.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No shipping address</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Bill To:</p>
                  {order.bill_to ? (
                    <div className="text-sm text-muted-foreground">
                      <p>{order.bill_to.name}</p>
                      <p>{order.bill_to.street1}</p>
                      {order.bill_to.street2 && <p>{order.bill_to.street2}</p>}
                      <p>{order.bill_to.city}, {order.bill_to.state} {order.bill_to.postalCode}</p>
                      <p>{order.bill_to.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Same as shipping</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ShipStation Sync History */}
          {order.shipstation_sync_logs && order.shipstation_sync_logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  ShipStation Sync History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.shipstation_sync_logs?.map((log: Record<string, unknown>) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{log.action}</span>
                        {log.error_message && (
                          <span className="text-muted-foreground">- {log.error_message}</span>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {format(new Date(log.created_at), 'PPp')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{order.user?.full_name || 'Guest'}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                {order.user?.phone && (
                  <p className="text-sm text-muted-foreground">{order.user?.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Method</span>
                <span>PayPal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transaction ID</span>
                <span className="font-mono text-xs">{order.paypal_order_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status</span>
                <Badge variant={order.status === 'paid' ? 'success' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ShipStation Status */}
          {shipstationOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  ShipStation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Order ID</span>
                  <span className="font-mono">{shipstationOrder.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge>{shipstationOrder.orderStatus}</Badge>
                </div>
                {shipstationOrder.warehouseId && (
                  <div className="flex justify-between text-sm">
                    <span>Warehouse</span>
                    <span>{warehouses.find((w: Warehouse) => w.warehouseId === shipstationOrder.warehouseId)?.warehouseName || shipstationOrder.warehouseId}</span>
                  </div>
                )}
                {shipstationOrder.tagIds && shipstationOrder.tagIds.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tags</span>
                    <div className="flex gap-1">
                      {shipstationOrder.tagIds.map((tagId: number) => {
                        const tag = tags.find((t: Tag) => t.tagId === tagId)
                        return tag ? (
                          <Badge key={tagId} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          {(order.internal_notes || order.customer_notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.internal_notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Internal Notes</p>
                    <p className="text-sm text-muted-foreground">{order.internal_notes}</p>
                  </div>
                )}
                {order.customer_notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Customer Notes</p>
                    <p className="text-sm text-muted-foreground">{order.customer_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}