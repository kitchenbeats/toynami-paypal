import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'
import { IMAGE_CONFIG } from '@/lib/config/images'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ brand: string }>
}

async function getBrand(slug: string) {
  const supabase = await createClient()
  
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return brand
}

async function getArchivedProducts(brandId: string) {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      ),
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('brand_id', brandId)
    .eq('status', 'archived')
    .order('created_at', { ascending: false })
  
  return products || []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brand = await getBrand(resolvedParams.brand)
  
  if (!brand) {
    return {
      title: 'Brand Archive Not Found',
      description: 'The requested brand archive could not be found.'
    }
  }
  
  return {
    title: `${brand.name} Archive - Past Collections`,
    description: `Browse archived ${brand.name} collectibles and past releases. Explore the history of ${brand.name} products at Toynami.`,
    openGraph: {
      title: `${brand.name} Archive - Past Collections | Toynami Store`,
      description: `Browse archived ${brand.name} collectibles and past releases.`,
      type: 'website',
    }
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

export default async function BrandArchivePage({ params }: PageProps) {
  const resolvedParams = await params
  const brand = await getBrand(resolvedParams.brand)
  
  if (!brand) {
    notFound()
  }
  
  const products = await getArchivedProducts(brand.id)
  
  // Get primary image for each product
  const productsWithImages = products.map(product => {
    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
    return {
      ...product,
      primaryImage
    }
  })
  
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container mx-auto px-4 relative z-10 text-white py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/archive" className="text-gray-300 hover:text-white transition-colors">
                  Archive
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">{brand.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-5xl font-bold">{brand.name} Archive</h1>
          <p className="text-gray-300 mt-3 text-lg">
            Past collections and limited releases from {brand.name}
          </p>
        </div>
      </div>

      {/* Archive Notice */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-4xl mx-auto">
          <p className="text-gray-700 text-center">
            <span className="font-semibold">Archive Collection:</span> These items are no longer available for purchase
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsWithImages.map((product) => (
            <Link
              key={product.id}
              href={`/${product.categories?.slug || 'products'}/${product.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  {product.primaryImage ? (
                    <Image
                      src={
                        product.primaryImage.image_url.startsWith('http')
                          ? getImageSrc(product.primaryImage.image_url)
                          : `${IMAGE_CONFIG.baseUrl}/${product.primaryImage.image_url}`
                      }
                      alt={product.primaryImage.alt_text || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Archive Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-gray-900/90 text-white hover:bg-gray-900/90">
                      Archived
                    </Badge>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  {/* SKU */}
                  {product.sku && (
                    <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                  )}
                  
                  {/* Original Price */}
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-500">Original Price</p>
                    <p className="text-lg font-bold text-gray-400 line-through">
                      {formatPrice(product.price_cents)}
                    </p>
                  </div>
                  
                  {/* View Details Link */}
                  <div className="mt-4">
                    <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No archived products for {brand.name} at this time.</p>
            <Link href="/archive" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              ← Back to Archive
            </Link>
          </div>
        )}
      </div>
    </>
  )
}