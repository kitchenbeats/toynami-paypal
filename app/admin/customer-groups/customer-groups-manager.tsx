'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Pencil, Trash2, Plus, Save, X, Users, Shield, 
  DollarSign, Percent, Package, Eye, ShoppingCart 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CustomerGroup {
  id?: string
  slug: string
  name: string
  description?: string
  is_default: boolean
  is_active: boolean
  priority: number
  can_see_prices: boolean
  can_purchase: boolean
  discount_percentage: number
  tax_exempt: boolean
  requires_approval: boolean
  auto_assign_rules?: any
}

interface CustomerGroupsManagerProps {
  initialGroups: CustomerGroup[]
}

export function CustomerGroupsManager({ initialGroups }: CustomerGroupsManagerProps) {
  const [groups, setGroups] = useState<CustomerGroup[]>(initialGroups)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CustomerGroup>({
    slug: '',
    name: '',
    description: '',
    is_default: false,
    is_active: true,
    priority: 0,
    can_see_prices: true,
    can_purchase: true,
    discount_percentage: 0,
    tax_exempt: false,
    requires_approval: false
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (group: CustomerGroup) => {
    setEditingId(group.id || null)
    setFormData(group)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      slug: '',
      name: '',
      description: '',
      is_default: false,
      is_active: true,
      priority: 0,
      can_see_prices: true,
      can_purchase: true,
      discount_percentage: 0,
      tax_exempt: false,
      requires_approval: false
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      slug: '',
      name: '',
      description: '',
      is_default: false,
      is_active: true,
      priority: 0,
      can_see_prices: true,
      can_purchase: true,
      discount_percentage: 0,
      tax_exempt: false,
      requires_approval: false
    })
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('customer_groups')
          .insert([formData])
          .select()
          .single()
        
        if (error) throw error
        setGroups([...groups, data])
      } else if (editingId) {
        const { data, error } = await supabase
          .from('customer_groups')
          .update(formData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setGroups(groups.map(g => g.id === editingId ? data : g))
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving customer group:', error)
      alert('Failed to save customer group')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer group?')) return
    
    try {
      const { error } = await supabase
        .from('customer_groups')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setGroups(groups.filter(g => g.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting customer group:', error)
      alert('Failed to delete customer group')
    }
  }

  const getPriorityBadge = (priority: number) => {
    if (priority >= 20) return <Badge variant="destructive">Highest</Badge>
    if (priority >= 10) return <Badge variant="default">High</Badge>
    if (priority >= 5) return <Badge>Medium</Badge>
    return <Badge variant="secondary">Low</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Add New Group Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer Group
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Customer Group' : 'Edit Customer Group'}</CardTitle>
            <CardDescription>
              Customer groups control product visibility, pricing, and purchasing permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Tax</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., VIP Customers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-') 
                      })}
                      placeholder="e.g., vip-customers"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this customer group..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      priority: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Higher priority groups take precedence when a user belongs to multiple groups
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_default"
                      checked={formData.is_default}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                    />
                    <Label htmlFor="is_default">Default Group</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires_approval"
                      checked={formData.requires_approval}
                      onCheckedChange={(checked) => setFormData({ 
                        ...formData, 
                        requires_approval: checked 
                      })}
                    />
                    <Label htmlFor="requires_approval">Requires Approval</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Can See Prices</Label>
                        <p className="text-sm text-muted-foreground">
                          Members can view product prices
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.can_see_prices}
                      onCheckedChange={(checked) => setFormData({ 
                        ...formData, 
                        can_see_prices: checked 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Can Purchase</Label>
                        <p className="text-sm text-muted-foreground">
                          Members can add items to cart and checkout
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.can_purchase}
                      onCheckedChange={(checked) => setFormData({ 
                        ...formData, 
                        can_purchase: checked 
                      })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Group Discount (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          discount_percentage: parseFloat(e.target.value) || 0 
                        })}
                      />
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-8">
                    <Switch
                      id="tax_exempt"
                      checked={formData.tax_exempt}
                      onCheckedChange={(checked) => setFormData({ 
                        ...formData, 
                        tax_exempt: checked 
                      })}
                    />
                    <Label htmlFor="tax_exempt">Tax Exempt</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups List */}
      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      {group.is_default && (
                        <Badge variant="outline">Default</Badge>
                      )}
                      {!group.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {getPriorityBadge(group.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      {group.discount_percentage > 0 && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {group.discount_percentage}% discount
                        </div>
                      )}
                      {group.tax_exempt && (
                        <Badge variant="outline" className="text-xs">Tax Exempt</Badge>
                      )}
                      {group.requires_approval && (
                        <Badge variant="outline" className="text-xs">Requires Approval</Badge>
                      )}
                      {!group.can_see_prices && (
                        <Badge variant="secondary" className="text-xs">Hidden Prices</Badge>
                      )}
                      {!group.can_purchase && (
                        <Badge variant="secondary" className="text-xs">No Purchase</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(group)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => group.id && handleDelete(group.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={group.is_default}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}