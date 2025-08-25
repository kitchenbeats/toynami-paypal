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
  Pencil, 
  Trash2, 
  Plus, 
  GripVertical, 
  // Save, 
  // X, 
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  // Upload,
  ExternalLink,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Brand, BrandFormData } from '@/lib/types/admin'
import { MediaSelector } from '@/components/ui/media-selector'
import { MediaItem } from '@/lib/types/media'

interface EnhancedBrandsManagerProps {
  initialBrands: Brand[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function EnhancedBrandsManager({ 
  initialBrands, 
  totalCount, 
  currentPage = 1, 
  pageSize = 20 
}: EnhancedBrandsManagerProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    website_url: '',
    is_featured: false,
    is_visible: true,
    display_order: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Transition state removed - not currently used
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // Filter brands based on search
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required'
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
    
    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Handle create
  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      website_url: '',
      is_featured: false,
      is_visible: true,
      display_order: brands.length,
    })
    setErrors({})
    setIsCreateDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logo_url: brand.logo_url || '',
      website_url: brand.website_url || '',
      is_featured: brand.is_featured || false,
      is_visible: brand.is_visible !== false,
      display_order: brand.display_order || 0,
    })
    setErrors({})
    setIsEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteDialogOpen(true)
  }

  // Save brand (create or update)
  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      if (isCreateDialogOpen) {
        // Create new brand
        const { data, error } = await supabase
          .from('brands')
          .insert([formData])
          .select()
          .single()
        
        if (error) throw error
        
        setBrands([...brands, data])
        toast.success('Brand created successfully')
        setIsCreateDialogOpen(false)
      } else if (isEditDialogOpen && selectedBrand) {
        // Update existing brand
        const { data, error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', selectedBrand.id)
          .select()
          .single()
        
        if (error) throw error
        
        setBrands(brands.map(b => b.id === selectedBrand.id ? data : b))
        toast.success('Brand updated successfully')
        setIsEditDialogOpen(false)
      }
      
      router.refresh()
    } catch (error: unknown) {
      console.error('Error saving brand:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save brand')
    } finally {
      setIsLoading(false)
    }
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBrand) return
    
    setIsLoading(true)
    try {
      // Check if brand has products
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id)
      
      if (count && count > 0) {
        toast.error(`Cannot delete brand with ${count} associated products`)
        return
      }
      
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', selectedBrand.id)
      
      if (error) throw error
      
      setBrands(brands.filter(b => b.id !== selectedBrand.id))
      toast.success('Brand deleted successfully')
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error: unknown) {
      console.error('Error deleting brand:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete brand')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle featured status
  const toggleFeatured = async (brand: Brand) => {
    try {
      const { error } = await supabase
        .from('brands')
        .update({ is_featured: !brand.is_featured })
        .eq('id', brand.id)
      
      if (error) throw error
      
      setBrands(brands.map(b => 
        b.id === brand.id ? { ...b, is_featured: !b.is_featured } : b
      ))
      toast.success(`Brand ${brand.is_featured ? 'unfeatured' : 'featured'}`)
    } catch (error: unknown) {
      console.error('Error toggling featured:', error)
      toast.error('Failed to update featured status')
    }
  }

  // Toggle visibility
  const toggleVisibility = async (brand: Brand) => {
    try {
      const { error } = await supabase
        .from('brands')
        .update({ is_visible: !brand.is_visible })
        .eq('id', brand.id)
      
      if (error) throw error
      
      setBrands(brands.map(b => 
        b.id === brand.id ? { ...b, is_visible: !b.is_visible } : b
      ))
      toast.success(`Brand ${brand.is_visible ? 'hidden' : 'shown'}`)
    } catch (error: unknown) {
      console.error('Error toggling visibility:', error)
      toast.error('Failed to update visibility')
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page.toString())
    router.push(`/admin/brands?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Badge variant="secondary">
            {filteredBrands.length} of {totalCount} brands
          </Badge>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Brand
        </Button>
      </div>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Management</CardTitle>
          <CardDescription>
            Manage your product brands and their display settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="ml-2 text-sm">{brand.display_order}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {brand.logo_url && (
                        <img 
                          src={brand.logo_url} 
                          alt={brand.name}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        {brand.website_url && (
                          <a 
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {brand.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(brand)}
                    >
                      <Star 
                        className={`h-4 w-4 ${
                          brand.is_featured 
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
                      onClick={() => toggleVisibility(brand)}
                    >
                      {brand.is_visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {brand.product_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(brand)}
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
                Showing {startIndex + 1} to {Math.min(endIndex, totalCount)} of {totalCount} brands
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Brand</DialogTitle>
            <DialogDescription>
              Add a new brand to your store catalog
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Robotech"
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
                  placeholder="e.g., robotech"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brand description..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Brand Logo</label>
                <MediaSelector
                  value={formData.logo_url}
                  onChange={(media: MediaItem | null) => {
                    setFormData({ ...formData, logo_url: media?.file_url || '' })
                  }}
                  mimeTypeFilter="image/"
                  folderFilter="brands"
                  buttonText="Select Brand Logo"
                  buttonVariant="outline"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                  className={errors.website_url ? 'border-red-500' : ''}
                />
                {errors.website_url && (
                  <p className="text-sm text-red-500 mt-1">{errors.website_url}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    display_order: parseInt(e.target.value) || 0 
                  })}
                  min="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Brand'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Update brand information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Brand Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Robotech"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-slug">URL Slug *</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  placeholder="e.g., robotech"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brand description..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Brand Logo</label>
                <MediaSelector
                  value={formData.logo_url}
                  onChange={(media: MediaItem | null) => {
                    setFormData({ ...formData, logo_url: media?.file_url || '' })
                  }}
                  mimeTypeFilter="image/"
                  folderFilter="brands"
                  buttonText="Select Brand Logo"
                  buttonVariant="outline"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-website_url">Website URL</Label>
                <Input
                  id="edit-website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                  className={errors.website_url ? 'border-red-500' : ''}
                />
                {errors.website_url && (
                  <p className="text-sm text-red-500 mt-1">{errors.website_url}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label htmlFor="edit-visible">Visible</Label>
              </div>
              <div>
                <Label htmlFor="edit-display_order">Display Order</Label>
                <Input
                  id="edit-display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    display_order: parseInt(e.target.value) || 0 
                  })}
                  min="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Brand'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand &quot;{selectedBrand?.name}&quot;. 
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
                'Delete Brand'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}