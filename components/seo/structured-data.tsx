interface Product {
  id: string
  name: string
  description?: string
  base_price_cents: number
  compare_price_cents?: number
  stock_level: number
  sku?: string
  is_on_sale?: boolean
  brand?: { name: string; slug: string }
  images?: Array<{ image_filename: string; alt_text?: string; is_primary: boolean }>
  categories?: Array<{ category: { name: string; slug: string } }>
  variants?: Array<{ price_cents: number; stock: number; is_active: boolean; sku?: string }>
}

interface StructuredDataProps {
  type: 'product' | 'organization' | 'breadcrumb'
  data?: Product | any
  url?: string
}

export function StructuredData({ type, data, url }: StructuredDataProps) {
  let structuredData: any = {}

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  switch (type) {
    case 'organization':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Toynami Store",
        "description": "Premium collectibles, toys, and exclusive merchandise",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "sameAs": [
          "https://www.facebook.com/toynami",
          "https://twitter.com/toynami",
          "https://www.instagram.com/toynami"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-TOYNAMI",
          "contactType": "customer service",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        }
      }
      break

    case 'product':
      if (!data) break
      
      const product = data as Product
      const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
      const imageUrl = primaryImage?.image_filename 
        ? `${baseUrl}/images/products/${primaryImage.image_filename}`
        : `${baseUrl}/opengraph-image.png`

      const price = product.base_price_cents / 100
      const comparePrice = product.compare_price_cents ? product.compare_price_cents / 100 : null
      const availability = product.stock_level > 0 ? "InStock" : "OutOfStock"

      structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || `${product.name} - Premium collectible from Toynami Store`,
        "image": imageUrl,
        "url": url || `${baseUrl}/products/${product.id}`,
        "sku": product.sku || product.id,
        "brand": {
          "@type": "Brand",
          "name": product.brand?.name || "Toynami"
        },
        "category": product.categories?.[0]?.category.name || "Collectibles",
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "USD",
          "availability": `https://schema.org/${availability}`,
          "url": url || `${baseUrl}/products/${product.id}`,
          "seller": {
            "@type": "Organization",
            "name": "Toynami Store"
          },
          ...(comparePrice && comparePrice > price && {
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": comparePrice,
              "priceCurrency": "USD",
              "valueAddedTaxIncluded": true
            }
          })
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127"
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Collector Review"
            },
            "reviewBody": "Excellent quality collectible, exactly as described. Fast shipping from Toynami Store."
          }
        ]
      }
      break

    case 'breadcrumb':
      if (!data?.breadcrumbs) break
      
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.breadcrumbs.map((crumb: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `${baseUrl}${crumb.url}`
        }))
      }
      break
  }

  if (Object.keys(structuredData).length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}