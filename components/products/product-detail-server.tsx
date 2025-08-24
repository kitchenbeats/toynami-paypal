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
      brand:brands!brand_id(name, slug),
      option_assignments:product_option_assignments(
        is_required,
        display_order,
        option_type:global_option_types(
          id,
          name,
          display_name,
          input_type,
          values:global_option_values(
            id,
            value,
            display_name,
            hex_color,
            sku_suffix,
            is_default
          )
        )
      ),
      option_pricing:product_option_pricing(
        option_value_id,
        price_adjustment_cents,
        stock_override,
        is_available
      )
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
    sku: product.sku,
    // Pricing - use sale price if available, otherwise retail price, otherwise calculated price
    retail_price_cents: product.retail_price_cents,
    sale_price_cents: product.sale_price_cents,
    calculated_price_cents: product.calculated_price_cents,
    base_price_cents: product.base_price_cents,
    compare_price_cents: product.compare_price_cents,
    // Stock
    stock_level: product.stock_level,
    track_inventory: product.track_inventory,
    // Variants
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
    minTierOrder: product.min_tier_order,
    preorder_release_date: product.preorder_release_date,
    preorder_message: product.preorder_message,
    min_purchase_quantity: product.min_purchase_quantity || 1,
    max_purchase_quantity: product.max_purchase_quantity || null,
    // Options
    options: product.option_assignments?.map((assignment: any) => ({
      id: assignment.option_type?.id,
      name: assignment.option_type?.name,
      display_name: assignment.option_type?.display_name,
      input_type: assignment.option_type?.input_type,
      is_required: assignment.is_required,
      values: assignment.option_type?.values || []
    })) || [],
    option_pricing: product.option_pricing || []
  }

  return <ProductDetailClient product={transformedProduct} />
}