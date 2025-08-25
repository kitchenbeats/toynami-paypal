'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Pencil, Trash2, Plus, Save, X, Folder, 
  EyeOff, Star
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MediaSelector } from '@/components/ui/media-selector'
import { MediaItem } from '@/lib/types/media'

interface Category {
  id?: string
  slug: string
  name: string
  description?: string
  parent_id?: string
  parent?: { name: string }
  image_url?: string
  banner_url?: string
  icon_url?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  display_order: number
  is_featured: boolean
  is_active: boolean
  show_in_menu: boolean
  visibility_type?: 'public' | 'groups' | 'private'
  purchasability_type?: 'public' | 'groups' | 'private'
  deleted_at?: string
}

interface CategoriesManagerProps {
  initialCategories: Category[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Category>({
    slug: '',
    name: '',
    description: '',
    display_order: 0,
    is_featured: false,
    is_active: true,
    show_in_menu: true,
    visibility_type: 'public',
    purchasability_type: 'public'
  })
  const [isCreating, setIsCreating] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (category: Category) => {
    setEditingId(category.id || null)
    setFormData(category)
    setKeywordInput(category.meta_keywords?.join(', ') || '')
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      slug: '',
      name: '',
      description: '',
      display_order: categories.length,
      is_featured: false,
      is_active: true,
      show_in_menu: true,
      visibility_type: 'public',
      purchasability_type: 'public'
    })
    setKeywordInput('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      slug: '',
      name: '',
      description: '',
      display_order: 0,
      is_featured: false,
      is_active: true,
      show_in_menu: true,
      visibility_type: 'public',
      purchasability_type: 'public'
    })
    setKeywordInput('')
  }

  const handleSave = async () => {
    try {
      // Process keywords
      const meta_keywords = keywordInput
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0)

      const categoryData = {
        ...formData,
        meta_keywords: meta_keywords.length > 0 ? meta_keywords : null
      }

      if (isCreating) {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryData])
          .select()
          .single()
        
        if (error) throw error
        setCategories([...categories, data])
      } else if (editingId) {
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setCategories(categories.map(c => c.id === editingId ? data : c))
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will soft-delete it.')) return
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      setCategories(categories.filter(c => c.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Category Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Category' : 'Edit Category'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Convention Exclusives"
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
                  placeholder="e.g., convention-exclusives"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent">Parent Category</Label>
                <Select
                  value={formData.parent_id || 'none'}
                  onValueChange={(value) => 
                    setFormData({ ...formData, parent_id: value === 'none' ? undefined : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {categories
                      .filter(c => c.id !== editingId)
                      .map(cat => (
                        <SelectItem key={cat.id} value={cat.id!}>
                          {cat.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    display_order: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility_type}
                  onValueChange={(value: 'public' | 'groups' | 'private') => 
                    setFormData({ ...formData, visibility_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="groups">Customer Groups Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="purchasability">Purchasability</Label>
                <Select
                  value={formData.purchasability_type}
                  onValueChange={(value: 'public' | 'groups' | 'private') => 
                    setFormData({ ...formData, purchasability_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Anyone Can Purchase</SelectItem>
                    <SelectItem value="groups">Customer Groups Only</SelectItem>
                    <SelectItem value="private">No Purchases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Category Image</Label>
              <MediaSelector
                value={formData.image_url}
                onChange={(media: MediaItem | null) => {
                  setFormData({ ...formData, image_url: media?.file_url || '' })
                }}
                mimeTypeFilter="image/"
                folderFilter="categories"
                buttonText="Select Category Image"
                buttonVariant="outline"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="keywords">SEO Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="collectibles, exclusive, limited edition"
              />
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
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_in_menu"
                  checked={formData.show_in_menu}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_in_menu: checked })}
                />
                <Label htmlFor="show_in_menu">Show in Menu</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Folder className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      {category.is_featured && (
                        <Badge variant="default" className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!category.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {!category.show_in_menu && (
                        <Badge variant="outline">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden from Menu
                        </Badge>
                      )}
                      {category.visibility_type === 'private' && (
                        <Badge variant="destructive">Private</Badge>
                      )}
                      {category.visibility_type === 'groups' && (
                        <Badge variant="default">Groups Only</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                    {category.parent && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Parent: {category.parent.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => category.id && handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
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