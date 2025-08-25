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
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor'
import { 
  Pencil, Trash2, Plus, Save, X, FileText, 
  Calendar, Eye, Globe, Link
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Page {
  id?: string
  slug: string
  title: string
  content?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  is_active: boolean
  show_in_menu: boolean
  menu_title?: string
  menu_order?: number
  created_at?: string
  updated_at?: string
}

interface PagesManagerProps {
  initialPages: Page[]
}

export function PagesManager({ initialPages }: PagesManagerProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Page>({
    slug: '',
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true,
    show_in_menu: false,
    menu_title: '',
    menu_order: 0
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (page: Page) => {
    setEditingId(page.id || null)
    setFormData({
      ...page,
      // Convert null values to empty strings to prevent React input warnings
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      menu_title: page.menu_title || '',
      menu_order: page.menu_order || 0
    })
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      is_active: true,
      show_in_menu: false,
      menu_title: '',
      menu_order: 0
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      is_active: true,
      show_in_menu: false,
      menu_title: '',
      menu_order: 0
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: formData.slug || generateSlug(title),
      meta_title: formData.meta_title || title
    })
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Title is required')
        return
      }
      if (!formData.slug.trim()) {
        toast.error('Slug is required')
        return
      }

      const pageData = {
        ...formData,
        slug: formData.slug.toLowerCase().trim(),
        updated_at: new Date().toISOString()
      }

      if (isCreating) {
        const { data, error } = await supabase
          .from('pages')
          .insert([pageData])
          .select()
          .single()
        
        if (error) throw error
        setPages([data, ...pages])
        toast.success('Page created successfully')
      } else if (editingId) {
        const { data, error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setPages(pages.map(p => p.id === editingId ? data : p))
        toast.success('Page updated successfully')
      }
      
      handleCancel()
      router.refresh()
    } catch (error: unknown) {
      console.error('Error saving page:', error)
      if (error instanceof Error && error.message?.includes('duplicate key')) {
        toast.error('A page with this slug already exists')
      } else {
        toast.error('Failed to save page')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPages(pages.filter(p => p.id !== id))
      toast.success('Page deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete page')
    }
  }

  const handleDuplicate = async (page: Page) => {
    try {
      const duplicateData = {
        ...page,
        id: undefined,
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy`,
        created_at: undefined,
        updated_at: undefined
      }

      const { data, error } = await supabase
        .from('pages')
        .insert([duplicateData])
        .select()
        .single()

      if (error) throw error

      setPages([data, ...pages])
      toast.success('Page duplicated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error duplicating page:', error)
      toast.error('Failed to duplicate page')
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage static pages for your website
        </p>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Page' : 'Edit Page'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Page title"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="page-url-slug"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <Label>Content</Label>
              <WysiwygEditor
                content={formData.content || ''}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your page content..."
                className="min-h-[400px]"
              />
            </div>

            {/* SEO Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO title (defaults to page title)"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="SEO description for search results"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </div>
            </div>

            {/* Menu Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Menu Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_in_menu"
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_in_menu: checked })}
                  />
                  <Label htmlFor="show_in_menu">Show in Navigation Menu</Label>
                </div>
                {formData.show_in_menu && (
                  <>
                    <div>
                      <Label htmlFor="menu_title">Menu Title</Label>
                      <Input
                        id="menu_title"
                        value={formData.menu_title}
                        onChange={(e) => setFormData({ ...formData, menu_title: e.target.value })}
                        placeholder="Menu display name (defaults to title)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="menu_order">Menu Order</Label>
                      <Input
                        id="menu_order"
                        type="number"
                        value={formData.menu_order}
                        onChange={(e) => setFormData({ ...formData, menu_order: parseInt(e.target.value) || 0 })}
                        placeholder="Sort order (0 = first)"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Published</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{page.title}</h3>
                    <Badge variant={page.is_active ? "default" : "secondary"}>
                      {page.is_active ? 'Published' : 'Draft'}
                    </Badge>
                    {page.show_in_menu && (
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        In Menu
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      <span>/{page.slug}</span>
                    </div>
                    {page.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(page.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {page.meta_description && (
                    <p className="text-sm text-muted-foreground">
                      {page.meta_description.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {page.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(page)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(page)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(page.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first page to get started
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}