'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Save, ArrowLeft, Package, DollarSign, Truck, Search, 
  Image as ImageIcon, Tag, Users, Settings, Globe, Star,
  Plus, Trash2, GripVertical, Upload, X
} from 'lucide-react'
import { ProductImagesManager } from '@/components/admin/product-images-manager'

interface ProductEditFormProps {
  product: any
  categories: any[]
  brands: any[]
  customerGroups: any[]
  optionTypes: any[]
}

export function ProductEditForm({ 
  product, 
  categories, 
  brands, 
  customerGroups,
  optionTypes 
}: ProductEditFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  // Form state - initialize with product data
  const [formData, setFormData] = useState({
    // Basic Information
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    status: product.status || 'draft',
    is_visible: product.is_visible ?? true,
    allow_purchases: product.allow_purchases ?? true,
    brand_id: product.brand_id || '',
    
    // Pricing
    base_price_cents: product.base_price_cents || 0,
    compare_price_cents: product.compare_price_cents || 0,
    cost_price_cents: product.cost_price_cents || 0,
    sale_price_cents: product.sale_price_cents || 0,
    
    // Inventory
    sku: product.sku || '',
    track_inventory: product.track_inventory || 'none',
    stock_level: product.stock_level || 0,
    low_stock_level: product.low_stock_level || 5,
    allow_backorders: product.allow_backorders || false,
    
    // Shipping
    weight: product.weight || 0,
    width: product.width || 0,
    height: product.height || 0,
    depth: product.depth || 0,
    requires_shipping: product.requires_shipping ?? true,
    free_shipping: product.free_shipping || false,
    fixed_shipping_price_cents: product.fixed_shipping_price_cents || 0,
    
    // SEO
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    meta_keywords: product.meta_keywords || '',
    search_keywords: product.search_keywords || '',
    
    // Features
    is_featured: product.is_featured || false,
    is_new: product.is_new || false,
    is_on_sale: product.is_on_sale || false,
    is_digital: product.is_digital || false,
    
    // Product Identifiers
    upc: product.upc || '',
    ean: product.ean || '',
    mpn: product.mpn || '',
    gtin: product.gtin || '',
    
    // Purchase Rules
    min_purchase_quantity: product.min_purchase_quantity || 0,
    max_purchase_quantity: product.max_purchase_quantity || 0,
    
    // Other
    warranty: product.warranty || '',
    condition: product.condition || 'new',
    sort_order: product.sort_order || 0,
    tags: product.tags || [],
  })
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product.categories?.map((pc: any) => pc.category.id) || []
  )
  
  const [variants, setVariants] = useState(product.variants || [])
  const [images, setImages] = useState(product.images || [])
  
  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Update main product
      const { error: productError } = await supabase
        .from('products')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
      
      if (productError) throw productError
      
      // Update categories
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', product.id)
      
      if (selectedCategories.length > 0) {
        await supabase
          .from('product_categories')
          .insert(
            selectedCategories.map(categoryId => ({
              product_id: product.id,
              category_id: categoryId
            }))
          )
      }
      
      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/${product.slug}`, '_blank')}
          >
            View Product
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">
            <Package className="h-4 w-4 mr-2" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="media">
            <ImageIcon className="h-4 w-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="variants">
            <Settings className="h-4 w-4 mr-2" />
            Variants
          </TabsTrigger>
        </TabsList>
        
        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core product details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="product-url-slug"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <WysiwygEditor
                  content={formData.description || ''}
                  onChange={(content) => updateField('description', content)}
                  placeholder="Enter product description..."
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={formData.brand_id} onValueChange={(value) => updateField('brand_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => updateField('condition', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Categories</h4>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.id])
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Visibility & Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_visible">Visible on Site</Label>
                    <Switch
                      id="is_visible"
                      checked={formData.is_visible}
                      onCheckedChange={(checked) => updateField('is_visible', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow_purchases">Allow Purchases</Label>
                    <Switch
                      id="allow_purchases"
                      checked={formData.allow_purchases}
                      onCheckedChange={(checked) => updateField('allow_purchases', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured Product</Label>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => updateField('is_featured', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_new">New Product Badge</Label>
                    <Switch
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(checked) => updateField('is_new', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_on_sale">On Sale Badge</Label>
                    <Switch
                      id="is_on_sale"
                      checked={formData.is_on_sale}
                      onCheckedChange={(checked) => updateField('is_on_sale', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_digital">Digital Product</Label>
                    <Switch
                      id="is_digital"
                      checked={formData.is_digital}
                      onCheckedChange={(checked) => updateField('is_digital', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>Set product pricing and discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={(formData.base_price_cents / 100).toFixed(2)}
                      onChange={(e) => updateField('base_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare at Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      value={(formData.compare_price_cents / 100).toFixed(2)}
                      onChange={(e) => updateField('compare_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="sale_price"
                      type="number"
                      step="0.01"
                      value={(formData.sale_price_cents / 100).toFixed(2)}
                      onChange={(e) => updateField('sale_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={(formData.cost_price_cents / 100).toFixed(2)}
                      onChange={(e) => updateField('cost_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Purchase Rules</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_purchase">Minimum Purchase Quantity</Label>
                    <Input
                      id="min_purchase"
                      type="number"
                      value={formData.min_purchase_quantity}
                      onChange={(e) => updateField('min_purchase_quantity', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_purchase">Maximum Purchase Quantity (0 = unlimited)</Label>
                    <Input
                      id="max_purchase"
                      type="number"
                      value={formData.max_purchase_quantity}
                      onChange={(e) => updateField('max_purchase_quantity', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and manage product stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => updateField('sku', e.target.value)}
                    placeholder="Stock keeping unit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="track_inventory">Inventory Tracking</Label>
                  <Select value={formData.track_inventory} onValueChange={(value) => updateField('track_inventory', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Don't track inventory</SelectItem>
                      <SelectItem value="by product">Track by product</SelectItem>
                      <SelectItem value="by variant">Track by variant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.track_inventory !== 'none' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="stock_level">Current Stock</Label>
                      <Input
                        id="stock_level"
                        type="number"
                        value={formData.stock_level}
                        onChange={(e) => updateField('stock_level', parseInt(e.target.value))}
                        disabled={formData.track_inventory === 'by variant'}
                      />
                      {formData.track_inventory === 'by variant' && (
                        <p className="text-xs text-muted-foreground">Stock is managed at variant level</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="low_stock_level">Low Stock Alert Level</Label>
                      <Input
                        id="low_stock_level"
                        type="number"
                        value={formData.low_stock_level}
                        onChange={(e) => updateField('low_stock_level', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-between">
                      <Label htmlFor="allow_backorders">Allow Backorders</Label>
                      <Switch
                        id="allow_backorders"
                        checked={formData.allow_backorders}
                        onCheckedChange={(checked) => updateField('allow_backorders', checked)}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Product Identifiers</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upc">UPC</Label>
                    <Input
                      id="upc"
                      value={formData.upc}
                      onChange={(e) => updateField('upc', e.target.value)}
                      placeholder="Universal Product Code"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ean">EAN</Label>
                    <Input
                      id="ean"
                      value={formData.ean}
                      onChange={(e) => updateField('ean', e.target.value)}
                      placeholder="European Article Number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mpn">MPN</Label>
                    <Input
                      id="mpn"
                      value={formData.mpn}
                      onChange={(e) => updateField('mpn', e.target.value)}
                      placeholder="Manufacturer Part Number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gtin">GTIN</Label>
                    <Input
                      id="gtin"
                      value={formData.gtin}
                      onChange={(e) => updateField('gtin', e.target.value)}
                      placeholder="Global Trade Item Number"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Shipping Tab */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Configure shipping settings and dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requires_shipping">Requires Shipping</Label>
                  <Switch
                    id="requires_shipping"
                    checked={formData.requires_shipping}
                    onCheckedChange={(checked) => updateField('requires_shipping', checked)}
                  />
                </div>
                
                {formData.requires_shipping && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="free_shipping">Free Shipping</Label>
                      <Switch
                        id="free_shipping"
                        checked={formData.free_shipping}
                        onCheckedChange={(checked) => updateField('free_shipping', checked)}
                      />
                    </div>
                    
                    {!formData.free_shipping && (
                      <div className="space-y-2">
                        <Label htmlFor="fixed_shipping">Fixed Shipping Price (optional)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                            id="fixed_shipping"
                            type="number"
                            step="0.01"
                            value={(formData.fixed_shipping_price_cents / 100).toFixed(2)}
                            onChange={(e) => updateField('fixed_shipping_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <h4 className="font-medium">Package Dimensions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (lbs)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => updateField('weight', parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (inches)</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.01"
                          value={formData.width}
                          onChange={(e) => updateField('width', parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (inches)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.01"
                          value={formData.height}
                          onChange={(e) => updateField('height', parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="depth">Depth (inches)</Label>
                        <Input
                          id="depth"
                          type="number"
                          step="0.01"
                          value={formData.depth}
                          onChange={(e) => updateField('depth', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload, reorder, and manage product images</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductImagesManager
                productId={product.id}
                initialImages={images}
                onImagesChange={setImages}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  placeholder="Page title for search results"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="Description for search results"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => updateField('meta_keywords', e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search_keywords">Internal Search Keywords</Label>
                <Input
                  id="search_keywords"
                  value={formData.search_keywords}
                  onChange={(e) => updateField('search_keywords', e.target.value)}
                  placeholder="Keywords for site search"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Manage product variations like size and color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3">SKU</th>
                          <th className="text-left p-3">Options</th>
                          <th className="text-right p-3">Price</th>
                          <th className="text-right p-3">Stock</th>
                          <th className="text-center p-3">Active</th>
                          <th className="text-center p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant: any) => (
                          <tr key={variant.id} className="border-t">
                            <td className="p-3">{variant.sku}</td>
                            <td className="p-3">
                              {variant.option_values && Object.entries(variant.option_values).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="mr-1">
                                  {key}: {value as string}
                                </Badge>
                              ))}
                            </td>
                            <td className="p-3 text-right">${(variant.price_cents / 100).toFixed(2)}</td>
                            <td className="p-3 text-right">{variant.stock}</td>
                            <td className="p-3 text-center">
                              <Switch checked={variant.is_active} />
                            </td>
                            <td className="p-3 text-center">
                              <Button size="sm" variant="ghost">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No variants configured</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}