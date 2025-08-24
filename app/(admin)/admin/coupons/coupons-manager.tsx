'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, Ticket, Percent, Calendar, Users, 
  Copy, Eye, BarChart3, Hash, Edit, Trash2, 
  Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react'

interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  usage_limit?: number
  usage_count: number
  actual_usage_count: number
  total_discount_given_cents: number
  is_active: boolean
  starts_at?: string
  expires_at?: string
  created_at: string
}

export function CouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    activeCoupons: 0,
    totalUses: 0,
    totalSavings: 0,
    conversionRate: 0
  })

  // Load coupons data
  useEffect(() => {
    fetchCoupons()
  }, [currentPage, searchTerm, statusFilter])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/coupons?${params}`)
      if (!response.ok) throw new Error('Failed to fetch coupons')
      
      const data = await response.json()
      setCoupons(data.coupons)
      setTotalPages(data.pagination.totalPages)
      
      // Calculate stats
      const activeCoupons = data.coupons.filter((c: Coupon) => c.is_active).length
      const totalUses = data.coupons.reduce((sum: number, c: Coupon) => sum + c.actual_usage_count, 0)
      const totalSavings = data.coupons.reduce((sum: number, c: Coupon) => sum + c.total_discount_given_cents, 0)
      
      setStats({
        activeCoupons,
        totalUses,
        totalSavings: totalSavings / 100, // Convert to dollars
        conversionRate: totalUses > 0 ? Math.round((totalUses / data.coupons.length) * 100) : 0
      })
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = () => {
    setEditingCoupon(null)
    setShowCreateDialog(true)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setShowCreateDialog(true)
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete coupon')
      
      await fetchCoupons()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      alert('Failed to delete coupon')
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage coupon codes for customer discounts
        </p>
        <Button onClick={handleCreateCoupon}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Coupons</p>
                <p className="text-2xl font-bold">{stats.activeCoupons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                <p className="text-2xl font-bold">{stats.totalUses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Percent className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">${stats.totalSavings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coupon Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coupons found. Create your first coupon to get started.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Total Saved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {coupon.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{coupon.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {coupon.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}%` 
                          : formatCurrency(coupon.discount_value * 100)
                        }
                      </TableCell>
                      <TableCell>
                        {coupon.actual_usage_count}
                        {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(coupon.total_discount_given_cents)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.is_active ? "default" : "secondary"}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(coupon.expires_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Coupon Dialog */}
      <CouponDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        coupon={editingCoupon}
        onSave={fetchCoupons}
      />
    </div>
  )
}

// Coupon Create/Edit Dialog Component
function CouponDialog({ 
  open, 
  onOpenChange, 
  coupon, 
  onSave 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon | null
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed_amount',
    discountValue: '',
    usageLimit: '',
    usageLimitPerCustomer: '',
    startsAt: '',
    expiresAt: '',
    minimumOrderAmount: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description || '',
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value.toString(),
        usageLimit: coupon.usage_limit?.toString() || '',
        usageLimitPerCustomer: '',
        startsAt: coupon.starts_at ? new Date(coupon.starts_at).toISOString().split('T')[0] : '',
        expiresAt: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
        minimumOrderAmount: '',
        isActive: coupon.is_active
      })
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        usageLimit: '',
        usageLimitPerCustomer: '',
        startsAt: '',
        expiresAt: '',
        minimumOrderAmount: '',
        isActive: true
      })
    }
  }, [coupon, open])

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const payload = {
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        usageLimitPerCustomer: formData.usageLimitPerCustomer ? parseInt(formData.usageLimitPerCustomer) : undefined,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : undefined,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        minimumOrderAmountCents: formData.minimumOrderAmount ? Math.round(parseFloat(formData.minimumOrderAmount) * 100) : undefined,
        isActive: formData.isActive
      }

      const url = coupon ? `/api/admin/coupons/${coupon.id}` : '/api/admin/coupons'
      const method = coupon ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save coupon')
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving coupon:', error)
      alert(error instanceof Error ? error.message : 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20"
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="20% Off Sale"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Get 20% off your entire order"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountType">Discount Type *</Label>
              <Select 
                value={formData.discountType} 
                onValueChange={(value: 'percentage' | 'fixed_amount') => 
                  setFormData({ ...formData, discountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">
                Discount Value * {formData.discountType === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="minimumOrderAmount">Minimum Order Amount (Optional)</Label>
              <Input
                id="minimumOrderAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.minimumOrderAmount}
                onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startsAt">Start Date (Optional)</Label>
              <Input
                id="startsAt"
                type="date"
                value={formData.startsAt}
                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !formData.code || !formData.name || !formData.discountValue}
            >
              {saving ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}