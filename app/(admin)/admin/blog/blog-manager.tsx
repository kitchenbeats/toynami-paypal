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
  Pencil, Trash2, Plus, Save, X, FileText, 
  Calendar, Eye, Star, Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BlogImageUpload } from '@/components/admin/blog-image-upload'
import { toast } from 'sonner'

interface BlogPost {
  id?: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  featured_image?: string
  thumbnail_url?: string
  author_id?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  featured: boolean
  meta_title?: string
  meta_description?: string
  tags?: string[]
  view_count: number
}

interface BlogManagerProps {
  initialPosts: BlogPost[]
}

export function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<BlogPost>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    thumbnail_url: '',
    status: 'draft',
    featured: false,
    tags: [],
    view_count: 0
  })
  const [isCreating, setIsCreating] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id || null)
    setFormData(post)
    setTagInput(post.tags?.join(', ') || '')
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      featured_image: '',
      thumbnail_url: '',
      status: 'draft',
      featured: false,
      tags: [],
      view_count: 0
    })
    setTagInput('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      featured_image: '',
      thumbnail_url: '',
      status: 'draft',
      featured: false,
      tags: [],
      view_count: 0
    })
    setTagInput('')
  }

  const handleSave = async () => {
    try {
      // Process tags
      const tags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const postData = {
        ...formData,
        tags,
        published_at: formData.status === 'published' && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at
      }

      if (isCreating) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single()
        
        if (error) throw error
        setPosts([data, ...posts])
      } else if (editingId) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingId)
          .select()
          .single()
        
        if (error) throw error
        setPosts(posts.map(p => p.id === editingId ? data : p))
      }
      
      handleCancel()
      router.refresh()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Failed to save blog post')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setPosts(posts.filter(p => p.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Failed to delete blog post')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'archived':
        return <Badge variant="outline">Archived</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Post Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Blog Post' : 'Edit Blog Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog post title"
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
                  placeholder="blog-post-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the post..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full blog post content (supports markdown)..."
                rows={10}
              />
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <BlogImageUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url || '' })}
                  label="Featured Image (Hero Banner)"
                  aspectRatio="aspect-[16/9]"
                  imageType="featured_image"
                />
              </div>
              <div className="lg:col-span-1">
                <BlogImageUpload
                  value={formData.thumbnail_url}
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url || '' })}
                  label="Thumbnail Image"
                  aspectRatio="aspect-square"
                  imageType="thumbnail_url"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published' | 'archived') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="news, announcement, sale"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title || ''}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">SEO Description</Label>
                <Input
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="SEO meta description"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    {getStatusBadge(post.status)}
                    {post.featured && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">/{post.slug}</p>
                  
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.view_count} views
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => post.id && handleDelete(post.id)}
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