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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { 
  Product, 
  ProductFormData, 
  ProductVariantFormData,
  Category,
  Brand,
  GlobalOption
} from '@/lib/types/admin'

interface EnhancedProductsManagerProps {
  initialProducts: Product[]
  categories: Category[]
  brands: Brand[]
  globalOptions?: GlobalOption[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function EnhancedProductsManager({
  initialProducts,
  categories,
  brands,
  // globalOptions not currently used
  totalCount,
  currentPage = 1,
  pageSize = 20
}: EnhancedProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterBrand, setFilterBrand] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  // Variant dialog state removed - not currently used
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    sku: '',
    description: '',
    brand_id: '',
    status: 'draft',
    is_featured: false,
    is_visible: true,
    is_new: false,
    sort_order: 0,
    base_price_cents: 0,
    compare_at_price_cents: 0,
    stock_level: 0,
    track_inventory: 'none',
    allow_purchases: true,
    min_purchase_quantity: 1,
    max_purchase_quantity: undefined,
    preorder_release_date: '',
    preorder_message: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    categories: [],
    images: [],
    variants: [],
    options: []
  })
  const [variants, setVariants] = useState<ProductVariantFormData[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Transition state removed - not currently used
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    const matchesCategory = filterCategory === 'all' || 
      product.categories?.some(c => c.category_id === filterCategory)
    const matchesBrand = filterBrand === 'all' || product.brand_id === filterBrand
    
    return matchesSearch && matchesStatus && matchesCategory && matchesBrand
  })

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
    
    if (formData.base_price_cents < 0) {
      newErrors.price = 'Price cannot be negative'
    }
    
    if (formData.stock_level < 0) {
      newErrors.stock = 'Stock cannot be negative'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle create
  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      sku: '',
      description: '',
      brand_id: '',
      status: 'draft',
      is_featured: false,
      is_visible: true,
      is_new: false,
      sort_order: products.length,
      base_price_cents: 0,
      compare_at_price_cents: 0,
      stock_level: 0,
      track_inventory: 'none',
      allow_purchases: true,
      min_purchase_quantity: 1,
      max_purchase_quantity: undefined,
      preorder_release_date: '',
      preorder_message: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      categories: [],
      images: [],
      variants: [],
      options: []
    })
    setVariants([])
    setUploadedImages([])
    setErrors({})
    setIsCreateDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      description: product.description || '',
      brand_id: product.brand_id || '',
      status: product.status,
      is_featured: product.is_featured || false,
      is_visible: product.is_visible !== false,
      is_new: product.is_new || false,
      sort_order: product.sort_order || 0,
      base_price_cents: product.base_price_cents || 0,
      compare_at_price_cents: product.compare_at_price_cents || 0,
      stock_level: product.stock_level || 0,
      track_inventory: product.track_inventory || 'none',
      allow_purchases: product.allow_purchases !== false,
      min_purchase_quantity: product.min_purchase_quantity || 1,
      max_purchase_quantity: product.max_purchase_quantity,
      preorder_release_date: product.preorder_release_date || '',
      preorder_message: product.preorder_message || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: product.meta_keywords || '',
      categories: product.categories?.map(c => c.category_id) || [],
      images: [],
      variants: [],
      options: product.options?.map(o => o.option_id) || []
    })
    setVariants(product.variants?.map(v => ({
      sku: v.sku,
      price_cents: v.price_cents,
      compare_at_price_cents: v.compare_at_price_cents,
      stock: v.stock,
      is_active: v.is_active,
      option_values: v.option_values || {}
    })) || [])
    setUploadedImages(product.images?.map(i => i.image_filename) || [])
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  // Save product
  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      if (isCreateDialogOpen) {
        // Create product
        const { data: product, error } = await supabase
          .from('products')
          .insert([{
            ...formData,
            base_price_cents: Math.round(formData.base_price_cents * 100),
            compare_at_price_cents: formData.compare_at_price_cents ? 
              Math.round(formData.compare_at_price_cents * 100) : null
          }])
          .select()
          .single()
        
        if (error) throw error
        
        // Add categories
        if (formData.categories.length > 0) {
          await supabase
            .from('product_categories')
            .insert(
              formData.categories.map(cat_id => ({
                product_id: product.id,
                category_id: cat_id
              }))
            )
        }
        
        // Add images to media library and link to product
        if (uploadedImages.length > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          
          for (let idx = 0; idx < uploadedImages.length; idx++) {
            const url = uploadedImages[idx];
            const fileName = url.split('/').pop() || `product-${product.id}-${idx}`;
            
            // Insert into media library
            const { data: mediaData } = await supabase
              .from('media_library')
              .insert({
                filename: fileName,
                original_name: fileName,
                file_path: url,
                file_url: url,
                folder: 'products',
                uploaded_by: user?.id
              })
              .select()
              .single();
            
            if (mediaData) {
              // Create media usage link
              await supabase
                .from('media_usage')
                .insert({
                  media_id: mediaData.id,
                  entity_type: 'product',
                  entity_id: product.id.toString(),
                  field_name: idx === 0 ? 'primary_image' : `gallery_image_${idx}`
                });
            }
          }
        }
        
        // Add variants
        if (variants.length > 0) {
          await supabase
            .from('product_variants')
            .insert(
              variants.map(v => ({
                product_id: product.id,
                ...v,
                price_cents: Math.round(v.price_cents * 100),
                compare_at_price_cents: v.compare_at_price_cents ? 
                  Math.round(v.compare_at_price_cents * 100) : null
              }))
            )
        }
        
        setProducts([...products, product])
        toast.success('Product created successfully')
        setIsCreateDialogOpen(false)
      } else if (isEditDialogOpen && selectedProduct) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            base_price_cents: Math.round(formData.base_price_cents * 100),
            compare_at_price_cents: formData.compare_at_price_cents ? 
              Math.round(formData.compare_at_price_cents * 100) : null
          })
          .eq('id', selectedProduct.id)
        
        if (error) throw error
        
        // Update categories
        await supabase
          .from('product_categories')
          .delete()
          .eq('product_id', selectedProduct.id)
        
        if (formData.categories.length > 0) {
          await supabase
            .from('product_categories')
            .insert(
              formData.categories.map(cat_id => ({
                product_id: selectedProduct.id,
                category_id: cat_id
              }))
            )
        }
        
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        ))
        toast.success('Product updated successfully')
        setIsEditDialogOpen(false)
      }
      
      router.refresh()
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedProduct) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', selectedProduct.id)
      
      if (error) throw error
      
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      toast.success('Product deleted successfully')
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error: unknown) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle featured
  const toggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !product.is_featured })
        .eq('id', product.id)
      
      if (error) throw error
      
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
      ))
      toast.success(`Product ${product.is_featured ? 'unfeatured' : 'featured'}`)
    } catch {
      toast.error('Failed to update featured status')
    }
  }

  // Toggle visibility
  const toggleVisibility = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: !product.is_visible })
        .eq('id', product.id)
      
      if (error) throw error
      
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_visible: !p.is_visible } : p
      ))
      toast.success(`Product ${product.is_visible ? 'hidden' : 'shown'}`)
    } catch {
      toast.error('Failed to update visibility')
    }
  }

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      toast.error('No products selected')
      return
    }
    
    if (!confirm(`Delete ${selectedProducts.size} products?`)) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .in('id', Array.from(selectedProducts))
      
      if (error) throw error
      
      setProducts(products.filter(p => !selectedProducts.has(p.id)))
      setSelectedProducts(new Set())
      toast.success(`${selectedProducts.size} products deleted`)
      router.refresh()
    } catch (error: unknown) {
      console.error('Error deleting products:', error)
      toast.error('Failed to delete products')
    } finally {
      setIsLoading(false)
    }
  }

  // Sync with PayPal
  const syncWithPayPal = async (productId?: string) => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/paypal/products/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      
      if (!response.ok) throw new Error('Sync failed')
      
      const result = await response.json()
      toast.success(result.message || 'Products synced with PayPal')
      router.refresh()
    } catch {
      toast.error('Failed to sync with PayPal')
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      
      return publicUrl
    })
    
    try {
      const urls = await Promise.all(uploadPromises)
      setUploadedImages([...uploadedImages, ...urls])
      toast.success(`${files.length} images uploaded`)
    } catch {
      toast.error('Failed to upload images')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selectedProducts.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                Delete {selectedProducts.size} Items
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => syncWithPayPal()}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync with PayPal
                </>
              )}
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.is_featured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => (p.stock_level || 0) === 0).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pre-orders</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.preorder_release_date).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">With Variants</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.variants && p.variants.length > 0).length}
                  </p>
                </div>
                <Copy className="h-8 w-8 text-purple-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Manage your product inventory and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
                      } else {
                        setSelectedProducts(new Set())
                      }
                    }}
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedProducts)
                        if (e.target.checked) {
                          newSelected.add(product.id)
                        } else {
                          newSelected.delete(product.id)
                        }
                        setSelectedProducts(newSelected)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img 
                          src={product.images[0].image_filename} 
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{product.sku || '-'}</code>
                  </TableCell>
                  <TableCell>
                    {product.categories?.map(c => (
                      <Badge key={c.category_id} variant="outline" className="mr-1">
                        {c.category?.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    ${((product.base_price_cents || 0) / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.stock_level === 0 ? 'destructive' : 'default'}>
                      {product.stock_level || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                      product.status === 'active' ? 'default' : 
                      product.status === 'draft' ? 'secondary' : 'destructive'
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(product)}
                    >
                      <Star 
                        className={`h-4 w-4 ${
                          product.is_featured 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(product)}
                    >
                      {product.is_visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, totalCount)} of {totalCount} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/products?page=${currentPage - 1}`)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage - 2 + i
                    if (page < 1 || page > totalPages) return null
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => router.push(`/admin/products?page=${page}`)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  }).filter(Boolean)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/products?page=${currentPage + 1}`)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? 'Create New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen 
                ? 'Add a new product to your catalog' 
                : 'Update product information and settings'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
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
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: unknown) => setFormData({ ...formData, status: value })}
                  >
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
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select 
                    value={formData.brand_id} 
                    onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="categories">Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ 
                                ...formData, 
                                categories: [...formData.categories, cat.id]
                              })
                            } else {
                              setFormData({ 
                                ...formData, 
                                categories: formData.categories.filter(c => c !== cat.id)
                              })
                            }
                          }}
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                  />
                  <Label htmlFor="visible">Visible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label htmlFor="new">New Product</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.base_price_cents / 100}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        base_price_cents: parseFloat(e.target.value) || 0
                      })}
                      className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="compare_price">Compare at Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      value={(formData.compare_at_price_cents || 0) / 100}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        compare_at_price_cents: parseFloat(e.target.value) || 0
                      })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow_purchases"
                  checked={formData.allow_purchases}
                  onCheckedChange={(checked) => setFormData({ ...formData, allow_purchases: checked })}
                />
                <Label htmlFor="allow_purchases">Allow Purchases</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_quantity">Minimum Purchase Quantity</Label>
                  <Input
                    id="min_quantity"
                    type="number"
                    min="1"
                    value={formData.min_purchase_quantity}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      min_purchase_quantity: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_quantity">Maximum Purchase Quantity</Label>
                  <Input
                    id="max_quantity"
                    type="number"
                    min="1"
                    value={formData.max_purchase_quantity || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      max_purchase_quantity: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <div>
                <Label htmlFor="track_inventory">Track Inventory</Label>
                <Select 
                  value={formData.track_inventory} 
                  onValueChange={(value: unknown) => setFormData({ ...formData, track_inventory: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Don&apos;t Track</SelectItem>
                    <SelectItem value="by product">Track by Product</SelectItem>
                    <SelectItem value="by variant">Track by Variant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.track_inventory === 'by product' && (
                <div>
                  <Label htmlFor="stock">Stock Level</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_level}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stock_level: parseInt(e.target.value) || 0
                    })}
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preorder_date">Pre-order Release Date</Label>
                  <Input
                    id="preorder_date"
                    type="date"
                    value={formData.preorder_release_date}
                    onChange={(e) => setFormData({ ...formData, preorder_release_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="preorder_message">Pre-order Message</Label>
                  <Input
                    id="preorder_message"
                    value={formData.preorder_message}
                    onChange={(e) => setFormData({ ...formData, preorder_message: e.target.value })}
                    placeholder="Expected to ship in..."
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </span>
                  </label>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img 
                          src={url} 
                          alt={`Product ${idx + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {idx === 0 && (
                          <Badge className="absolute bottom-1 left-1">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="variants" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Product Variants</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setVariants([...variants, {
                      sku: '',
                      price_cents: formData.base_price_cents,
                      compare_at_price_cents: formData.compare_at_price_cents,
                      stock: 0,
                      is_active: true,
                      option_values: {}
                    }])
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variant
                </Button>
              </div>
              
              {variants.map((variant, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>SKU</Label>
                        <Input
                          value={variant.sku}
                          onChange={(e) => {
                            const newVariants = [...variants]
                            newVariants[idx].sku = e.target.value
                            setVariants(newVariants)
                          }}
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price_cents / 100}
                          onChange={(e) => {
                            const newVariants = [...variants]
                            newVariants[idx].price_cents = parseFloat(e.target.value) || 0
                            setVariants(newVariants)
                          }}
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const newVariants = [...variants]
                            newVariants[idx].stock = parseInt(e.target.value) || 0
                            setVariants(newVariants)
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={variant.is_active}
                          onCheckedChange={(checked) => {
                            const newVariants = [...variants]
                            newVariants[idx].is_active = checked
                            setVariants(newVariants)
                          }}
                        />
                        <Label>Active</Label>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Page title for search engines"
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Page description for search engines"
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
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false)
              setIsEditDialogOpen(false)
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateDialogOpen ? 'Create Product' : 'Update Product'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &quot;{selectedProduct?.name}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}