'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Pencil, Trash2, Plus, Copy, ExternalLink, Info
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SimpleImageUpload } from '@/components/admin/simple-image-upload'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  display_order?: number
  is_active: boolean
  start_date?: string
  end_date?: string
  target_pages?: string[]
  exclude_pages?: string[]
}

interface BannersManagerProps {
  initialBanners: Banner[]
}

const POSITIONS = ['upper', 'middle', 'lower', 'hero'] as const
const SLOTS_PER_POSITION = 6

export function BannersManagerImproved({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedPosition] = useState<typeof POSITIONS[number]>('upper')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<Banner>({
    name: '',
    position: 'upper',
    slot_number: 1,
    is_active: true,
    text_alignment: 'center',
    target_pages: ['*'],
    exclude_pages: []
  })

  const handleCreate = () => {
    setFormData({
      name: '',
      position: 'upper',
      slot_number: 1,
      is_active: true,
      text_alignment: 'center'
    })
    setIsCreating(true)
    setEditingBanner(null)
    setShowDialog(true)
  }

  const handleEdit = (banner: Banner) => {
    setFormData(banner)
    setEditingBanner(banner)
    setIsCreating(false)
    setShowDialog(true)
  }

  const handleCancel = () => {
    setShowDialog(false)
    setIsCreating(false)
    setEditingBanner(null)
    setFormData({
      name: '',
      position: 'upper',
      slot_number: 1,
      is_active: true,
      text_alignment: 'center'
    })
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name) {
        toast.error('Banner name is required')
        return
      }

      // Check for slot conflicts
      const existingBanner = banners.find(
        b => b.position === formData.position && 
        b.slot_number === formData.slot_number && 
        b.id !== editingBanner?.id
      )
      
      if (existingBanner) {
        toast.error(`Slot ${formData.slot_number} in ${formData.position} position is already occupied by "${existingBanner.name}"`)
        return
      }

      if (isCreating) {
        const { data, error } = await supabase
          .from('banners')
          .insert([formData])
          .select()
          .single()
        
        if (error) throw error
        setBanners([...banners, data])
        toast.success('Banner created successfully')
      } else if (editingBanner) {
        const { data, error } = await supabase
          .from('banners')
          .update(formData)
          .eq('id', editingBanner.id!)
          .select()
          .single()
        
        if (error) throw error
        setBanners(banners.map(b => b.id === editingBanner.id ? data : b))
        toast.success('Banner updated successfully')
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Failed to save banner')
    }
  }

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Are you sure you want to delete "${banner.name}"?`)) return
    
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', banner.id!)
      
      if (error) throw error
      setBanners(banners.filter(b => b.id !== banner.id))
      toast.success('Banner deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    }
  }

  const handleDuplicate = async (banner: Banner) => {
    // Find next available slot
    const samePositionBanners = banners.filter(b => b.position === banner.position)
    const usedSlots = samePositionBanners.map(b => b.slot_number)
    let nextSlot = 1
    for (let i = 1; i <= SLOTS_PER_POSITION; i++) {
      if (!usedSlots.includes(i)) {
        nextSlot = i
        break
      }
    }
    
    if (usedSlots.length >= SLOTS_PER_POSITION) {
      toast.error(`All slots in ${banner.position} position are occupied`)
      return
    }

    const newBanner = {
      ...banner,
      id: undefined,
      name: `${banner.name} (Copy)`,
      slot_number: nextSlot
    }
    
    setFormData(newBanner)
    setIsCreating(true)
    setEditingBanner(null)
    setShowDialog(true)
  }

  const getAvailableSlots = (position: typeof POSITIONS[number]) => {
    const usedSlots = banners
      .filter(b => b.position === position)
      .map(b => b.slot_number)
    
    return Array.from({ length: SLOTS_PER_POSITION }, (_, i) => i + 1)
      .filter(slot => !usedSlots.includes(slot) || slot === editingBanner?.slot_number)
  }

  const getPositionBadgeColor = (position: string) => {
    switch(position) {
      case 'hero': return 'bg-purple-100 text-purple-800'
      case 'upper': return 'bg-blue-100 text-blue-800'
      case 'middle': return 'bg-green-100 text-green-800'
      case 'lower': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Banner Management</CardTitle>
              <CardDescription className="mt-2">
                Manage promotional banners across different positions on your site. 
                Each position can have up to {SLOTS_PER_POSITION} banners.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
                {viewMode === 'table' ? 'Grid View' : 'Table View'}
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Banner
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Position Info */}
      <div className="grid grid-cols-4 gap-4">
        {POSITIONS.map(pos => {
          const positionBanners = banners.filter(b => b.position === pos)
          const activeBanners = positionBanners.filter(b => b.is_active)
          return (
            <Card key={pos}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{pos}</span>
                  <Badge className={getPositionBadgeColor(pos)}>
                    {positionBanners.length}/{SLOTS_PER_POSITION}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activeBanners.length} active
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Banner List */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>All Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No banners created yet. Click &quot;Create Banner&quot; to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.sort((a, b) => {
                    if (a.position !== b.position) {
                      return POSITIONS.indexOf(a.position) - POSITIONS.indexOf(b.position)
                    }
                    return a.slot_number - b.slot_number
                  }).map(banner => (
                    <TableRow key={banner.id}>
                      <TableCell className="font-medium">{banner.name}</TableCell>
                      <TableCell>
                        <Badge className={getPositionBadgeColor(banner.position)}>
                          {banner.position}
                        </Badge>
                      </TableCell>
                      <TableCell>{banner.slot_number}</TableCell>
                      <TableCell>{banner.title || '-'}</TableCell>
                      <TableCell>
                        {banner.image_url ? (
                          <span className="text-sm text-green-600">✓ Has image</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
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
                            onClick={() => handleDuplicate(banner)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {banner.button_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(banner.button_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(banner)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Grid View */
        <Tabs defaultValue={selectedPosition} urlSync={false}>
          <TabsList>
            {POSITIONS.map(pos => (
              <TabsTrigger key={pos} value={pos} className="capitalize">
                {pos} Position
              </TabsTrigger>
            ))}
          </TabsList>

          {POSITIONS.map(position => (
            <TabsContent key={position} value={position}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: SLOTS_PER_POSITION }, (_, i) => {
                  const slot = i + 1
                  const banner = banners.find(b => b.position === position && b.slot_number === slot)
                  
                  return (
                    <Card key={`${position}-${slot}`} className={!banner ? 'border-dashed' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Slot {slot}</span>
                          {banner && (
                            <Badge variant={banner.is_active ? 'default' : 'secondary'} className="text-xs">
                              {banner.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {banner ? (
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium">{banner.name}</h4>
                              {banner.title && <p className="text-sm text-muted-foreground">{banner.title}</p>}
                            </div>
                            {banner.image_url && (
                              <div className="aspect-[16/9] relative rounded overflow-hidden bg-muted">
                                <Image
                                  src={banner.image_url.startsWith('http') ? banner.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${banner.image_url}`}
                                  alt={banner.image_alt || banner.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(banner)}
                                className="flex-1"
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(banner)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full h-32"
                            onClick={() => {
                              setFormData({
                                name: '',
                                position,
                                slot_number: slot,
                                is_active: true,
                                text_alignment: 'center'
                              })
                              setIsCreating(true)
                              setEditingBanner(null)
                              setShowDialog(true)
                            }}
                          >
                            <Plus className="h-6 w-6" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create New Banner' : 'Edit Banner'}</DialogTitle>
            <DialogDescription>
              Configure your banner content and appearance settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
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

              <SimpleImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url || undefined })}
                label="Banner Image"
                aspectRatio="aspect-[16/9]"
                folder="banners"
              />

              <div>
                <Label htmlFor="image_alt">Image Alt Text</Label>
                <Input
                  id="image_alt"
                  value={formData.image_alt || ''}
                  onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                  placeholder="Descriptive text for accessibility"
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
                  rows={3}
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

            <TabsContent value="design" className="space-y-4 mt-4">
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
                  <Label htmlFor="background_color">Background Color</Label>
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color || '#000000'}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
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

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value: typeof POSITIONS[number]) => 
                      setFormData({ ...formData, position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(pos => (
                        <SelectItem key={pos} value={pos} className="capitalize">
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="slot_number">Slot Number *</Label>
                  <Select
                    value={formData.slot_number.toString()}
                    onValueChange={(value) => 
                      setFormData({ ...formData, slot_number: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSlots(formData.position).map(slot => (
                        <SelectItem key={slot} value={slot.toString()}>
                          Slot {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Position & Slot Information</p>
                    <p className="text-blue-700 mt-1">
                      Each position can have up to {SLOTS_PER_POSITION} banners. 
                      Only one banner can occupy a specific slot in each position.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="target_pages">Show on Pages</Label>
                <Input
                  id="target_pages"
                  value={formData.target_pages?.join(', ') || '*'}
                  onChange={(e) => {
                    const pages = e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    setFormData({ ...formData, target_pages: pages.length ? pages : ['*'] })
                  }}
                  placeholder="*, /, /products, /categories/robotech"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list. Use * for all pages, / for homepage, /products for products page, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="exclude_pages">Exclude from Pages</Label>
                <Input
                  id="exclude_pages"
                  value={formData.exclude_pages?.join(', ') || ''}
                  onChange={(e) => {
                    const pages = e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    setFormData({ ...formData, exclude_pages: pages })
                  }}
                  placeholder="/admin, /account/settings"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of pages where this banner should NOT show
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Page Targeting Examples</p>
                    <ul className="text-blue-700 mt-1 space-y-1">
                      <li>• <code>*</code> - Show on all pages</li>
                      <li>• <code>/</code> - Homepage only</li>
                      <li>• <code>/products</code> - Products page only</li>
                      <li>• <code>/products, /categories</code> - Multiple specific pages</li>
                      <li>• <code>/products/*</code> - All product pages (wildcards supported)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? 'Create Banner' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}