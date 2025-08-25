'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PromotionFormDialog } from '@/components/admin/promotion-form-dialog'
import { 
  Plus, TrendingUp, Percent, Gift, Calendar,
  Clock, Users, DollarSign, Package, Truck,
  Edit, Trash2, Copy, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight
} from 'lucide-react'

interface Promotion {
  id: string
  name: string
  description?: string
  type: string
  discount_type?: string
  discount_value?: number
  is_active: boolean
  auto_apply: boolean
  priority: number
  stackable: boolean
  usage_count: number
  total_discount_given_cents: number
  starts_at?: string
  expires_at?: string
  created_at: string
}

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    activeCount: 0,
    totalUsage: 0,
    totalDiscounts: 0
  })

  useEffect(() => {
    fetchPromotions()
  }, [currentPage])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/promotions?page=${currentPage}&limit=20`)
      
      if (!response.ok) throw new Error('Failed to fetch promotions')
      
      const data = await response.json()
      setPromotions(data.promotions)
      setTotalPages(data.pagination.totalPages)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePromotion = async (promotionData: Partial<Promotion>) => {
    try {
      const url = editingPromotion 
        ? `/api/admin/promotions/${editingPromotion.id}`
        : '/api/admin/promotions'
      
      const method = editingPromotion ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionData)
      })

      if (!response.ok) throw new Error('Failed to save promotion')
      
      await fetchPromotions()
      setShowFormDialog(false)
      setEditingPromotion(null)
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Failed to save promotion')
    }
  }

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      const response = await fetch(`/api/admin/promotions/${promotion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !promotion.is_active })
      })

      if (!response.ok) throw new Error('Failed to toggle promotion')
      
      await fetchPromotions()
    } catch (error) {
      console.error('Error toggling promotion:', error)
    }
  }

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return

    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete promotion')
      
      await fetchPromotions()
    } catch (error) {
      console.error('Error deleting promotion:', error)
    }
  }

  const handleDuplicate = async (promotion: Promotion) => {
    const duplicated = {
      ...promotion,
      id: undefined,
      name: `${promotion.name} (Copy)`,
      usage_count: 0,
      total_discount_given_cents: 0
    }
    
    setEditingPromotion(null)
    await handleSavePromotion(duplicated)
  }

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage_off':
        return <Percent className="h-4 w-4" />
      case 'fixed_amount_off':
        return <DollarSign className="h-4 w-4" />
      case 'bogo':
        return <Gift className="h-4 w-4" />
      case 'bundle':
        return <Package className="h-4 w-4" />
      case 'tiered':
        return <Users className="h-4 w-4" />
      case 'free_shipping':
        return <Truck className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage automatic promotional campaigns and discounts
        </p>
        <Button onClick={() => {
          setEditingPromotion(null)
          setShowFormDialog(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Promotions</p>
                <p className="text-2xl font-bold">{stats.activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalDiscounts)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Times Used</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Percent className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Discount</p>
                <p className="text-2xl font-bold">
                  {stats.totalUsage > 0 
                    ? formatCurrency(stats.totalDiscounts / stats.totalUsage)
                    : '$0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading promotions...</div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Promotions Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first promotion to automatically apply discounts to qualifying orders.
              </p>
              <Button onClick={() => setShowFormDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Promotion
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{promotion.name}</p>
                          {promotion.description && (
                            <p className="text-sm text-muted-foreground">{promotion.description}</p>
                          )}
                          <div className="flex gap-1 mt-1">
                            {promotion.auto_apply && (
                              <Badge variant="outline" className="text-xs">Auto</Badge>
                            )}
                            {promotion.stackable && (
                              <Badge variant="outline" className="text-xs">Stackable</Badge>
                            )}
                            {promotion.priority > 0 && (
                              <Badge variant="outline" className="text-xs">P{promotion.priority}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPromotionIcon(promotion.type)}
                          <span className="capitalize">{promotion.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {promotion.discount_type === 'percentage' 
                          ? `${promotion.discount_value}%`
                          : promotion.discount_value 
                            ? formatCurrency(promotion.discount_value * 100)
                            : 'Variable'
                        }
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{promotion.usage_count} uses</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(promotion.total_discount_given_cents)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(promotion.starts_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(promotion.expires_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={promotion.is_active ? 'default' : 'secondary'}>
                          {promotion.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleActive(promotion)}
                          >
                            {promotion.is_active ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingPromotion(promotion)
                              setShowFormDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicate(promotion)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(promotion.id)}
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
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <PromotionFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        promotion={editingPromotion}
        onSave={handleSavePromotion}
      />
    </div>
  )
}