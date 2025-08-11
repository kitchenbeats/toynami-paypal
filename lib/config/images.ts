/**
 * Centralized image configuration
 * Change IMAGE_BASE_URL to switch between Supabase Storage, CDN, or other providers
 */

// Option 1: Supabase Storage (current)
export const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

// Option 2: CloudFlare CDN (example for future)
// export const IMAGE_BASE_URL = 'https://cdn.toynamishop.com'

// Option 3: AWS CloudFront (example for future)  
// export const IMAGE_BASE_URL = 'https://d1234567890.cloudfront.net'

// Option 4: Custom domain pointing to Supabase Storage (example for future)
// export const IMAGE_BASE_URL = 'https://images.toynamishop.com'

export const IMAGE_CONFIG = {
  baseUrl: IMAGE_BASE_URL,
  placeholderImage: '/images/product-placeholder.jpg',
  imagePath: 'product_images', // Path within the storage/CDN
}