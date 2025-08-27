'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Pencil, Trash2, Plus, Save, X, Users, 
  DollarSign, Percent, ShoppingCart,
  TrendingUp, Award, Medal, Crown, Gem,
  Star, Settings,
  AlertCircle, Check
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CustomerGroup {
  id?: string
  slug: string
  name: string
  description?: string
  is_default: boolean
  is_active: boolean
  priority: number
  
  // New spend-based fields
  assignment_method: 'manual' | 'automatic' | 'hybrid'
  spend_min_cents?: number | null
  spend_max_cents?: number | null
  spend_period: 'lifetime' | 'annual' | 'quarterly' | 'monthly'
  auto_assign_on_first_purchase: boolean
  auto_assign: boolean
  auto_remove: boolean
  allow_manual_override: boolean
  
  // Benefits
  discount_percentage: number
  free_shipping_threshold_cents?: number | null
  benefits?: {
    early_access?: boolean
    exclusive_products?: boolean
    priority_support?: boolean
    custom_benefits?: string[]
  }
  
  // Appearance
  badge_color?: string | null
  badge_icon?: string | null
  requires_approval: boolean
}

interface GroupMember {
  id: string
  user_id: string
  group_id: string
  approved_at?: string | null
  user: {
    id: string
    email: string
    full_name?: string
    lifetime_spend_cents?: number
    current_year_spend_cents?: number
    first_purchase_date?: string
    total_orders_count?: number
  }
}

const ICON_OPTIONS = [
  { value: 'star', label: 'Star', icon: Star },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'medal', label: 'Medal', icon: Medal },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'gem', label: 'Gem', icon: Gem },
  { value: 'trophy', label: 'Trophy', icon: TrendingUp },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'cart', label: 'Cart', icon: ShoppingCart }
]

const COLOR_OPTIONS = [
  { value: '#10B981', label: 'Green' },
  { value: '#CD7F32', label: 'Bronze' },
  { value: '#C0C0C0', label: 'Silver' },
  { value: '#FFD700', label: 'Gold' },
  { value: '#E5E4E2', label: 'Platinum' },
  { value: '#FF1493', label: 'Pink' },
  { value: '#4B0082', label: 'Indigo' },
  { value: '#6B46C1', label: 'Purple' }
]

interface EnhancedGroupsManagerProps {
  initialGroups: CustomerGroup[]
}

