import { IMAGE_CONFIG } from '@/lib/config/images'

/**
 * Simple image source handler - expects either:
 * 1. Full URL from media library (starts with http)
 * 2. Legacy filename/path
 * 3. Fallback to placeholder
 */
export function getImageSrc(imageSrc: string | undefined | null): string {
  if (!imageSrc) {
    return IMAGE_CONFIG.placeholderImage
  }
  
  // If it's already a full URL (from media library), use it directly
  if (imageSrc.startsWith('http')) {
    return imageSrc
  }
  
  // Legacy path handling for old data
  if (imageSrc.includes('/')) {
    return `${IMAGE_CONFIG.baseUrl}/${IMAGE_CONFIG.imagePath}/${imageSrc}`
  }
  
  // Legacy filename only
  return `/images/products/${imageSrc}`
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