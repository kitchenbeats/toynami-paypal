'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, MediaFolder } from '@/lib/types/media'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  // Upload,
  Search, 
  Grid3x3, 
  List, 
  Trash2,  
  Copy, 
  X,
  Loader2,
  FolderOpen,
  FileText,
  Film,
  Music,
  File,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'

interface MediaManagerProps {
  onSelect?: (media: MediaItem) => void
  selectionMode?: 'single' | 'multiple'
  selectedItems?: MediaItem[]
  allow?: boolean
  mimeTypeFilter?: string
  folderFilter?: MediaFolder
}

export function MediaManager({
  onSelect,
  selectionMode = 'single',
  selectedItems = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _allowSelection = true,
  mimeTypeFilter,
  folderFilter
}: MediaManagerProps) {
  
  // Helper function to get valid image URL
  const getImageUrl = (media: MediaItem): string | null => {
    if (!media.file_url) return null
    
    try {
      // If it's already a full URL, return it
      if (media.file_url.startsWith('http')) {
        new URL(media.file_url) // Test if valid URL
        return media.file_url
      }
      
      // Otherwise construct Supabase storage URL
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) return null
      
      // Try different bucket names based on the file path
      let bucketName = 'products' // Default bucket
      if (media.file_url.includes('brand_images') || media.file_url.includes('brands/')) {
        bucketName = 'products' // Brands are also in products bucket
      } else if (media.file_url.includes('categories/')) {
        bucketName = 'products' // Categories are also in products bucket  
      }
      
      const fullUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${media.file_url}`
      new URL(fullUrl) // Test if valid URL
      return fullUrl
    } catch {
      console.warn('Invalid media URL:', media.file_url)
      return null
    }
  }
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | 'all'>(folderFilter || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(24) // 24 items per page for grid view
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>(selectedItems)
  const [detailsMedia, setDetailsMedia] = useState<MediaItem | null>(null)
  const [, setCopiedUrl] = useState<string | null>(null)
  
  const supabase = createClient()

  const folders: { value: MediaFolder | 'all'; label: string }[] = [
    { value: 'all', label: 'All Media' },
    { value: 'products', label: 'Products' },
    { value: 'banners', label: 'Banners' },
    { value: 'brands', label: 'Brands' },
    { value: 'blog', label: 'Blog' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'uncategorized', label: 'Uncategorized' }
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      // First get the total count
      let countQuery = supabase
        .from('media_library')
        .select('*', { count: 'exact', head: true })

      if (selectedFolder !== 'all') {
        countQuery = countQuery.eq('folder', selectedFolder)
      }

      if (mimeTypeFilter) {
        countQuery = countQuery.like('mime_type', `${mimeTypeFilter}%`)
      }

      if (searchTerm) {
        countQuery = countQuery.or(`filename.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
      }

      const { count } = await countQuery
      setTotalItems(count || 0)

      // Then get the paginated data
      let query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedFolder !== 'all') {
        query = query.eq('folder', selectedFolder)
      }

      if (mimeTypeFilter) {
        query = query.like('mime_type', `${mimeTypeFilter}%`)
      }

      if (searchTerm) {
        query = query.or(`filename.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
      }

      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error } = await query

      if (error) {
        console.error('Error fetching media:', error)
        throw error
      }

      setMediaItems(data || [])
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to load media library')
    } finally {
      setLoading(false)
    }
  }, [selectedFolder, mimeTypeFilter, searchTerm, currentPage, itemsPerPage, supabase])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFolder, mimeTypeFilter, searchTerm])

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSelect = (media: MediaItem) => {
    if (selectionMode === 'single') {
      setSelectedMedia([media])
      onSelect?.(media)
    } else {
      const isSelected = selectedMedia.some(m => m.id === media.id)
      if (isSelected) {
        setSelectedMedia(selectedMedia.filter(m => m.id !== media.id))
      } else {
        setSelectedMedia([...selectedMedia, media])
      }
    }
  }

  const handleDelete = async (media: MediaItem) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove([media.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', media.id)

      if (dbError) throw dbError

      setMediaItems(mediaItems.filter(m => m.id !== media.id))
      if (detailsMedia?.id === media.id) {
        setDetailsMedia(null)
      }
      toast.success('Media deleted successfully')
    } catch (error) {
      console.error('Error deleting media:', error)
      toast.error('Failed to delete media')
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast.success('URL copied to clipboard')
    } catch (error) {
      console.error('Error copying URL:', error)
      toast.error('Failed to copy URL')
    }
  }

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="w-full h-full" />
    if (mimeType.startsWith('video/')) return <Film className="w-full h-full" />
    if (mimeType.startsWith('audio/')) return <Music className="w-full h-full" />
    if (mimeType.includes('pdf')) return <FileText className="w-full h-full" />
    return <File className="w-full h-full" />
  }

  return (
    <div className="flex h-screen w-full">
      {/* Main content */}
      <main className="flex-1 flex flex-col h-full w-full">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-semibold">All Media</h1>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedFolder} onValueChange={(value) => setSelectedFolder(value as MediaFolder | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map(folder => (
                  <SelectItem key={folder.value} value={folder.value}>
                    {folder.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-5 w-5" />
                <span className="sr-only">Use list view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3x3 className="h-5 w-5" />
                <span className="sr-only">Use grid view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <section className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No media found</p>
                <p className="text-sm text-muted-foreground mt-2">files to get started</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {mediaItems.map((media) => (
                <div key={media.id} className="relative">
                  <div
                    className={`${
                      detailsMedia?.id === media.id
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
                    } group block w-full overflow-hidden rounded-lg bg-muted cursor-pointer`}
                    onClick={() => {
                      setDetailsMedia(media)
                      handleSelect(media)
                    }}
                  >
                    {media.mime_type?.startsWith('image/') ? (
                      (() => {
                        const imageUrl = getImageUrl(media)
                        return imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={media.alt_text || media.filename}
                            width={400}
                            height={280}
                            className={`${
                              detailsMedia?.id === media.id ? '' : 'group-hover:opacity-75'
                            } pointer-events-none aspect-[10/7] object-cover w-full`}
                            onError={(e) => {
                              console.error('Failed to load image:', imageUrl)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="aspect-[10/7] w-full flex items-center justify-center text-muted-foreground bg-muted">
                            <div className="text-center">
                              <FileText className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-xs">Invalid URL</p>
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="aspect-[10/7] w-full flex items-center justify-center text-muted-foreground bg-muted">
                        {getFileIcon(media.mime_type)}
                      </div>
                    )}
                    <button type="button" className="absolute inset-0 focus:outline-none">
                      <span className="sr-only">View details for {media.filename}</span>
                    </button>
                  </div>
                  <p className="pointer-events-none mt-2 block truncate text-sm font-medium">
                    {media.title || media.filename}
                  </p>
                  <p className="pointer-events-none block text-sm font-medium text-muted-foreground">
                    {formatFileSize(media.file_size)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">Preview</th>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Size</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((media) => (
                    <tr
                      key={media.id}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setDetailsMedia(media)
                        handleSelect(media)
                      }}
                    >
                      <td className="p-4">
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                          {media.mime_type?.startsWith('image/') ? (
                            (() => {
                              const imageUrl = getImageUrl(media)
                              return imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={media.filename}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    console.error('Failed to load thumbnail:', imageUrl)
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )
                            })()
                          ) : (
                            <div className="w-full h-full p-2 text-muted-foreground">
                              {getFileIcon(media.mime_type)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{media.title || media.filename}</td>
                      <td className="p-4 text-sm text-muted-foreground">{media.mime_type}</td>
                      <td className="p-4 text-sm">{formatFileSize(media.file_size)}</td>
                      <td className="p-4 text-sm">{new Date(media.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(media.file_url)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(media)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Details sidebar */}
      {detailsMedia && (
        <aside className="hidden w-96 overflow-y-auto border-l bg-background p-8 lg:block">
          <div className="space-y-6 pb-16">
            <div>
              {detailsMedia.mime_type?.startsWith('image/') ? (
                (() => {
                  const imageUrl = getImageUrl(detailsMedia)
                  return imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={detailsMedia.alt_text || detailsMedia.filename}
                      width={400}
                      height={280}
                      className="block aspect-[10/7] w-full rounded-lg object-cover"
                      onError={(e) => {
                        console.error('Failed to load details image:', imageUrl)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex aspect-[10/7] w-full rounded-lg bg-muted items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">Invalid URL</p>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="flex aspect-[10/7] w-full rounded-lg bg-muted items-center justify-center text-muted-foreground">
                  {getFileIcon(detailsMedia.mime_type)}
                </div>
              )}
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    <span className="sr-only">Details for </span>
                    {detailsMedia.title || detailsMedia.filename}
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatFileSize(detailsMedia.file_size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-4 h-8 w-8"
                  onClick={() => setDetailsMedia(null)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Information</h3>
              <dl className="mt-2 divide-y divide-border border-t border-b">
                <div className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">File name</dt>
                  <dd className="truncate max-w-[200px]">{detailsMedia.filename}</dd>
                </div>
                <div className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>{detailsMedia.mime_type}</dd>
                </div>
                <div className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">Size</dt>
                  <dd>{formatFileSize(detailsMedia.file_size)}</dd>
                </div>
                {detailsMedia.width && detailsMedia.height && (
                  <div className="flex justify-between py-3 text-sm font-medium">
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd className="whitespace-nowrap">
                      {detailsMedia.width} × {detailsMedia.height}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between py-3 text-sm font-medium">
                  <dt className="text-muted-foreground">ed</dt>
                  <dd>{new Date(detailsMedia.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-2 text-sm text-muted-foreground italic">
                {detailsMedia.description || detailsMedia.alt_text || 'No description'}
              </p>
            </div>

            <div className="flex gap-x-3">
              {onSelect && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleSelect(detailsMedia)
                    setDetailsMedia(null)
                  }}
                >
                  Select
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const imageUrl = getImageUrl(detailsMedia)
                  if (imageUrl) {
                    window.open(imageUrl, '_blank')
                  }
                }}
              ></Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}