export interface MediaItem {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_url: string
  file_size?: number
  mime_type?: string
  file_extension?: string
  title?: string
  alt_text?: string
  caption?: string
  description?: string
  width?: number
  height?: number
  folder: string
  tags?: string[]
  usage_count: number
  last_used_at?: string
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface MediaUsage {
  id: string
  media_id: string
  entity_type: string
  entity_id: string
  field_name?: string
  created_at: string
}

export type MediaFolder = 'products' | 'banners' | 'brands' | 'blog' | 'carousel' | 'uncategorized'

export interface MediaUploadResponse {
  url: string
  path: string
  media?: MediaItem
}

export interface MediaFilters {
  search?: string
  folder?: MediaFolder
  mimeType?: string
  tags?: string[]
}