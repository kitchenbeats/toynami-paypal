'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getImageSrc } from '@/lib/utils/image-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SearchableProductSelect } from '@/components/admin/searchable-product-select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface RaffleData {
  id: number
  slug: string
  name: string
  description: string
  rules_text: string
  status: string
  product_id: number
  total_winners: number
  max_entries_per_user: number
  registration_starts_at: string
  registration_ends_at: string
  draw_date: string
  hero_image_url?: string
  thumbnail_url?: string
  require_email_verification: boolean
  require_previous_purchase: boolean
  min_account_age_days: number
  purchase_window_hours: number
}

interface Product {
  id: number
  name: string
  sku?: string
  base_price_cents?: number
  is_visible: boolean
  image_url?: string
}

interface EditRaffleFormProps {
  raffle: RaffleData
  products: Product[]
}

export default function EditRaffleForm({ raffle, products }: EditRaffleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }
  
  const [formData, setFormData] = useState({
    name: raffle.name,
    slug: raffle.slug,
    description: raffle.description || '',
    rules_text: raffle.rules_text || '',
    product_id: raffle.product_id.toString(),
    total_winners: raffle.total_winners.toString(),
    max_entries_per_user: raffle.max_entries_per_user.toString(),
    registration_starts_at: formatDateTime(raffle.registration_starts_at),
    registration_ends_at: formatDateTime(raffle.registration_ends_at),
    draw_date: formatDateTime(raffle.draw_date),
    hero_image_url: raffle.hero_image_url || '',
    thumbnail_url: raffle.thumbnail_url || '',
    require_email_verification: raffle.require_email_verification,
    require_previous_purchase: raffle.require_previous_purchase,
    min_account_age_days: raffle.min_account_age_days.toString(),
    purchase_window_hours: raffle.purchase_window_hours.toString()
  })
  
  const canEditSchedule = raffle.status === 'upcoming'
  const canEditSettings = ['upcoming', 'open'].includes(raffle.status)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      const updateData: Partial<RaffleData> = {
        name: formData.name,
        description: formData.description,
        rules_text: formData.rules_text,
        hero_image_url: formData.hero_image_url || null,
        thumbnail_url: formData.thumbnail_url || null
      }
      
      // Only update certain fields if raffle hasn't started
      if (canEditSettings) {
        updateData.product_id = parseInt(formData.product_id)
        updateData.total_winners = parseInt(formData.total_winners)
        updateData.max_entries_per_user = parseInt(formData.max_entries_per_user)
        updateData.require_email_verification = formData.require_email_verification
        updateData.require_previous_purchase = formData.require_previous_purchase
        updateData.min_account_age_days = parseInt(formData.min_account_age_days)
        updateData.purchase_window_hours = parseInt(formData.purchase_window_hours)
      }
      
      // Only update schedule if raffle is upcoming
      if (canEditSchedule) {
        updateData.registration_starts_at = formData.registration_starts_at
        updateData.registration_ends_at = formData.registration_ends_at
        updateData.draw_date = formData.draw_date
      }
      
      const { error: updateError } = await supabase
        .from('raffles')
        .update(updateData)
        .eq('id', raffle.id)
      
      if (updateError) throw updateError
      
      toast.success('Raffle updated successfully!')
      router.push('/admin/raffles')
    } catch (err) {
      console.error('Error updating raffle:', err)
      setError(err instanceof Error ? err.message : 'Failed to update raffle')
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      upcoming: 'secondary',
      open: 'success',
      closed: 'destructive',
      drawing: 'warning',
      drawn: 'default'
    }
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Status Banner */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              {getStatusBadge(raffle.status)}
            </div>
            {!canEditSettings && (
              <p className="text-sm text-orange-600">
                Some fields are locked because the raffle has started
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Raffle Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL slugs cannot be changed after creation
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="product">Selected Product</Label>
            {canEditSettings ? (
              <SearchableProductSelect
                products={products}
                value={formData.product_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                placeholder="Search and select a product..."
                required
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border flex items-center gap-3">
                {(() => {
                  const product = products.find(p => p.id.toString() === formData.product_id)
                  if (!product) return 'Product not found'
                  
                  return (
                    <>
                      {product.image_url && (
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={getImageSrc(product.image_url)}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.base_price_cents !== undefined && product.base_price_cents > 0 && (
                          <div className="text-sm text-gray-500">
                            ${(product.base_price_cents / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Raffle Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Raffle Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="winners">Total Winners</Label>
              <Input
                id="winners"
                type="number"
                min="1"
                value={formData.total_winners}
                onChange={(e) => setFormData(prev => ({ ...prev, total_winners: e.target.value }))}
                disabled={!canEditSettings}
                className={!canEditSettings ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="max_entries">Max Entries Per User</Label>
              <Input
                id="max_entries"
                type="number"
                min="1"
                value={formData.max_entries_per_user}
                onChange={(e) => setFormData(prev => ({ ...prev, max_entries_per_user: e.target.value }))}
                disabled={!canEditSettings}
                className={!canEditSettings ? 'bg-gray-50' : ''}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="purchase_window">Purchase Window (hours)</Label>
            <Input
              id="purchase_window"
              type="number"
              min="1"
              value={formData.purchase_window_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_window_hours: e.target.value }))}
              disabled={!canEditSettings}
              className={!canEditSettings ? 'bg-gray-50' : ''}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="start">Registration Opens</Label>
            <Input
              id="start"
              type="datetime-local"
              value={formData.registration_starts_at}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_starts_at: e.target.value }))}
              disabled={!canEditSchedule}
              className={!canEditSchedule ? 'bg-gray-50' : ''}
            />
          </div>
          
          <div>
            <Label htmlFor="end">Registration Closes</Label>
            <Input
              id="end"
              type="datetime-local"
              value={formData.registration_ends_at}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_ends_at: e.target.value }))}
              disabled={!canEditSchedule}
              className={!canEditSchedule ? 'bg-gray-50' : ''}
            />
          </div>
          
          <div>
            <Label htmlFor="draw">Drawing Date</Label>
            <Input
              id="draw"
              type="datetime-local"
              value={formData.draw_date}
              onChange={(e) => setFormData(prev => ({ ...prev, draw_date: e.target.value }))}
              disabled={!canEditSchedule}
              className={!canEditSchedule ? 'bg-gray-50' : ''}
            />
          </div>
          
          {!canEditSchedule && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Schedule cannot be changed after raffle has started
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Eligibility Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_verification">Require Email Verification</Label>
              <p className="text-sm text-gray-500">Users must have verified email addresses</p>
            </div>
            <Switch
              id="email_verification"
              checked={formData.require_email_verification}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, require_email_verification: checked }))
              }
              disabled={!canEditSettings}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="previous_purchase">Require Previous Purchase</Label>
              <p className="text-sm text-gray-500">Users must have completed at least one order</p>
            </div>
            <Switch
              id="previous_purchase"
              checked={formData.require_previous_purchase}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, require_previous_purchase: checked }))
              }
              disabled={!canEditSettings}
            />
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="account_age">Minimum Account Age (days)</Label>
            <Input
              id="account_age"
              type="number"
              min="0"
              value={formData.min_account_age_days}
              onChange={(e) => setFormData(prev => ({ ...prev, min_account_age_days: e.target.value }))}
              disabled={!canEditSettings}
              className={!canEditSettings ? 'bg-gray-50' : ''}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero">Hero Image URL</Label>
            <Input
              id="hero"
              type="url"
              value={formData.hero_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Raffle Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.rules_text}
            onChange={(e) => setFormData(prev => ({ ...prev, rules_text: e.target.value }))}
            rows={10}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/raffles')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}