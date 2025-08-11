import { createClient } from '@/lib/supabase/server'
import { ProductDetailClient } from './product-detail-client'
import { notFound } from 'next/navigation'

interface ProductDetailServerProps {
  slug: string
}

async function getProduct(slug: string) {
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(
        id,
        price_cents,
        compare_at_price_cents,
        stock,
        sku,
        is_active
      ),
      images:product_images(
        image_filename,
        alt_text,
        is_primary,
        position
      ),
      categories:product_categories(
        category:categories(name, slug)
      ),
      brand:brands!brand_id(name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)
    .single()

  return product
}

export async function ProductDetailServer({ slug }: ProductDetailServerProps) {
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  // Transform the data for the client component
  const transformedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand?.name || 'Unknown Brand',
    slug: product.slug,
    variants: product.variants || [],
    images: (product.images || [])
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
      .map((img: any) => ({
        filename: img.image_filename,
        alt: img.alt_text || product.name,
        isPrimary: img.is_primary
      })),
    categories: (product.categories || []).map((pc: any) => pc.category),
    warranty: product.warranty,
    condition: product.condition,
    weight: product.weight,
    width: product.width,
    height: product.height,
    depth: product.depth,
    customFields: product.custom_fields,
    minTierOrder: product.min_tier_order
  }

  return <ProductDetailClient product={transformedProduct} />
}