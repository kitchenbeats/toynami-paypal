'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash2, Plus, GripVertical, Save, X, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MediaSelector } from '@/components/ui/media-selector'
import { MediaItem } from '@/lib/types/media'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Brand {
  id?: string
  slug: string
  name: string
  logo_url?: string
  logo_media_id?: string
  banner_url_1?: string
  banner_media_id_1?: string
  banner_url_2?: string
  banner_media_id_2?: string
  description?: string
  featured: boolean
  display_order: number
  search_keywords?: string
  is_active: boolean
}

interface BrandsManagerProps {
  initialBrands: Brand[]
}

export function BrandsManager({ initialBrands }: BrandsManagerProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Brand>({
    slug: '',
    name: '',
    logo_url: '',
    banner_url_1: '',
    banner_url_2: '',
    description: '',
    featured: false,
    display_order: 0,
    search_keywords: '',
    is_active: true
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id || null)
    setFormData(brand)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      slug: '',
      name: '',
      logo_url: '',
      banner_url_1: '',
      banner_url_2: '',
      description: '',
      featured: false,
      display_order: brands.length,
      search_keywords: '',
      is_active: true
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      slug: '',
      name: '',
      logo_url: '',
      banner_url_1: '',
      banner_url_2: '',
      description: '',
      featured: false,
      display_order: 0,
      search_keywords: '',
      is_active: true
    })
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        // Create new brand
        const { data, error } = await supabase
          .from('brands')
          .insert([formData])
          .select()
          .single()
        
        if (error) throw error
        setBrands([...brands, data])
      } else if (editingId) {
        // Update existing brand
        const { data, error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setBrands(brands.map(b => b.id === editingId ? data : b))
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving brand:', error)
      alert('Failed to save brand')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return
    
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setBrands(brands.filter(b => b.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert('Failed to delete brand')
    }
  }

  // Keeping for future drag-and-drop implementation
  // const handleReorder = async (fromIndex: number, toIndex: number) => {
  //   const newBrands = [...brands]
  //   const [removed] = newBrands.splice(fromIndex, 1)
  //   newBrands.splice(toIndex, 0, removed)
  //   
  //   // Update display_order for all affected brands
  //   const updates = newBrands.map((brand, index) => ({
  //     ...brand,
  //     display_order: index
  //   }))
  //   
  //   setBrands(updates)
  //   
  //   // Update in database
  //   try {
  //     for (const brand of updates) {
  //       if (brand.id) {
  //         await supabase
  //           .from('brands')
  //           .update({ display_order: brand.display_order })
  //           .eq('id', brand.id)
  //       }
  //     }
  //     router.refresh()
  //   } catch (error) {
  //     console.error('Error reordering brands:', error)
  //   }
  // }

  return (
    <div className="space-y-6">
      {/* Add New Brand Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Brand
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Brand' : 'Edit Brand'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                {editingId && <TabsTrigger value="images">Images</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Robotech"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g., robotech"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the brand..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="search_keywords">Search Keywords</Label>
                  <Input
                    id="search_keywords"
                    value={formData.search_keywords || ''}
                    onChange={(e) => setFormData({ ...formData, search_keywords: e.target.value })}
                    placeholder="robotech macross veritech valkyrie"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured Brand</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4">
                {editingId ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <p className="text-xs text-muted-foreground">Brand logo image</p>
                      <MediaSelector
                        value={formData.logo_url || formData.logo_media_id}
                        onChange={(media: MediaItem | null) => {
                          setFormData({ 
                            ...formData, 
                            logo_url: media?.file_url || '',
                            logo_media_id: media?.id || undefined
                          })
                        }}
                        mimeTypeFilter="image/"
                        folderFilter="brands"
                        buttonText="Select Logo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Home Banner</Label>
                      <p className="text-xs text-muted-foreground">Displayed on home page</p>
                      <MediaSelector
                        value={formData.banner_url_1 || formData.banner_media_id_1}
                        onChange={(media: MediaItem | null) => {
                          setFormData({ 
                            ...formData, 
                            banner_url_1: media?.file_url || '',
                            banner_media_id_1: media?.id || undefined
                          })
                        }}
                        mimeTypeFilter="image/"
                        folderFilter="banners"
                        buttonText="Select Home Banner"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Brand Page Banner</Label>
                      <p className="text-xs text-muted-foreground">Displayed on brand page</p>
                      <MediaSelector
                        value={formData.banner_url_2 || formData.banner_media_id_2}
                        onChange={(media: MediaItem | null) => {
                          setFormData({ 
                            ...formData, 
                            banner_url_2: media?.file_url || '',
                            banner_media_id_2: media?.id || undefined
                          })
                        }}
                        mimeTypeFilter="image/"
                        folderFilter="banners"
                        buttonText="Select Brand Banner"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Save the brand first, then you can add images
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Brand
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brands List */}
      <div className="space-y-4">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                <div>
                  <h3 className="font-semibold">{brand.name}</h3>
                  <p className="text-sm text-gray-500">/{brand.slug}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {brand.logo_url && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Logo
                      </span>
                    )}
                    {brand.banner_url_1 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Home Banner
                      </span>
                    )}
                    {brand.banner_url_2 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Brand Banner
                      </span>
                    )}
                  </div>
                </div>
                {brand.featured && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Featured</span>
                )}
                {!brand.is_active && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Inactive</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(brand)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => brand.id && handleDelete(brand.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}