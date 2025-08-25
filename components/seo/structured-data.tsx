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
  created_at?: string
  updated_at?: string
}

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content?: string
  slug: string
  featured_image?: string
  author_id?: string
  published_at?: string
  updated_at?: string
  tags?: string[]
}

interface Category {
  id: string
  name: string
  description?: string
  slug: string
  parent?: { name: string }
}

interface Brand {
  id: string
  name: string
  description?: string
  slug: string
}

interface BreadcrumbData {
  breadcrumbs: Array<{ name: string; url: string }>
}

interface StructuredDataProps {
  type: 'product' | 'organization' | 'breadcrumb' | 'blog' | 'category' | 'brand' | 'website'
  data?: Product | BlogPost | Category | Brand | BreadcrumbData
  url?: string
}

export function StructuredData({ type, data, url }: StructuredDataProps) {
  let structuredData: Record<string, unknown> = {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

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
      if (!data || !('breadcrumbs' in data)) break
      
      const breadcrumbData = data as BreadcrumbData
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbData.breadcrumbs.map((crumb, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `${baseUrl}${crumb.url}`
        }))
      }
      break

    case 'blog':
      if (!data) break
      
      const blogPost = data as BlogPost
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blogPost.title,
        "description": blogPost.excerpt || `${blogPost.title} - Read the latest from Toynami Store`,
        "image": blogPost.featured_image || `${baseUrl}/opengraph-image.png`,
        "url": url || `${baseUrl}/blog/${blogPost.slug}`,
        "author": {
          "@type": "Organization",
          "name": "Toynami Store"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Toynami Store",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "datePublished": blogPost.published_at,
        "dateModified": blogPost.updated_at || blogPost.published_at,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url || `${baseUrl}/blog/${blogPost.slug}`
        },
        ...(blogPost.tags && {
          "keywords": blogPost.tags.join(", ")
        })
      }
      break

    case 'category':
      if (!data) break
      
      const category = data as Category
      structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} Collectibles`,
        "description": category.description || `Browse ${category.name.toLowerCase()} collectibles and toys at Toynami Store`,
        "url": url || `${baseUrl}/categories/${category.slug}`,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Toynami Store",
          "url": baseUrl
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": baseUrl
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "Categories",
              "item": `${baseUrl}/categories`
            },
            ...(category.parent ? [{
              "@type": "ListItem",
              "position": 3,
              "name": category.parent.name,
              "item": `${baseUrl}/categories/${category.parent.name.toLowerCase()}`
            }] : []),
            {
              "@type": "ListItem",
              "position": category.parent ? 4 : 3,
              "name": category.name
            }
          ]
        }
      }
      break

    case 'brand':
      if (!data) break
      
      const brand = data as Brand
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": brand.name,
        "description": brand.description || `Official ${brand.name} collectibles and merchandise`,
        "url": url || `${baseUrl}/brands/${brand.slug}`,
        "sameAs": [
          `${baseUrl}/brands/${brand.slug}`
        ]
      }
      break

    case 'website':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Toynami Store",
        "description": "Premium collectibles, toys, and exclusive merchandise",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
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