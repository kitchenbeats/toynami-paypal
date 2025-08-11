'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  ArrowUpDown, 
  Save,
  Loader2,
  Package,
  Image as ImageIcon,
  Hash
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  sku?: string
  status: string
  is_featured: boolean
  is_visible: boolean
  sort_order: number
  price_cents?: number
  stock_level?: number
  variants?: any[]
  images?: any[]
  categories?: any[]
}

interface ProductsManagerProps {
  initialProducts: Product[]
  lastSync?: any
}

export function ProductsManager({ initialProducts, lastSync }: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    setLoading(productId)
    setMessage('')
    
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
      
      if (error) throw error
      
      // Update local state
      setProducts(products.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      ))
      
      setMessage('Product updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating product:', error)
      setMessage('Failed to update product')
    } finally {
      setLoading(null)
    }
  }

  const toggleFeatured = (productId: string, currentValue: boolean) => {
    updateProduct(productId, { is_featured: !currentValue })
  }

  const updateSortOrder = (productId: string, value: string) => {
    const sortOrder = parseInt(value) || 0
    updateProduct(productId, { sort_order: sortOrder })
  }

  const toggleVisible = (productId: string, currentValue: boolean) => {
    updateProduct(productId, { is_visible: !currentValue })
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('success') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sort Order
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visible
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.sku || product.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Badge variant={
                    product.status === 'active' ? 'default' : 
                    product.status === 'draft' ? 'secondary' : 'destructive'
                  }>
                    {product.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    variant={product.is_featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeatured(product.id, product.is_featured)}
                    disabled={loading === product.id}
                  >
                    {loading === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className={`h-4 w-4 ${product.is_featured ? 'fill-current' : ''}`} />
                    )}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Input
                    type="number"
                    value={product.sort_order || 0}
                    onChange={(e) => updateSortOrder(product.id, e.target.value)}
                    className="w-20 text-center"
                    min="0"
                    disabled={loading === product.id}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Checkbox
                    checked={product.is_visible}
                    onCheckedChange={() => toggleVisible(product.id, product.is_visible)}
                    disabled={loading === product.id}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900">
                    {product.stock_level || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Package className="h-3 w-3 mr-1" />
                      {product.variants?.length || 0}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {product.images?.length || 0}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-gray-500">
        Showing {products.length} products. 
        {products.filter(p => p.is_featured).length} featured products.
      </div>
    </div>
  )
}