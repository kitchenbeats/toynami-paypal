import type { Metadata } from 'next'

export interface SEOData {
  title?: string
  description?: string
  keywords?: string | string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  price?: number
  currency?: string
  availability?: string
}

const DEFAULT_TITLE = "Toynami Store - Premium Collectibles & Toys"
const DEFAULT_DESCRIPTION = "Discover premium collectibles, toys, and exclusive merchandise at Toynami Store. Shop authentic figures, limited editions, and pop culture items."
const DEFAULT_KEYWORDS = ["collectibles", "toys", "figures", "pop culture", "merchandise", "limited edition", "anime", "gaming"]
const SITE_NAME = "Toynami Store"
const TWITTER_HANDLE = "@toynami"

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export function generateSEOTitle(pageTitle?: string, suffix?: string): string {
  const siteSuffix = suffix || ` | ${SITE_NAME}`
  
  if (!pageTitle) {
    return DEFAULT_TITLE
  }
  
  if (pageTitle.includes(SITE_NAME)) {
    return pageTitle
  }
  
  return `${pageTitle}${siteSuffix}`
}

export function generateSEODescription(description?: string): string {
  return description || DEFAULT_DESCRIPTION
}

export function generateSEOKeywords(keywords?: string | string[]): string[] {
  if (!keywords) {
    return DEFAULT_KEYWORDS
  }
  
  if (typeof keywords === 'string') {
    return [...keywords.split(',').map(k => k.trim()), ...DEFAULT_KEYWORDS].slice(0, 10)
  }
  
  return [...keywords, ...DEFAULT_KEYWORDS].slice(0, 10)
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function generateImageUrl(imagePath?: string): string {
  const baseUrl = getBaseUrl()
  
  if (!imagePath) {
    return `${baseUrl}/opengraph-image.png`
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
}

export function generateMetadata(seoData: SEOData): Metadata {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags,
    author,
    price,
    currency = 'USD',
    availability
  } = seoData

  const seoTitle = generateSEOTitle(title)
  const seoDescription = generateSEODescription(description)
  const seoKeywords = generateSEOKeywords(keywords)
  const canonicalUrl = url ? generateCanonicalUrl(url) : undefined
  const imageUrl = generateImageUrl(image)

  const metadata: Metadata = {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: seoTitle
      }],
      locale: 'en_US',
      type: type === 'product' ? 'website' : type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags && { tags }),
      ...(author && type === 'article' && {
        authors: [author]
      })
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl]
    },
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl
      }
    }),
    ...(type === 'product' && price && {
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': currency,
        ...(availability && { 'product:availability': availability })
      }
    })
  }

  return metadata
}

// Product-specific SEO
export function generateProductSEO(product: {
  id: string
  name: string
  description?: string
  base_price_cents: number
  compare_price_cents?: number
  stock_level: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  brand?: { name: string }
  categories?: Array<{ category: { name: string } }>
  images?: Array<{ image_filename: string; is_primary: boolean }>
}): SEOData {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const brandName = product.brand?.name || 'Toynami'
  const categoryName = product.categories?.[0]?.category.name
  
  const title = product.meta_title || 
    `${product.name}${brandName !== 'Toynami' ? ` by ${brandName}` : ''}${categoryName ? ` | ${categoryName}` : ''}`
  
  const description = product.meta_description || 
    `${product.description || product.name} - Premium ${categoryName?.toLowerCase() || 'collectible'} from ${brandName}. ${product.stock_level > 0 ? 'In stock' : 'Limited availability'}.`
  
  const keywords = product.meta_keywords || 
    [product.name, brandName, categoryName, 'collectible', 'toy', 'figure'].filter(Boolean).join(', ')

  return {
    title,
    description,
    keywords,
    image: primaryImage ? `/images/products/${primaryImage.image_filename}` : undefined,
    url: `/products/${product.id}`,
    type: 'product',
    price: product.base_price_cents / 100,
    currency: 'USD',
    availability: product.stock_level > 0 ? 'in_stock' : 'out_of_stock'
  }
}

// Category-specific SEO
export function generateCategorySEO(category: {
  name: string
  description?: string
  slug: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  parent?: { name: string }
  productCount?: number
}): SEOData {
  const parentText = category.parent ? ` in ${category.parent.name}` : ''
  const countText = category.productCount ? ` (${category.productCount} items)` : ''
  
  const title = category.meta_title || 
    `${category.name} Collectibles${parentText} - Shop Premium ${category.name}${countText}`
  
  const description = category.meta_description || 
    `${category.description || `Discover premium ${category.name.toLowerCase()} collectibles and toys`}${parentText}. Shop authentic figures, limited editions, and exclusive merchandise at Toynami Store.`
  
  const keywords = category.meta_keywords || 
    [category.name, `${category.name.toLowerCase()} collectibles`, `${category.name.toLowerCase()} toys`, `${category.name.toLowerCase()} figures`]

  return {
    title,
    description,
    keywords,
    url: `/categories/${category.slug}`,
    type: 'website'
  }
}

// Blog post SEO
export function generateBlogSEO(post: {
  title: string
  excerpt?: string
  content?: string
  slug: string
  meta_title?: string
  meta_description?: string
  featured_image?: string
  thumbnail_url?: string
  tags?: string[]
  author_id?: string
  published_at?: string
  updated_at?: string
}): SEOData {
  const title = post.meta_title || post.title
  
  const description = post.meta_description || 
    post.excerpt || 
    (post.content ? post.content.substring(0, 155).replace(/<[^>]*>/g, '') + '...' : `Read about ${post.title} on the Toynami Store blog.`)
  
  const keywords = post.tags || []
  const image = post.featured_image || post.thumbnail_url

  return {
    title,
    description,
    keywords,
    image,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    tags: post.tags
  }
}

// Brand page SEO
export function generateBrandSEO(brand: {
  name: string
  description?: string
  slug: string
  productCount?: number
}): SEOData {
  const countText = brand.productCount ? ` (${brand.productCount} products)` : ''
  
  const title = `${brand.name} Collectibles & Toys${countText} - Official ${brand.name} Store`
  
  const description = brand.description || 
    `Shop official ${brand.name} collectibles, toys, and merchandise at Toynami Store. Discover authentic ${brand.name} figures, limited editions, and exclusive items.`

  return {
    title,
    description,
    keywords: [brand.name, `${brand.name} collectibles`, `${brand.name} toys`, `${brand.name} merchandise`, `official ${brand.name} store`],
    url: `/brands/${brand.slug}`,
    type: 'website'
  }
}