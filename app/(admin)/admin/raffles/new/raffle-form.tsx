'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SearchableProductSelect } from '@/components/admin/searchable-product-select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, AlertCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Product {
  id: number
  name: string
  sku: string
  base_price_cents: number
  is_active: boolean
}

interface RaffleFormProps {
  products: Product[]
}

interface FormData {
  name: string
  slug: string
  description: string
  rules_text: string
  product_id: string
  total_winners: string
  max_entries_per_user: string
  registration_starts_at: string
  registration_ends_at: string
  draw_date: string
  hero_image_url: string
  thumbnail_url: string
  require_email_verification: boolean
  require_previous_purchase: boolean
  min_account_age_days: string
  purchase_window_hours: string
}

const defaultRules = `1. One entry per person. Multiple entries will be disqualified.
2. Winners will be selected randomly using our automated system.
3. Winners will be notified via email within 24 hours of the drawing.
4. Winners have 48 hours to complete their purchase or the opportunity will be offered to an alternate winner.
5. This raffle is for the opportunity to purchase, not a giveaway.
6. Must be 18 years or older to enter.
7. Shipping restrictions may apply based on location.
8. Toynami reserves the right to cancel or modify this raffle at any time.`

export default function RaffleForm({ products }: RaffleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    rules_text: defaultRules,
    product_id: '',
    total_winners: '1',
    max_entries_per_user: '1',
    registration_starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    registration_ends_at: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    draw_date: format(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    hero_image_url: '',
    thumbnail_url: '',
    require_email_verification: true,
    require_previous_purchase: false,
    min_account_age_days: '0',
    purchase_window_hours: '48'
  })
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Validate required fields
      if (!formData.name) {
        throw new Error('Please enter a raffle name')
      }
      if (!formData.slug) {
        throw new Error('Please enter a URL slug')
      }
      if (!formData.product_id) {
        throw new Error('Please select a product for this raffle')
      }
      if (formData.product_id && isNaN(parseInt(formData.product_id))) {
        throw new Error('Invalid product ID selected')
      }
      
      // Check if slug already exists
      const { data: existing, error: slugCheckError } = await supabase
        .from('raffles')
        .select('id')
        .eq('slug', formData.slug)
        .maybeSingle()
      
      if (slugCheckError && slugCheckError.code !== 'PGRST116') {
        console.error('Error checking slug:', slugCheckError)
        throw new Error(`Error checking slug availability: ${slugCheckError.message}`)
      }
      
      if (existing) {
        throw new Error(`A raffle with slug "${formData.slug}" already exists. Please choose a different slug.`)
      }
      
      // Create the raffle
      const { data, error: createError } = await supabase
        .from('raffles')
        .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          rules_text: formData.rules_text,
          product_id: parseInt(formData.product_id),
          status: 'upcoming',
          total_winners: parseInt(formData.total_winners),
          max_entries_per_user: parseInt(formData.max_entries_per_user),
          registration_starts_at: formData.registration_starts_at,
          registration_ends_at: formData.registration_ends_at,
          draw_date: formData.draw_date,
          hero_image_url: formData.hero_image_url || null,
          thumbnail_url: formData.thumbnail_url || null,
          require_email_verification: formData.require_email_verification,
          require_previous_purchase: formData.require_previous_purchase,
          min_account_age_days: parseInt(formData.min_account_age_days),
          purchase_window_hours: parseInt(formData.purchase_window_hours)
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Supabase error creating raffle:', {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code
        })
        throw createError
      }
      
      if (!data) {
        throw new Error('No data returned from raffle creation')
      }
      
      toast.success('Raffle created successfully!')
      router.push('/admin/raffles')
    } catch (err) {
      // Log full error details
      console.error('Error creating raffle - Full details:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        formData: {
          ...formData,
          product_id: formData.product_id ? `Selected: ${formData.product_id}` : 'NOT SELECTED'
        }
      })
      
      // Show user-friendly error message
      let errorMessage = 'Failed to create raffle'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message)
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="sticky top-4 z-10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Creating Raffle</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Limited Edition Figure Raffle"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="limited-edition-figure"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /contests/raffles/{formData.slug || 'slug'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter for a chance to purchase this exclusive limited edition item..."
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
            <Label htmlFor="product">Select Product *</Label>
            <SearchableProductSelect
              products={products}
              value={formData.product_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
              placeholder="Search and select a product..."
              required
            />
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
              <Label htmlFor="winners">Total Winners *</Label>
              <Input
                id="winners"
                type="number"
                min="1"
                value={formData.total_winners}
                onChange={(e) => setFormData(prev => ({ ...prev, total_winners: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="max_entries">Max Entries Per User *</Label>
              <Input
                id="max_entries"
                type="number"
                min="1"
                value={formData.max_entries_per_user}
                onChange={(e) => setFormData(prev => ({ ...prev, max_entries_per_user: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="purchase_window">Purchase Window (hours) *</Label>
            <Input
              id="purchase_window"
              type="number"
              min="1"
              value={formData.purchase_window_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_window_hours: e.target.value }))}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              How long winners have to complete their purchase
            </p>
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
            <Label htmlFor="start">Registration Opens *</Label>
            <Input
              id="start"
              type="datetime-local"
              value={formData.registration_starts_at}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_starts_at: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="end">Registration Closes *</Label>
            <Input
              id="end"
              type="datetime-local"
              value={formData.registration_ends_at}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_ends_at: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="draw">Drawing Date *</Label>
            <Input
              id="draw"
              type="datetime-local"
              value={formData.draw_date}
              onChange={(e) => setFormData(prev => ({ ...prev, draw_date: e.target.value }))}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              When the live drawing will take place
            </p>
          </div>
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
            />
            <p className="text-sm text-gray-500 mt-1">
              Set to 0 to disable account age requirement
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Images (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Images (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero">Hero Image URL</Label>
            <Input
              id="hero"
              type="url"
              value={formData.hero_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
              placeholder="https://example.com/hero.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
              placeholder="https://example.com/thumb.jpg"
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
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Raffle
            </>
          )}
        </Button>
      </div>
    </form>
  )
}