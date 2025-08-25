import { createClient } from '@/lib/supabase/server'
import { MediaItem, MediaFilters, MediaFolder } from '@/lib/types/media'

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching media:', error)
    return null
  }
  
  return data
}

export async function getMediaByUrl(url: string): Promise<MediaItem | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .eq('file_url', url)
    .single()
  
  if (error) {
    console.error('Error fetching media by URL:', error)
    return null
  }
  
  return data
}

export async function searchMedia(filters: MediaFilters): Promise<MediaItem[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters.folder && filters.folder !== 'uncategorized') {
    query = query.eq('folder', filters.folder)
  }
  
  if (filters.mimeType) {
    query = query.like('mime_type', `${filters.mimeType}%`)
  }
  
  if (filters.search) {
    query = query.textSearch('search_vector', filters.search)
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error searching media:', error)
    return []
  }
  
  return data || []
}

export async function trackMediaUsage(
  mediaId: string,
  entityType: string,
  entityId: string,
  fieldName?: string
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('track_media_usage', {
    p_media_id: mediaId,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_field_name: fieldName
  })
  
  if (error) {
    console.error('Error tracking media usage:', error)
  }
}

export async function untrackMediaUsage(
  mediaId: string,
  entityType: string,
  entityId: string,
  fieldName?: string
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('untrack_media_usage', {
    p_media_id: mediaId,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_field_name: fieldName
  })
  
  if (error) {
    console.error('Error untracking media usage:', error)
  }
}

export async function getMediaUsage(mediaId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media_usage')
    .select('*')
    .eq('media_id', mediaId)
  
  if (error) {
    console.error('Error fetching media usage:', error)
    return []
  }
  
  return data || []
}

export async function deleteUnusedMedia(): Promise<number> {
  const supabase = await createClient()
  
  // Find media with usage_count = 0
  const { data: unusedMedia, error: fetchError } = await supabase
    .from('media_library')
    .select('id, file_path')
    .eq('usage_count', 0)
  
  if (fetchError || !unusedMedia) {
    console.error('Error fetching unused media:', fetchError)
    return 0
  }
  
  let deletedCount = 0
  
  for (const media of unusedMedia) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('products')
      .remove([media.file_path])
    
    if (storageError) {
      console.error(`Error deleting file ${media.file_path}:`, storageError)
      continue
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('media_library')
      .delete()
      .eq('id', media.id)
    
    if (!dbError) {
      deletedCount++
    }
  }
  
  return deletedCount
}

export async function getMediaStats() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media_library')
    .select('file_size, usage_count')
  
  if (error || !data) {
    return {
      totalFiles: 0,
      totalSize: 0,
      unusedFiles: 0,
      mostUsedCount: 0
    }
  }
  
  const totalFiles = data.length
  const totalSize = data.reduce((sum, item) => sum + (item.file_size || 0), 0)
  const unusedFiles = data.filter(item => item.usage_count === 0).length
  const mostUsedCount = Math.max(...data.map(item => item.usage_count), 0)
  
  return {
    totalFiles,
    totalSize,
    unusedFiles,
    mostUsedCount
  }
}

// Helper to migrate existing URLs to media library
export async function migrateUrlToMedia(
  url: string,
  folder: MediaFolder = 'uncategorized',
  metadata?: {
    title?: string
    alt_text?: string
    tags?: string[]
  }
): Promise<MediaItem | null> {
  const supabase = await createClient()
  
  // Check if already migrated
  const existing = await getMediaByUrl(url)
  if (existing) return existing
  
  // Extract filename from URL
  const urlParts = url.split('/')
  const filename = urlParts[urlParts.length - 1]
  const filePath = `${folder}/${filename}`
  
  // Create media library entry
  const { data, error } = await supabase
    .from('media_library')
    .insert({
      filename,
      original_name: filename,
      file_path: filePath,
      file_url: url,
      folder,
      title: metadata?.title || filename.split('.')[0],
      alt_text: metadata?.alt_text,
      tags: metadata?.tags,
      uploaded_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error migrating URL to media:', error)
    return null
  }
  
  return data
}