import { IMAGE_CONFIG } from '@/lib/config/images'

/**
 * Get the appropriate image source URL based on the filename/URL
 * Rewrites old toynamishop.com URLs to configured storage/CDN
 */
export function getImageSrc(imageFilename: string): string {
  if (!imageFilename) {
    return IMAGE_CONFIG.placeholderImage
  }
  
  // Rewrite old toynamishop.com URLs to configured storage/CDN
  if (imageFilename.includes('toynamishop.com/product_images/')) {
    // Extract the path after /product_images/
    const match = imageFilename.match(/\/product_images\/(.+)/)
    if (match) {
      const imagePath = match[1] // e.g., "f/346/5__40195__47375.jpg"
      return `${IMAGE_CONFIG.baseUrl}/${IMAGE_CONFIG.imagePath}/${imagePath}`
    }
    // Fallback to original URL if can't rewrite
    return imageFilename
  }
  
  // If it's any other http/https URL, use as-is
  if (imageFilename.startsWith('http')) {
    return imageFilename
  }
  
  // If it starts with a forward slash, it's already a local path - use as-is
  if (imageFilename.startsWith('/')) {
    return imageFilename
  }
  
  // Check if it looks like a relative path (contains directory separators)
  // These are migrated images stored as "h/789/filename.jpg" in the database
  if (imageFilename.includes('/')) {
    return `${IMAGE_CONFIG.baseUrl}/${IMAGE_CONFIG.imagePath}/${imageFilename}`
  }
  
  // For legacy support - if it's just a filename, assume it's in the products folder
  return `/images/products/${imageFilename}`
}

/**
 * Check if an image URL is a local path (starts with /)
 */
export function isLocalImagePath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('http')
}

/**
 * Check if an image URL needs migration (external URL)
 */
export function needsMigration(url: string): boolean {
  return url.startsWith('http')
}