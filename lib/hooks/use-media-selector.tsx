import { useState, useCallback, useEffect } from 'react'
import { MediaItem } from '@/lib/types/media'
import { getMediaById, getMediaByUrl, trackMediaUsage, untrackMediaUsage } from '@/lib/data/media'

interface UseMediaSelectorOptions {
  entityType?: string // 'product', 'banner', 'blog', etc.
  entityId?: string
  fieldName?: string // 'hero_image', 'thumbnail', etc.
}

export function useMediaSelector(
  initialValue?: string | null,
  options?: UseMediaSelectorOptions
) {
  const [media, setMedia] = useState<MediaItem | null>(null)
  const [mediaUrl, setMediaUrl] = useState<string | null>(initialValue || null)
  const [loading, setLoading] = useState(false)

  // Load media item if we have an initial value
  useEffect(() => {
    const loadMedia = async () => {
      if (!initialValue) return
      
      setLoading(true)
      try {
        // Check if it's a UUID (media ID) or URL
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(initialValue)
        
        const mediaItem = isUuid 
          ? await getMediaById(initialValue)
          : await getMediaByUrl(initialValue)
        
        if (mediaItem) {
          setMedia(mediaItem)
          setMediaUrl(mediaItem.file_url)
        } else {
          // If we can't find it in media library, just use the URL
          setMediaUrl(initialValue)
        }
      } catch (error) {
        console.error('Error loading media:', error)
        setMediaUrl(initialValue)
      } finally {
        setLoading(false)
      }
    }
    
    loadMedia()
  }, [initialValue])

  const handleMediaChange = useCallback(async (newMedia: MediaItem | null) => {
    const previousMedia = media
    
    setMedia(newMedia)
    setMediaUrl(newMedia?.file_url || null)
    
    // Track usage if we have entity information
    if (options?.entityType && options?.entityId) {
      try {
        // Untrack previous media if it exists
        if (previousMedia) {
          await untrackMediaUsage(
            previousMedia.id,
            options.entityType,
            options.entityId,
            options.fieldName
          )
        }
        
        // Track new media
        if (newMedia) {
          await trackMediaUsage(
            newMedia.id,
            options.entityType,
            options.entityId,
            options.fieldName
          )
        }
      } catch (error) {
        console.error('Error tracking media usage:', error)
      }
    }
  }, [media, options])

  const clearMedia = useCallback(() => {
    handleMediaChange(null)
  }, [handleMediaChange])

  return {
    media,
    mediaUrl,
    mediaId: media?.id || null,
    loading,
    handleMediaChange,
    clearMedia
  }
}