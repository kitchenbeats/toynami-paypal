'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CreateLabelDialog } from '@/components/admin/create-label-dialog'
import { 
  RefreshCw, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Printer,
  TestTube,
  Ship
} from 'lucide-react'

interface ShipmentsManagerProps {
  initialOrders: any[]
  totalCount: number
  warehouses: any[]
  tags: any[]
  carriers: any[]
  stores: any[]
}

export function ShipmentsManager({
  initialOrders,
  totalCount,
  warehouses,
  tags,
  carriers,
  stores
}: ShipmentsManagerProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [creatingTest, setCreatingTest] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [labelDialogOpen, setLabelDialogOpen] = useState(false)
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<any>(null)

  // Refresh from ShipStation
  const refreshOrders = async () => {
    setRefreshing(true)
    try {
      router.refresh()
      toast.success('Shipments refreshed from ShipStation')
    } catch (error) {
      toast.error('Failed to refresh shipments')
    } finally {
      setRefreshing(false)
    }
  }

  // Create test order in ShipStation
  const createTestOrder = async () => {
    setCreatingTest(true)
    try {
      const response = await fetch('/api/admin/orders/test', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create test order')
      }
      
      toast.success('Test order created in ShipStation!')
      setTimeout(() => router.refresh(), 1000) // Refresh after a second
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create test order')
    } finally {
      setCreatingTest(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'awaiting_shipment':
        return 'bg-yellow-100 text-yellow-800'
      case 'on_hold':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'awaiting_payment':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ShipStation Orders</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Total: {totalCount} orders | Store ID: {process.env.NEXT_PUBLIC_SHIPSTATION_STORE_ID || 'All Stores'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={createTestOrder}
                disabled={creatingTest}
              >
                {creatingTest ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
                Create Test Order
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={refreshOrders}
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh from ShipStation
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium">Order #</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Ship To</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Tracking</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-8 text-muted-foreground">
                      No orders found in ShipStation. Create a test order to get started.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {order.orderId}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{order.shipTo?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.shipTo?.city}, {order.shipTo?.state}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.shipTo?.postalCode}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items?.length || 0} items
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.weight?.value} {order.weight?.units}
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {formatCurrency(order.orderTotal * 100)}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus?.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {order.shipments?.length > 0 ? (
                          <div>
                            <div className="text-sm font-medium">
                              {order.shipments[0].trackingNumber}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.shipments[0].carrierCode}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {order.orderStatus === 'awaiting_shipment' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrderForLabel(order)
                                setLabelDialogOpen(true)
                              }}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          )}
                          <Link href={`/admin/shipments/${order.orderId}`}>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ShipStation Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            {warehouses.length > 0 ? (
              <ul className="text-sm space-y-1">
                {warehouses.map((w: any, index: number) => (
                  <li key={w.warehouseId || `warehouse-${index}`}>{w.warehouseName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No warehouses configured</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Carriers</CardTitle>
          </CardHeader>
          <CardContent>
            {carriers.length > 0 ? (
              <ul className="text-sm space-y-1">
                {carriers.slice(0, 5).map((c: any, index: number) => (
                  <li key={`${c.code}-${index}`}>{c.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No carriers configured</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Stores</CardTitle>
          </CardHeader>
          <CardContent>
            {stores.length > 0 ? (
              <ul className="text-sm space-y-1">
                {stores.map((s: any, index: number) => (
                  <li key={s.storeId || `store-${index}`} className={s.storeId == process.env.NEXT_PUBLIC_SHIPSTATION_STORE_ID ? 'font-bold' : ''}>
                    {s.storeName} ({s.marketplaceName})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No stores configured</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Label Dialog */}
      {selectedOrderForLabel && (
        <CreateLabelDialog
          open={labelDialogOpen}
          onOpenChange={setLabelDialogOpen}
          order={selectedOrderForLabel}
          onSuccess={() => {
            router.refresh()
            setSelectedOrderForLabel(null)
          }}
        />
      )}
    </div>
  )
}