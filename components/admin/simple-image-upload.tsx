'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SimpleImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  aspectRatio?: string
  folder?: string
  maxSize?: number
}

export function SimpleImageUpload({
  value,
  onChange,
  label = "Image",
  aspectRatio = 'aspect-[16/9]',
  folder = 'banners',
  maxSize = 5
}: SimpleImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
      return url
    }
    
    // Otherwise it's a path in our bucket
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/products/${url}`
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Image size must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase storage
      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      setImageUrl(fileName)
      onChange(fileName)
      toast.success(`${label} uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload ${label.toLowerCase()}`)
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDelete = async () => {
    if (!imageUrl) return

    const confirmed = window.confirm(`Are you sure you want to remove this ${label.toLowerCase()}?`)
    if (!confirmed) return

    setDeleting(true)

    try {
      // Extract the file path from the URL if needed
      let filePath = imageUrl
      if (imageUrl.startsWith('http')) {
        // Extract path from full URL
        const url = new URL(imageUrl)
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/products\/(.+)/)
        if (pathMatch) {
          filePath = pathMatch[1]
        }
      }

      // Delete from Supabase storage if it's our file
      if (!imageUrl.startsWith('http') || imageUrl.includes('supabase')) {
        const { error } = await supabase.storage
          .from('products')
          .remove([filePath])

        if (error) console.error('Storage delete error:', error)
      }

      setImageUrl(null)
      onChange(null)
      toast.success(`${label} removed`)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to remove ${label.toLowerCase()}`)
    } finally {
      setDeleting(false)
    }
  }

  const displayUrl = getImageUrl(imageUrl)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg border bg-muted`}>
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!uploading && !deleting && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  type="button"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No image uploaded</p>
              <Button
                variant="outline"
                disabled={uploading}
                className="relative mt-4"
                type="button"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {label}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      {imageUrl && !displayUrl?.includes('supabase') && (
        <p className="text-xs text-muted-foreground">External URL: {imageUrl}</p>
      )}
    </div>
  )
}