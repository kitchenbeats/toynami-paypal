import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import RaffleForm from './raffle-form'

export const metadata: Metadata = {
  title: 'Create New Raffle | Admin',
  description: 'Create a new product raffle'
}

interface Product {
  id: number
  name: string
  sku?: string
  base_price_cents?: number
  is_visible: boolean
  image_url?: string
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

export default async function NewRafflePage() {
  const products = await getProducts()
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Raffle</h1>
        <p className="text-gray-600">Set up a new product raffle for limited releases</p>
      </div>
      
      <div className="max-w-2xl">
        <RaffleForm products={products} />
      </div>
    </div>
  )
}