export function EnhancedGroupsManager({ initialGroups }: EnhancedGroupsManagerProps) {
  const [groups, setGroups] = useState<CustomerGroup[]>(initialGroups)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [activeTab, setActiveTab] = useState('groups')
  
  const [formData, setFormData] = useState<CustomerGroup>({
    slug: '',
    name: '',
    description: '',
    is_default: false,
    is_active: true,
    priority: 0,
    assignment_method: 'manual',
    spend_min_cents: null,
    spend_max_cents: null,
    spend_period: 'lifetime',
    auto_assign_on_first_purchase: false,
    auto_assign: false,
    auto_remove: false,
    allow_manual_override: true,
    discount_percentage: 0,
    free_shipping_threshold_cents: null,
    benefits: {
      early_access: false,
      exclusive_products: false,
      priority_support: false,
      custom_benefits: []
    },
    badge_color: null,
    badge_icon: null,
    requires_approval: false
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [customBenefit, setCustomBenefit] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadGroupMembers = async (groupId: string) => {
    setLoadingMembers(true)
    
    const { data, error } = await supabase
      .from('user_customer_groups')
      .select(`
        *,
        user:users(
          id,
          email,
          full_name,
          lifetime_spend_cents,
          current_year_spend_cents,
          first_purchase_date,
          total_orders_count
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setMembers(data as GroupMember[])
    }
    
    setLoadingMembers(false)
  }

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
      assignment_method: 'manual',
      spend_min_cents: null,
      spend_max_cents: null,
      spend_period: 'lifetime',
      auto_assign_on_first_purchase: false,
      auto_assign: false,
      auto_remove: false,
      allow_manual_override: true,
      discount_percentage: 0,
      free_shipping_threshold_cents: null,
      benefits: {
        early_access: false,
        exclusive_products: false,
        priority_support: false,
        custom_benefits: []
      },
      badge_color: null,
      badge_icon: null,
      requires_approval: false
    })
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    if (!formData.slug.trim()) {
      toast.error('Slug is required')
      return
    }
    
    // Check if slug is URL-safe
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens')
      return
    }
    
    // Check spending range
    if (formData.spend_min_cents !== null && formData.spend_max_cents !== null) {
      if (formData.spend_min_cents > formData.spend_max_cents) {
        toast.error('Maximum spend must be greater than minimum spend')
        return
      }
    }
    
    // Check discount percentage
    if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
      toast.error('Discount percentage must be between 0 and 100')
      return
    }

    setIsLoading(true)
    
    try {
      const dataToSave = {
        ...formData,
        spend_min_cents: formData.spend_min_cents ? Math.round(formData.spend_min_cents * 100) : null,
        spend_max_cents: formData.spend_max_cents ? Math.round(formData.spend_max_cents * 100) : null,
        free_shipping_threshold_cents: formData.free_shipping_threshold_cents 
          ? Math.round(formData.free_shipping_threshold_cents * 100) 
          : null
      }

      if (editingId) {
        const { error } = await supabase
          .from('customer_groups')
          .update(dataToSave)
          .eq('id', editingId)

        if (!error) {
          setGroups(groups.map(g => g.id === editingId ? { ...dataToSave, id: editingId } : g))
          toast.success('Customer group updated')
        } else {
          console.error('Update error:', error)
          toast.error(`Failed to update group: ${error.message}`)
          return
        }
      } else {
        const { data, error } = await supabase
          .from('customer_groups')
          .insert([dataToSave])
          .select()
          .single()

        if (!error && data) {
          setGroups([...groups, data])
          toast.success('Customer group created')
        } else {
          console.error('Create error:', error)
          toast.error(`Failed to create group: ${error?.message || 'Unknown error'}`)
          return
        }
      }

      setEditingId(null)
      setIsCreating(false)
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return

    const { error } = await supabase
      .from('customer_groups')
      .delete()
      .eq('id', id)

    if (!error) {
      setGroups(groups.filter(g => g.id !== id))
      toast.success('Customer group deleted')
    } else {
      toast.error('Failed to delete group')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
  }

  const addCustomBenefit = () => {
    if (customBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: {
          ...formData.benefits,
          custom_benefits: [...(formData.benefits?.custom_benefits || []), customBenefit.trim()]
        }
      })
      setCustomBenefit('')
    }
  }

  const removeCustomBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: {
        ...formData.benefits,
        custom_benefits: formData.benefits?.custom_benefits?.filter((_, i) => i !== index) || []
      }
    })
  }

  const approveMember = async (membershipId: string) => {
    const { error } = await supabase
      .from('user_customer_groups')
      .update({ approved_at: new Date().toISOString() })
      .eq('id', membershipId)

    if (!error) {
      toast.success('Member approved')
      if (selectedGroupId) {
        loadGroupMembers(selectedGroupId)
      }
    } else {
      toast.error('Failed to approve member')
    }
  }

  const removeMember = async (membershipId: string) => {
    if (!confirm('Remove this member from the group?')) return

    const { error } = await supabase
      .from('user_customer_groups')
      .delete()
      .eq('id', membershipId)

    if (!error) {
      toast.success('Member removed')
      if (selectedGroupId) {
        loadGroupMembers(selectedGroupId)
      }
    } else {
      toast.error('Failed to remove member')
    }
  }

  const IconComponent = formData.badge_icon 
    ? ICON_OPTIONS.find(opt => opt.value === formData.badge_icon)?.icon 
    : null

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="groups" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Customer Groups</CardTitle>
              <CardDescription>
                Manage customer tiers and automatic assignment rules
              </CardDescription>
            </div>
            {!isCreating && !editingId && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {(isCreating || editingId) && (
              <Card className="mb-6 border-2 border-primary">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Group' : 'Create New Group'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., VIP Members"
                      />
                    </div>
                    <div>
                      <Label>Slug</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g., vip-members"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe this customer group..."
                    />
                  </div>

                  {/* Assignment Method */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold">Assignment Rules</h4>
                    
                    <div>
                      <Label>Assignment Method</Label>
                      <Select 
                        value={formData.assignment_method}
                        onValueChange={(v: 'manual' | 'automatic' | 'hybrid') => 
                          setFormData({ ...formData, assignment_method: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual Only</SelectItem>
                          <SelectItem value="automatic">Automatic Only</SelectItem>
                          <SelectItem value="hybrid">Both Manual & Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.assignment_method !== 'manual' && (
                      <>
                        {/* Spending Thresholds */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Minimum Spend ($)</Label>
                            <Input
                              type="number"
                              value={formData.spend_min_cents ? formData.spend_min_cents / 100 : ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                spend_min_cents: e.target.value ? parseFloat(e.target.value) * 100 : null 
                              })}
                              placeholder="Leave empty for no minimum"
                            />
                          </div>
                          <div>
                            <Label>Maximum Spend ($)</Label>
                            <Input
                              type="number"
                              value={formData.spend_max_cents ? formData.spend_max_cents / 100 : ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                spend_max_cents: e.target.value ? parseFloat(e.target.value) * 100 : null 
                              })}
                              placeholder="Leave empty for no maximum"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Spending Period</Label>
                          <Select 
                            value={formData.spend_period}
                            onValueChange={(v: 'lifetime' | 'annual' | 'quarterly' | 'monthly') => 
                              setFormData({ ...formData, spend_period: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lifetime">Lifetime</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Auto-assignment Options */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Auto-assign on first purchase</Label>
                            <Switch
                              checked={formData.auto_assign_on_first_purchase}
                              onCheckedChange={(checked) => 
                                setFormData({ ...formData, auto_assign_on_first_purchase: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto-assign when threshold met</Label>
                            <Switch
                              checked={formData.auto_assign}
                              onCheckedChange={(checked) => 
                                setFormData({ ...formData, auto_assign: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto-remove when no longer qualified</Label>
                            <Switch
                              checked={formData.auto_remove}
                              onCheckedChange={(checked) => 
                                setFormData({ ...formData, auto_remove: checked })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.assignment_method === 'hybrid' && (
                      <div className="flex items-center justify-between">
                        <Label>Allow manual override</Label>
                        <Switch
                          checked={formData.allow_manual_override}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, allow_manual_override: checked })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold">Benefits</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Discount Percentage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount_percentage}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              discount_percentage: parseFloat(e.target.value) || 0 
                            })}
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <div>
                        <Label>Free Shipping Threshold ($)</Label>
                        <Input
                          type="number"
                          value={formData.free_shipping_threshold_cents 
                            ? formData.free_shipping_threshold_cents / 100 
                            : ''
                          }
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            free_shipping_threshold_cents: e.target.value 
                              ? parseFloat(e.target.value) * 100 
                              : null 
                          })}
                          placeholder="0 for always free"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Early Access</Label>
                        <Switch
                          checked={formData.benefits?.early_access || false}
                          onCheckedChange={(checked) => 
                            setFormData({ 
                              ...formData, 
                              benefits: { ...formData.benefits, early_access: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Exclusive Products</Label>
                        <Switch
                          checked={formData.benefits?.exclusive_products || false}
                          onCheckedChange={(checked) => 
                            setFormData({ 
                              ...formData, 
                              benefits: { ...formData.benefits, exclusive_products: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Priority Support</Label>
                        <Switch
                          checked={formData.benefits?.priority_support || false}
                          onCheckedChange={(checked) => 
                            setFormData({ 
                              ...formData, 
                              benefits: { ...formData.benefits, priority_support: checked }
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Custom Benefits */}
                    <div>
                      <Label>Custom Benefits</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={customBenefit}
                          onChange={(e) => setCustomBenefit(e.target.value)}
                          placeholder="Add a custom benefit..."
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomBenefit())}
                        />
                        <Button type="button" onClick={addCustomBenefit} size="sm">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.benefits?.custom_benefits?.map((benefit, index) => (
                          <Badge key={index} variant="secondary">
                            {benefit}
                            <button
                              onClick={() => removeCustomBenefit(index)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold">Appearance</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Badge Color</Label>
                        <Select 
                          value={formData.badge_color || ''}
                          onValueChange={(v) => setFormData({ ...formData, badge_color: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLOR_OPTIONS.map(color => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: color.value }}
                                  />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Badge Icon</Label>
                        <Select 
                          value={formData.badge_icon || ''}
                          onValueChange={(v) => setFormData({ ...formData, badge_icon: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map(icon => {
                              const Icon = icon.icon
                              return (
                                <SelectItem key={icon.value} value={icon.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {icon.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Preview */}
                    {(formData.badge_color || formData.badge_icon) && (
                      <div>
                        <Label>Preview</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                          <Badge 
                            style={{ 
                              backgroundColor: formData.badge_color || undefined,
                              color: 'white'
                            }}
                          >
                            {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                            {formData.name || 'Group Name'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold">Settings</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Priority (Higher = More Important)</Label>
                        <Input
                          type="number"
                          value={formData.priority}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            priority: parseInt(e.target.value) || 0 
                          })}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Active</Label>
                          <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, is_active: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Default Group</Label>
                          <Switch
                            checked={formData.is_default}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, is_default: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Requires Approval</Label>
                          <Switch
                            checked={formData.requires_approval}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, requires_approval: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {editingId ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingId ? 'Update' : 'Create'} Group
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Groups List */}
            <div className="space-y-4">
              {groups.map((group) => (
                <Card key={group.id} className={editingId === group.id ? 'border-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{group.name}</h3>
                          {group.badge_color && (
                            <Badge 
                              style={{ 
                                backgroundColor: group.badge_color,
                                color: 'white'
                              }}
                            >
                              {group.badge_icon && (() => {
                                const iconOption = ICON_OPTIONS.find(o => o.value === group.badge_icon)
                                if (iconOption) {
                                  const IconComponent = iconOption.icon
                                  return (
                                    <span className="mr-1">
                                      <IconComponent className="h-3 w-3" />
                                    </span>
                                  )
                                }
                                return null
                              })()}
                              {group.slug}
                            </Badge>
                          )}
                          {group.is_default && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          {!group.is_active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        
                        {group.description && (
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm">
                          {/* Assignment Method */}
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span className="capitalize">{group.assignment_method} Assignment</span>
                          </div>

                          {/* Spending Range */}
                          {(group.spend_min_cents !== null || group.spend_max_cents !== null) && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>
                                {group.spend_min_cents !== null && `$${group.spend_min_cents / 100}`}
                                {group.spend_min_cents !== null && group.spend_max_cents !== null && ' - '}
                                {group.spend_max_cents !== null && `$${group.spend_max_cents / 100}`}
                                {group.spend_max_cents === null && group.spend_min_cents !== null && '+'}
                                {' '}({group.spend_period})
                              </span>
                            </div>
                          )}

                          {/* Discount */}
                          {group.discount_percentage > 0 && (
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span>{group.discount_percentage}% discount</span>
                            </div>
                          )}

                          {/* Free Shipping */}
                          {group.free_shipping_threshold_cents !== null && (
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="h-3 w-3" />
                              <span>
                                Free shipping 
                                {group.free_shipping_threshold_cents > 0 
                                  ? ` over $${group.free_shipping_threshold_cents / 100}`
                                  : ' always'
                                }
                              </span>
                            </div>
                          )}

                          {/* Auto-assign badges */}
                          {group.auto_assign_on_first_purchase && (
                            <Badge variant="outline" className="text-xs">
                              First Purchase
                            </Badge>
                          )}
                          {group.auto_assign && (
                            <Badge variant="outline" className="text-xs">
                              Auto-assign
                            </Badge>
                          )}
                          {group.auto_remove && (
                            <Badge variant="outline" className="text-xs">
                              Auto-remove
                            </Badge>
                          )}
                        </div>

                        {/* Benefits */}
                        {group.benefits && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {group.benefits.early_access && (
                              <Badge variant="secondary" className="text-xs">Early Access</Badge>
                            )}
                            {group.benefits.exclusive_products && (
                              <Badge variant="secondary" className="text-xs">Exclusive Products</Badge>
                            )}
                            {group.benefits.priority_support && (
                              <Badge variant="secondary" className="text-xs">Priority Support</Badge>
                            )}
                            {group.benefits.custom_benefits?.map((benefit, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGroupId(group.id!)
                            loadGroupMembers(group.id!)
                            setActiveTab('members')
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(group)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!group.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => group.id && handleDelete(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Group Members</CardTitle>
            <CardDescription>
              Manage members in each customer group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Group Selector */}
            <div className="mb-6">
              <Label>Select Group</Label>
              <Select 
                value={selectedGroupId || ''}
                onValueChange={(id) => {
                  setSelectedGroupId(id)
                  loadGroupMembers(id)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group to view members" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id!}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Members List */}
            {selectedGroupId && (
              <div className="space-y-4">
                {loadingMembers ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading members...
                  </div>
                ) : members.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No members in this group yet.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Member</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Lifetime Spend</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Orders</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Member Since</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {members.map((member) => (
                          <tr key={member.id}>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium">
                                  {member.user?.full_name || 'Unknown'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {member.user?.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              ${((member.user?.lifetime_spend_cents || 0) / 100).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              {member.user?.total_orders_count || 0}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {member.user?.first_purchase_date 
                                ? new Date(member.user.first_purchase_date).toLocaleDateString()
                                : 'N/A'
                              }
                            </td>
                            <td className="px-4 py-3">
                              {member.approved_at ? (
                                <Badge variant="default">
                                  <Check className="h-3 w-3 mr-1" />
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                {!member.approved_at && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => approveMember(member.id)}
                                  >
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeMember(member.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Group Analytics</CardTitle>
            <CardDescription>
              Overview of customer distribution and spending by group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {groups.map((group) => {
                // This would fetch real analytics data
                const mockData = {
                  memberCount: Math.floor(Math.random() * 1000),
                  totalRevenue: Math.floor(Math.random() * 100000),
                  avgOrderValue: Math.floor(Math.random() * 500)
                }
                
                return (
                  <Card key={group.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: group.badge_color || '#gray' }}
                          >
                            {group.badge_icon && (() => {
                              const iconOption = ICON_OPTIONS.find(o => o.value === group.badge_icon)
                              if (iconOption) {
                                const IconComponent = iconOption.icon
                                return <IconComponent className="h-5 w-5 text-white" />
                              }
                              return null
                            })()}
                          </div>
                          <div>
                            <h4 className="font-semibold">{group.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {group.assignment_method} assignment
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-right">
                          <div>
                            <p className="text-2xl font-bold">{mockData.memberCount}</p>
                            <p className="text-xs text-muted-foreground">Members</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              ${(mockData.totalRevenue / 100).toFixed(0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              ${(mockData.avgOrderValue / 100).toFixed(0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Avg Order</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

