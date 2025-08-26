import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditRaffleForm from './edit-raffle-form'

interface EditPageProps {
  params: Promise<{ slug: string }>
}

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

async function getRaffle(slug: string): Promise<RaffleData | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffles')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return data
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('id, name, sku, base_price_cents')
    .eq('is_visible', true)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('name')
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  // Get images for each product
  const productsWithImages = await Promise.all((data || []).map(async (product) => {
    // Get first gallery image from media_usage
    const { data: mediaData } = await supabase
      .from('media_usage')
      .select(`
        field_name,
        media:media_library (
          file_url
        )
      `)
      .eq('entity_type', 'product')
      .eq('entity_id', product.id.toString())
      .order('field_name')
      .limit(1)
    
    return {
      id: product.id,
      name: product.name || 'Unnamed Product',
      sku: product.sku || `PROD-${product.id}`,
      base_price_cents: product.base_price_cents || 0,
      is_visible: true,
      image_url: mediaData?.[0]?.media?.file_url || null
    }
  }))
  
  return productsWithImages
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  return {
    title: raffle ? `Edit ${raffle.name} | Admin` : 'Edit Raffle',
    description: 'Edit raffle details'
  }
}

export default async function EditRafflePage({ params }: EditPageProps) {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    notFound()
  }
  
  const products = await getProducts()
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Raffle</h1>
        <p className="text-gray-600">Update raffle details and settings</p>
      </div>
      
      <div className="max-w-2xl">
        <EditRaffleForm raffle={raffle} products={products} />
      </div>
    </div>
  )
}