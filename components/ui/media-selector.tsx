'use client'

import React, { useState} from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MediaGallery } from '@/components/admin/media-gallery'
import { MediaItem, MediaFolder } from '@/lib/types/media'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface MediaSelectorProps {
  value?: string | null // URL or media ID
  onChange: (media: MediaItem | null) => void
  mimeTypeFilter?: string
  folderFilter?: MediaFolder
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function MediaSelector({
  value,
  onChange,
  mimeTypeFilter = 'image/',
  folderFilter,
  buttonText = 'Select Media',
  buttonVariant = 'outline',
  buttonSize = 'default',
  className
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false)

  // Helper function to get valid image URL
  const getValidUrl = (url: string | null): string | null => {
    if (!url) return null
    
    try {
      // If it's already a full URL, return it
      if (url.startsWith('http')) {
        new URL(url) // Test if valid URL
        return url
      }
      
      // Otherwise construct Supabase storage URL
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) return null
      
      // Try different bucket names based on the file path
      let bucketName = 'products' // Default bucket
      if (url.includes('brand_images') || url.includes('brands/')) {
        bucketName = 'products' // Brands are also in products bucket
      } else if (url.includes('categories/')) {
        bucketName = 'products' // Categories are also in products bucket  
      }
      
      const fullUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${url}`
      new URL(fullUrl) // Test if valid URL
      return fullUrl
    } catch {
      console.warn('Invalid media URL:', url)
      return null
    }
  }

  const handleSelect = (media: MediaItem) => {
    onChange(media)
    setOpen(false)
  }

  const handleRemove = () => {
    onChange(null)
  }

  const renderPreview = () => {
    if (!value || value === '' || typeof value !== 'string') return null

    const isImage = !mimeTypeFilter || mimeTypeFilter.startsWith('image/')
    
    return (
      <div className="relative group">
        <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
          {isImage && value ? (
            (() => {
              const validUrl = getValidUrl(value)
              return validUrl ? (
                <Image
                  src={validUrl}
                  alt="Selected media"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Failed to load selected media:', validUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs">Invalid URL</p>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpen(true)}
          >
            Change
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {value && value !== '' ? (
        renderPreview()
      ) : (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={() => setOpen(true)}
          className={className}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="!fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !p-0 !m-0 !rounded-none !border-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Media Library</DialogTitle>
          <MediaGallery
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
            mimeTypeFilter={mimeTypeFilter}
            folderFilter={folderFilter}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}