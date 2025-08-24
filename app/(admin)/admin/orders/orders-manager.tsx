'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  RefreshCw, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Tag,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Printer,
  TestTube
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrdersManagerProps {
  initialOrders: any[]
  totalCount: number
}

export function OrdersManager({
  initialOrders,
  totalCount
}: OrdersManagerProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)

  // Order status colors and icons
  const getStatusBadge = (status: string, shipstationStatus?: string) => {
    const statusConfig: Record<string, { color: string, icon: any }> = {
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
      <div className="flex items-center gap-2">
        <Badge variant={config.color as any} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {status}
        </Badge>
        {shipstationStatus && shipstationStatus !== status && (
          <Badge variant="outline" className="text-xs">
            SS: {shipstationStatus}
          </Badge>
        )}
      </div>
    )
  }

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  // Handle order selection
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }




  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error('No orders selected')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          orderIds: selectedOrders
        })
      })

      if (!response.ok) throw new Error('Bulk action failed')
      
      const result = await response.json()
      toast.success(result.message)
      setSelectedOrders([])
      router.refresh()
    } catch (error) {
      toast.error('Bulk action failed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(search) ||
        order.user?.email?.toLowerCase().includes(search) ||
        order.user?.full_name?.toLowerCase().includes(search) ||
        order.tracking_number?.toLowerCase().includes(search)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false
    }

    // Date filter
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dateFilter === 'today' && daysDiff !== 0) return false
      if (dateFilter === 'week' && daysDiff > 7) return false
      if (dateFilter === 'month' && daysDiff > 30) return false
    }

    return true
  })

  // Order statistics
  const stats = {
    total: totalCount,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, o) => sum + (o.total_cents || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Awaiting Shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.shipped}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
          </CardContent>
        </Card>
      </div>


      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders, customers, tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {selectedOrders.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('print_labels')}
                disabled={loading}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print Labels ({selectedOrders.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('add_tag')}
                disabled={loading}
              >
                <Tag className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {order.order_number || `#${order.id.slice(0, 8)}`}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.user?.full_name || 'Guest'}</div>
                    <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status, order.shipstation_status)}
                </TableCell>
                <TableCell>
                  {order.order_items?.length || 0} items
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(order.total_cents || 0)}
                </TableCell>
                <TableCell>
                  {order.tracking_number ? (
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span className="text-sm font-mono">{order.tracking_number}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === 'paid' && shipstationConnected && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/orders/${order.id}/ship`)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page * pageSize >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
