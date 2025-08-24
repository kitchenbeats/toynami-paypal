'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2, ImageIcon } from 'lucide-react'
import { uploadBlogImage, deleteBlogImage } from '@/app/(admin)/admin/blog/actions'

interface BlogImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  aspectRatio?: string
  imageType: 'featured_image' | 'thumbnail_url'
  maxSize?: number
}

export function BlogImageUpload({
  value,
  onChange,
  label = "Image",
  aspectRatio = 'aspect-[16/9]',
  imageType,
  maxSize = 5
}: BlogImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const getImageUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/products/${path}`
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
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      // Upload using server action
      const filePath = await uploadBlogImage(imageType, formData)

      setImageUrl(filePath)
      onChange(filePath)
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
      // Delete using server action
      await deleteBlogImage(imageUrl)

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
    </div>
  )
}