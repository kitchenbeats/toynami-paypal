import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  try {
    // Add all active products
    const { data: products } = await supabase
      .from('products')
      .select('id, slug, updated_at')
      .eq('status', 'active')
      .eq('is_visible', true)
      .is('deleted_at', null)

    if (products) {
      products.forEach(product => {
        sitemap.push({
          url: `${baseUrl}/${product.slug}/${product.id}`,
          lastModified: new Date(product.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Add all active categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)
      .is('deleted_at', null)

    if (categories) {
      categories.forEach(category => {
        sitemap.push({
          url: `${baseUrl}/${category.slug}`,
          lastModified: new Date(category.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    }

    // Add all brands
    const { data: brands } = await supabase
      .from('brands')
      .select('slug, updated_at')
      .eq('is_active', true)
      .is('deleted_at', null)

    if (brands) {
      brands.forEach(brand => {
        sitemap.push({
          url: `${baseUrl}/brands/${brand.slug}`,
          lastModified: new Date(brand.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Add published blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)

    if (blogPosts) {
      blogPosts.forEach(post => {
        sitemap.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      })
    }

    // Add static pages from database
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (pages) {
      pages.forEach(page => {
        sitemap.push({
          url: `${baseUrl}/${page.slug}`,
          lastModified: new Date(page.updated_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.4,
        })
      })
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return sitemap
}