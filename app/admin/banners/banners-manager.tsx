'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pencil, Trash2, Plus, Save, X, Image, Type, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Banner {
  id?: string
  name: string
  position: 'upper' | 'middle' | 'lower' | 'hero'
  slot_number: number
  image_url?: string
  image_alt?: string
  title?: string
  subtitle?: string
  description?: string
  button_text?: string
  button_url?: string
  text_alignment?: 'left' | 'center' | 'right'
  background_color?: string
  text_color?: string
  button_color?: string
  button_text_color?: string
  overlay_opacity?: number
  column_span: number
  display_order: number
  is_active: boolean
  start_date?: string
  end_date?: string
}

interface BannersManagerProps {
  initialBanners: Banner[]
}

const POSITIONS = ['upper', 'middle', 'lower', 'hero'] as const
const SLOTS_PER_POSITION = 6

export function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Banner>({
    name: '',
    position: 'upper',
    slot_number: 1,
    column_span: 1,
    display_order: 0,
    is_active: true,
    text_alignment: 'center'
  })
  const [isCreating, setIsCreating] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<typeof POSITIONS[number]>('upper')
  const router = useRouter()
  const supabase = createClient()

  const getBannersByPosition = (position: typeof POSITIONS[number]) => {
    return banners.filter(b => b.position === position).sort((a, b) => a.slot_number - b.slot_number)
  }

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id || null)
    setFormData(banner)
    setIsCreating(false)
  }

  const handleCreate = (position: typeof POSITIONS[number], slot: number) => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      name: `${position} Banner ${slot}`,
      position,
      slot_number: slot,
      column_span: 1,
      display_order: 0,
      is_active: true,
      text_alignment: 'center'
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      name: '',
      position: 'upper',
      slot_number: 1,
      column_span: 1,
      display_order: 0,
      is_active: true,
      text_alignment: 'center'
    })
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('banners')
          .insert([formData])
          .select()
          .single()
        
        if (error) throw error
        setBanners([...banners, data])
      } else if (editingId) {
        const { data, error } = await supabase
          .from('banners')
          .update(formData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setBanners(banners.map(b => b.id === editingId ? data : b))
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Failed to save banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setBanners(banners.filter(b => b.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Failed to delete banner')
    }
  }

  const renderBannerSlot = (position: typeof POSITIONS[number], slot: number) => {
    const banner = banners.find(b => b.position === position && b.slot_number === slot)
    
    if (banner) {
      return (
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{banner.name}</h4>
                  {banner.title && <p className="text-sm text-gray-600">{banner.title}</p>}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => banner.id && handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {banner.image_url && (
                <div className="text-xs text-gray-500 truncate">
                  <Image className="h-3 w-3 inline mr-1" />
                  {banner.image_url}
                </div>
              )}
              {!banner.is_active && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Inactive</span>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }
    
    return (
      <Card className="h-full border-dashed">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <Button
            variant="ghost"
            onClick={() => handleCreate(position, slot)}
            className="w-full h-full"
          >
            <Plus className="h-6 w-6 text-gray-400" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Banner' : 'Edit Banner'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList>
                <TabsTrigger value="content">
                  <Type className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Banner Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Spring Sale Banner"
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_url">Link URL</Label>
                    <Input
                      id="button_url"
                      value={formData.button_url || ''}
                      onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                      placeholder="/products?sale=true"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="SPRING SALE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Limited time offer"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Save up to 40% on select items..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text || ''}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Shop Now"
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div>
                  <Label htmlFor="text_alignment">Text Alignment</Label>
                  <Select
                    value={formData.text_alignment || 'center'}
                    onValueChange={(value: 'left' | 'center' | 'right') => 
                      setFormData({ ...formData, text_alignment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="text_color">Text Color</Label>
                    <Input
                      id="text_color"
                      type="color"
                      value={formData.text_color || '#000000'}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="background_color">Background Color</Label>
                    <Input
                      id="background_color"
                      type="color"
                      value={formData.background_color || '#ffffff'}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_color">Button Color</Label>
                    <Input
                      id="button_color"
                      type="color"
                      value={formData.button_color || '#000000'}
                      onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_text_color">Button Text Color</Label>
                    <Input
                      id="button_text_color"
                      type="color"
                      value={formData.button_text_color || '#ffffff'}
                      onChange={(e) => setFormData({ ...formData, button_text_color: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
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
                Save Banner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner Positions */}
      <Tabs value={selectedPosition} onValueChange={(v) => setSelectedPosition(v as typeof POSITIONS[number])}>
        <TabsList>
          {POSITIONS.map(pos => (
            <TabsTrigger key={pos} value={pos} className="capitalize">
              {pos} Banners
            </TabsTrigger>
          ))}
        </TabsList>

        {POSITIONS.map(position => (
          <TabsContent key={position} value={position}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: SLOTS_PER_POSITION }, (_, i) => (
                <div key={`${position}-${i + 1}`} className="h-32">
                  <div className="text-sm text-gray-500 mb-2">Slot {i + 1}</div>
                  {renderBannerSlot(position, i + 1)}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}