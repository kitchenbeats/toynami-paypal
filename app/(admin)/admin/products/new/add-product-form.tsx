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
import { Checkbox } from '@/components/ui/checkbox'
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor'
import { Save, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface AddProductFormProps {
  categories: Category[]
  brands: Brand[]
}

export function AddProductForm({ categories, brands }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sku: '',
    base_price_cents: 0,
    compare_price_cents: 0,
    cost_cents: 0,
    weight_grams: 0,
    stock_level: 0,
    low_stock_level: 5,
    track_inventory: true,
    is_visible: true,
    allow_purchases: true,
    is_featured: false,
    is_new: true,
    is_on_sale: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    search_keywords: '',
    brand_id: '',
    category_ids: [] as string[]
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({ 
      ...formData, 
      name,
      slug: formData.slug || generateSlug(name),
      meta_title: formData.meta_title || name
    })
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData({
      ...formData,
      category_ids: checked
        ? [...formData.category_ids, categoryId]
        : formData.category_ids.filter(id => id !== categoryId)
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Product name is required')
        return
      }
      if (!formData.slug.trim()) {
        toast.error('Product slug is required')
        return
      }

      // Create product
      const productData = {
        ...formData,
        slug: formData.slug.toLowerCase().trim(),
        base_price_cents: Math.round(formData.base_price_cents * 100),
        compare_price_cents: formData.compare_price_cents ? Math.round(formData.compare_price_cents * 100) : null,
        cost_cents: formData.cost_cents ? Math.round(formData.cost_cents * 100) : null,
        status: 'active',
        sort_order: 0
      }

      // Remove category_ids from product data
      const { category_ids, ...productInsertData } = productData

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productInsertData])
        .select()
        .single()

      if (productError) throw productError

      // Add category associations  
      if (category_ids.length > 0) {
        const categoryAssociations = category_ids.map(categoryId => ({
          product_id: product.id,
          category_id: categoryId
        }))

        const { error: categoryError } = await supabase
          .from('product_categories')
          .insert(categoryAssociations)

        if (categoryError) throw categoryError
      }

      toast.success('Product created successfully!')
      router.push(`/admin/products/${product.id}`)
    } catch (error) {
      console.error('Error creating product:', error)
      if ((error as Error).message?.includes('duplicate key')) {
        toast.error('A product with this slug already exists')
      } else {
        toast.error('Failed to create product')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Creating...' : 'Create Product'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="product-url-slug"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <WysiwygEditor
                  content={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Enter product description..."
                  className="min-h-[250px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Product SKU"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={formData.brand_id || undefined} onValueChange={(value) => setFormData({ ...formData, brand_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base_price">Sale Price ($)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    value={formData.base_price_cents}
                    onChange={(e) => setFormData({ ...formData, base_price_cents: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="compare_price">Compare Price ($)</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_price_cents}
                    onChange={(e) => setFormData({ ...formData, compare_price_cents: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost_cents}
                    onChange={(e) => setFormData({ ...formData, cost_cents: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO title (defaults to product name)"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="Comma-separated keywords"
                  />
                </div>
                <div>
                  <Label htmlFor="search_keywords">Search Keywords</Label>
                  <Input
                    id="search_keywords"
                    value={formData.search_keywords}
                    onChange={(e) => setFormData({ ...formData, search_keywords: e.target.value })}
                    placeholder="Additional search terms"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label htmlFor="is_visible">Visible on Store</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow_purchases"
                  checked={formData.allow_purchases}
                  onCheckedChange={(checked) => setFormData({ ...formData, allow_purchases: checked })}
                />
                <Label htmlFor="allow_purchases">Allow Purchases</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                />
                <Label htmlFor="is_new">New Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_on_sale"
                  checked={formData.is_on_sale}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                />
                <Label htmlFor="is_on_sale">On Sale</Label>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) => setFormData({ ...formData, track_inventory: checked })}
                />
                <Label htmlFor="track_inventory">Track Inventory</Label>
              </div>
              {formData.track_inventory && (
                <>
                  <div>
                    <Label htmlFor="stock_level">Stock Level</Label>
                    <Input
                      id="stock_level"
                      type="number"
                      value={formData.stock_level}
                      onChange={(e) => setFormData({ ...formData, stock_level: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="low_stock_level">Low Stock Alert</Label>
                    <Input
                      id="low_stock_level"
                      type="number"
                      value={formData.low_stock_level}
                      onChange={(e) => setFormData({ ...formData, low_stock_level: parseInt(e.target.value) || 0 })}
                      placeholder="5"
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight_grams}
                  onChange={(e) => setFormData({ ...formData, weight_grams: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={formData.category_ids.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}