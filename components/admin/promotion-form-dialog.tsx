'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Package, Percent, Truck, Users, Gift } from 'lucide-react'

interface Promotion {
  id?: string
  name: string
  description?: string
  type: 'percentage_off' | 'fixed_amount_off' | 'bogo' | 'bundle' | 'tiered' | 'free_shipping'
  discount_type?: 'percentage' | 'fixed_amount' | 'free_item'
  discount_value?: number
  max_discount_amount_cents?: number
  minimum_order_amount_cents?: number
  auto_apply: boolean
  priority: number
  stackable: boolean
  stackable_with_coupons: boolean
  is_active: boolean
  starts_at?: string
  expires_at?: string
  rules?: Record<string, unknown>
  applicable_product_ids?: number[]
  applicable_category_ids?: string[]
  customer_group_ids?: string[]
  badge_text?: string
  badge_color?: string
}

interface PromotionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion?: Promotion | null
  onSave: (promotion: Promotion) => Promise<void>
}

export function PromotionFormDialog({ open, onOpenChange, promotion, onSave }: PromotionFormDialogProps) {
  const [formData, setFormData] = useState<Promotion>({
    name: '',
    description: '',
    type: 'percentage_off',
    discount_type: 'percentage',
    discount_value: 10,
    auto_apply: true,
    priority: 0,
    stackable: false,
    stackable_with_coupons: true,
    is_active: true,
    rules: {}
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (promotion) {
      setFormData(promotion)
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'percentage_off',
        discount_type: 'percentage',
        discount_value: 10,
        auto_apply: true,
        priority: 0,
        stackable: false,
        stackable_with_coupons: true,
        is_active: true,
        rules: {}
      })
    }
  }, [promotion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Build rules based on promotion type
      const rules = buildRules()
      
      await onSave({
        ...formData,
        rules,
        minimum_order_amount_cents: formData.minimum_order_amount_cents ? formData.minimum_order_amount_cents * 100 : undefined,
        max_discount_amount_cents: formData.max_discount_amount_cents ? formData.max_discount_amount_cents * 100 : undefined
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving promotion:', error)
    } finally {
      setLoading(false)
    }
  }

  const buildRules = () => {
    switch (formData.type) {
      case 'bogo':
        return {
          buy_quantity: 2,
          get_quantity: 1,
          get_discount: 100 // 100% off the free item
        }
      case 'tiered':
        return {
          tiers: [
            { min_amount: 5000, discount: 5 },
            { min_amount: 10000, discount: 10 },
            { min_amount: 20000, discount: 15 }
          ]
        }
      case 'bundle':
        return {
          required_products: [],
          discount: formData.discount_value
        }
      default:
        return {}
    }
  }

  // Function to get promotion icons - available for future use
  // const getPromotionIcon = (type: string) => {
  //   switch (type) {
  //     case 'percentage_off':
  //       return <Percent className="h-4 w-4" />
  //     case 'fixed_amount_off':
  //       return <DollarSign className="h-4 w-4" />
  //     case 'bogo':
  //       return <Gift className="h-4 w-4" />
  //     case 'bundle':
  //       return <Package className="h-4 w-4" />
  //     case 'tiered':
  //       return <Users className="h-4 w-4" />
  //     case 'free_shipping':
  //       return <Truck className="h-4 w-4" />
  //     default:
  //       return null
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {promotion ? 'Edit Promotion' : 'Create New Promotion'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Sale"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Promotion Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage_off">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Percentage Off
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed_amount_off">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Fixed Amount Off
                        </div>
                      </SelectItem>
                      <SelectItem value="bogo">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          Buy One Get One (BOGO)
                        </div>
                      </SelectItem>
                      <SelectItem value="bundle">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Bundle Discount
                        </div>
                      </SelectItem>
                      <SelectItem value="tiered">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Tiered Discount
                        </div>
                      </SelectItem>
                      <SelectItem value="free_shipping">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Free Shipping
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this promotion..."
                  rows={3}
                />
              </div>

              {(formData.type === 'percentage_off' || formData.type === 'fixed_amount_off') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">
                      {formData.type === 'percentage_off' ? 'Discount Percentage' : 'Discount Amount ($)'}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      min="0"
                      step={formData.type === 'percentage_off' ? "1" : "0.01"}
                      value={formData.discount_value || ''}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                      placeholder={formData.type === 'percentage_off' ? "10" : "5.00"}
                    />
                  </div>

                  {formData.type === 'percentage_off' && (
                    <div className="space-y-2">
                      <Label htmlFor="max_discount">Max Discount Amount ($)</Label>
                      <Input
                        id="max_discount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={(formData.max_discount_amount_cents || 0) / 100}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          max_discount_amount_cents: Math.round(parseFloat(e.target.value) * 100)
                        })}
                        placeholder="Optional cap"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_apply">Auto Apply</Label>
                  <Switch
                    id="auto_apply"
                    checked={formData.auto_apply}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_apply: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (Higher = First)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_order">Minimum Order ($)</Label>
                  <Input
                    id="min_order"
                    type="number"
                    min="0"
                    step="0.01"
                    value={(formData.minimum_order_amount_cents || 0) / 100}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      minimum_order_amount_cents: Math.round(parseFloat(e.target.value) * 100)
                    })}
                    placeholder="No minimum"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stackable">Stackable with Other Promotions</Label>
                  <Switch
                    id="stackable"
                    checked={formData.stackable}
                    onCheckedChange={(checked) => setFormData({ ...formData, stackable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="stackable_coupons">Stackable with Coupons</Label>
                  <Switch
                    id="stackable_coupons"
                    checked={formData.stackable_with_coupons}
                    onCheckedChange={(checked) => setFormData({ ...formData, stackable_with_coupons: checked })}
                  />
                </div>
              </div>

              {formData.type === 'tiered' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Tiered Discount Rules</p>
                  <div className="space-y-2 text-sm">
                    <div>Spend $50+ get 5% off</div>
                    <div>Spend $100+ get 10% off</div>
                    <div>Spend $200+ get 15% off</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Default tiers - customize after creation
                  </p>
                </div>
              )}

              {formData.type === 'bogo' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">BOGO Rules</p>
                  <div className="text-sm">Buy 2, Get 1 Free (100% off)</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Default BOGO - customize after creation
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="restrictions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="starts_at">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at || ''}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires_at">End Date</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={formData.expires_at || ''}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product/Category Restrictions</Label>
                <p className="text-sm text-muted-foreground">
                  Configure product and category restrictions after creation
                </p>
              </div>

              <div className="space-y-2">
                <Label>Customer Groups</Label>
                <p className="text-sm text-muted-foreground">
                  Configure customer group restrictions after creation
                </p>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="badge_text">Badge Text</Label>
                  <Input
                    id="badge_text"
                    value={formData.badge_text || ''}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="e.g., SALE, LIMITED TIME"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_color">Badge Color</Label>
                  <Select 
                    value={formData.badge_color || 'red'} 
                    onValueChange={(value) => setFormData({ ...formData, badge_color: value })}
                  >
                    <SelectTrigger id="badge_color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">
                        <Badge className="bg-red-500">Red</Badge>
                      </SelectItem>
                      <SelectItem value="green">
                        <Badge className="bg-green-500">Green</Badge>
                      </SelectItem>
                      <SelectItem value="blue">
                        <Badge className="bg-blue-500">Blue</Badge>
                      </SelectItem>
                      <SelectItem value="yellow">
                        <Badge className="bg-yellow-500">Yellow</Badge>
                      </SelectItem>
                      <SelectItem value="purple">
                        <Badge className="bg-purple-500">Purple</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Display Options</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded"
                    />
                    <span className="text-sm">Show on product pages</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded"
                    />
                    <span className="text-sm">Show in shopping cart</span>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (promotion ? 'Update' : 'Create')} Promotion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}