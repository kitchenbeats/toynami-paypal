'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, MediaFolder } from '@/lib/types/media'
import { toast } from 'sonner'
import {
  Bars4Icon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  Squares2X2Icon as Squares2X2IconMini,
} from '@heroicons/react/20/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface MediaGalleryProps {
  onSelect?: (media: MediaItem) => void
  onClose?: () => void
  mimeTypeFilter?: string
  folderFilter?: MediaFolder
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function MediaGallery({
  onSelect,
  onClose,
  mimeTypeFilter,
  folderFilter
}: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder] = useState<MediaFolder | 'all'>(folderFilter || 'all')
  const [currentFile, setCurrentFile] = useState<MediaItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  // Pagination state - will be implemented later
  // const [currentPage, setCurrentPage] = useState(1)
  // const [totalItems, setTotalItems] = useState(0) 
  // const [itemsPerPage] = useState(24) // 24 items per page
  
  const supabase = createClient()

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
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

      const { data, error } = await query

      if (error) throw error
      setMediaItems(data || [])
      
      // Set first item as current if none selected
      if (data && data.length > 0 && !currentFile) {
        setCurrentFile(data[0])
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to load media library')
    } finally {
      setLoading(false)
    }
  }, [selectedFolder, mimeTypeFilter, searchTerm, supabase, currentFile])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleFileClick = (media: MediaItem) => {
    setCurrentFile(media)
    // Don't call onSelect here - only from the Select button
  }

  const handleDelete = async () => {
    if (!currentFile) return
    
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove([currentFile.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', currentFile.id)

      if (dbError) throw dbError

      setMediaItems(mediaItems.filter(m => m.id !== currentFile.id))
      setCurrentFile(mediaItems[0] || null)
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} files?`)) return
    
    try {
      const itemsToDelete = mediaItems.filter(m => selectedItems.has(m.id))
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(itemsToDelete.map(m => m.file_path))

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .in('id', Array.from(selectedItems))

      if (dbError) throw dbError

      setMediaItems(mediaItems.filter(m => !selectedItems.has(m.id)))
      setSelectedItems(new Set())
      if (currentFile && selectedItems.has(currentFile.id)) {
        setCurrentFile(mediaItems[0] || null)
      }
      toast.success(`${selectedItems.size} files deleted successfully`)
    } catch (error) {
      console.error('Error deleting files:', error)
      toast.error('Failed to delete files')
    }
  }

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    setSelectedItems(new Set(mediaItems.map(m => m.id)))
  }

  const deselectAll = () => {
    setSelectedItems(new Set())
  }

  const handleDownload = () => {
    if (!currentFile) return
    window.open(currentFile.file_url, '_blank')
  }

  return (
    <div className="flex h-full">
      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="w-full">
          <div className="relative z-10 flex h-16 shrink-0 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 justify-between px-4 sm:px-6">
              <div className="flex flex-1">
                <form className="grid flex-1 grid-cols-1" onSubmit={(e) => e.preventDefault()}>
                  <input
                    name="search"
                    type="search"
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form>
              </div>
              <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                {viewMode === 'list' && selectedItems.size > 0 && (
                  <>
                    <span className="text-sm text-gray-500">
                      {selectedItems.size} selected
                    </span>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-500"
                      onClick={handleBulkDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-gray-500"
                      onClick={deselectAll}
                    >
                      Clear
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="relative rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <PlusIcon aria-hidden="true" className="size-5" />
                  <span className="sr-only">Add file</span>
                </button>
                {onClose && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    // Handle file upload here
                    console.log('Upload:', e.target.files)
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
              <div className="flex">
                <h1 className="flex-1 text-2xl font-bold text-gray-900">Media Library</h1>
                <div className="ml-6 hidden items-center rounded-lg bg-gray-100 p-0.5 sm:flex">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={classNames(
                      viewMode === 'list' ? 'bg-white shadow-sm' : '',
                      'rounded-md p-1.5 text-gray-400 hover:bg-white hover:shadow-sm'
                    )}
                  >
                    <Bars4Icon aria-hidden="true" className="size-5" />
                    <span className="sr-only">Use list view</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={classNames(
                      viewMode === 'grid' ? 'bg-white shadow-sm' : '',
                      'ml-0.5 rounded-md p-1.5 text-gray-400 hover:bg-white hover:shadow-sm'
                    )}
                  >
                    <Squares2X2IconMini aria-hidden="true" className="size-5" />
                    <span className="sr-only">Use grid view</span>
                  </button>
                </div>
              </div>

              {/* Tabs and Gallery */}
              <Tabs defaultValue="all" urlSync={false} className="mt-3 sm:mt-2">
                <TabsList variant="underline" className="w-full justify-start">
                  <TabsTrigger value="all" variant="underline">All Media</TabsTrigger>
                  <TabsTrigger value="recent" variant="underline">Recently Added</TabsTrigger>
                  <TabsTrigger value="favorites" variant="underline">Favorites</TabsTrigger>
                </TabsList>

                {/* All Media Tab */}
                <TabsContent value="all" className="mt-0">
                  <section aria-labelledby="gallery-heading" className="mt-8 pb-16">
                    <h2 id="gallery-heading" className="sr-only">
                      Media gallery
                    </h2>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-gray-500">Loading media...</div>
                  </div>
                ) : viewMode === 'grid' ? (
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {mediaItems.map((media) => (
                      <li key={media.id} className="relative">
                        <div
                          className={classNames(
                            currentFile?.id === media.id
                              ? 'ring-2 ring-primary ring-offset-2'
                              : 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-gray-100',
                            'group block w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer'
                          )}
                          onClick={() => handleFileClick(media)}
                        >
                          {media.mime_type?.startsWith('image/') ? (
                            <Image
                              src={media.file_url}
                              alt={media.alt_text || media.filename}
                              width={400}
                              height={280}
                              className={classNames(
                                currentFile?.id === media.id ? '' : 'group-hover:opacity-75',
                                'pointer-events-none aspect-[10/7] object-cover w-full'
                              )}
                            />
                          ) : (
                            <div className="aspect-[10/7] w-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400">File</span>
                            </div>
                          )}
                          <button type="button" className="absolute inset-0 focus:outline-none">
                            <span className="sr-only">View details for {media.filename}</span>
                          </button>
                        </div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                          {media.title || media.filename}
                        </p>
                        <p className="pointer-events-none block text-sm font-medium text-gray-500">
                          {formatFileSize(media.file_size)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="overflow-hidden bg-white">
                    {viewMode === 'list' && mediaItems.length > 0 && (
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.size === mediaItems.length}
                            onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-600">Select all</span>
                        </div>
                      </div>
                    )}
                    <ul role="list" className="divide-y divide-gray-200">
                      {mediaItems.map((media) => (
                        <li 
                          key={media.id}
                          className={classNames(
                            currentFile?.id === media.id ? 'bg-gray-50' : 'hover:bg-gray-50',
                            'px-4 py-4 sm:px-6 cursor-pointer'
                          )}
                          onClick={() => handleFileClick(media)}
                        >
                          <div className="flex items-center">
                            {viewMode === 'list' && (
                              <div className="shrink-0 mr-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(media.id)}
                                  onChange={() => toggleItemSelection(media.id)}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                              </div>
                            )}
                            <div className="shrink-0">
                              {media.mime_type?.startsWith('image/') ? (
                                <Image
                                  src={media.file_url}
                                  alt={media.alt_text || media.filename}
                                  width={64}
                                  height={64}
                                  className="h-16 w-16 rounded object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                                  <span className="text-sm text-gray-400">File</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {media.title || media.filename}
                                </p>
                                <div className="ml-2 flex shrink-0">
                                  <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                    {media.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="truncate">{formatFileSize(media.file_size)}</span>
                                <span className="mx-2">·</span>
                                <span>{new Date(media.created_at).toLocaleDateString()}</span>
                                {media.width && media.height && (
                                  <>
                                    <span className="mx-2">·</span>
                                    <span>{media.width} × {media.height}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                  </section>
                </TabsContent>

                {/* Recently Added Tab */}
                <TabsContent value="recent" className="mt-0">
                  <section aria-labelledby="recent-heading" className="mt-8 pb-16">
                    <h2 id="recent-heading" className="sr-only">
                      Recently added media
                    </h2>
                    <div className="flex justify-center py-12">
                      <div className="text-gray-500">Recently added media will appear here</div>
                    </div>
                  </section>
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="mt-0">
                  <section aria-labelledby="favorites-heading" className="mt-8 pb-16">
                    <h2 id="favorites-heading" className="sr-only">
                      Favorite media
                    </h2>
                    <div className="flex justify-center py-12">
                      <div className="text-gray-500">Your favorite media will appear here</div>
                    </div>
                  </section>
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* Details sidebar */}
          {currentFile && (
            <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">
              <div className="space-y-6 pb-16">
                <div>
                  {currentFile.mime_type?.startsWith('image/') ? (
                    <Image
                      src={currentFile.file_url}
                      alt={currentFile.alt_text || currentFile.filename}
                      width={400}
                      height={280}
                      className="block aspect-[10/7] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="block aspect-[10/7] w-full rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Preview not available</span>
                    </div>
                  )}
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        <span className="sr-only">Details for </span>
                        {currentFile.title || currentFile.filename}
                      </h2>
                      <p className="text-sm font-medium text-gray-500">
                        {formatFileSize(currentFile.file_size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="relative ml-4 flex size-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <HeartIcon aria-hidden="true" className="size-6" />
                      <span className="sr-only">Favorite</span>
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Information</h3>
                  <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                    <div className="flex justify-between py-3 text-sm font-medium">
                      <dt className="text-gray-500">Uploaded by</dt>
                      <dd className="whitespace-nowrap text-gray-900">Admin</dd>
                    </div>
                    <div className="flex justify-between py-3 text-sm font-medium">
                      <dt className="text-gray-500">Created</dt>
                      <dd className="whitespace-nowrap text-gray-900">
                        {new Date(currentFile.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    {currentFile.width && currentFile.height && (
                      <div className="flex justify-between py-3 text-sm font-medium">
                        <dt className="text-gray-500">Dimensions</dt>
                        <dd className="whitespace-nowrap text-gray-900">
                          {currentFile.width} × {currentFile.height}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between py-3 text-sm font-medium">
                      <dt className="text-gray-500">Type</dt>
                      <dd className="whitespace-nowrap text-gray-900">{currentFile.mime_type}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500 italic">
                      {currentFile.description || currentFile.alt_text || 'Add a description to this image.'}
                    </p>
                    <button
                      type="button"
                      className="relative flex size-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <PencilIcon aria-hidden="true" className="size-5" />
                      <span className="sr-only">Add description</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  {onSelect && (
                    <button
                      type="button"
                      className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                      onClick={() => {
                        onSelect(currentFile)
                        // This is where the actual selection happens
                      }}
                    >
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}