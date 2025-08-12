'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2, ImageIcon } from 'lucide-react'
import { uploadBrandImage, deleteBrandImage } from '@/app/admin/brands/actions'

interface BrandImageUploadProps {
  brandId?: string
  imageType: 'logo' | 'banner_1' | 'banner_2'
  currentImageUrl?: string | null
  label: string
  description?: string
  onImageChange?: (url: string | null) => void
  aspectRatio?: string
}

export function BrandImageUpload({
  brandId,
  imageType,
  currentImageUrl,
  label,
  description,
  onImageChange,
  aspectRatio = 'aspect-square'
}: BrandImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    if (!brandId) {
      toast.error('Please save the brand first before uploading images')
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      const newUrl = await uploadBrandImage(brandId, imageType, formData)
      setImageUrl(newUrl)
      onImageChange?.(newUrl)
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
    if (!brandId) return

    const confirmed = window.confirm(`Are you sure you want to delete this ${label.toLowerCase()}?`)
    if (!confirmed) return

    setDeleting(true)

    try {
      await deleteBrandImage(brandId, imageType)
      setImageUrl(null)
      onImageChange?.(null)
      toast.success(`${label} deleted successfully`)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${label.toLowerCase()}`)
    } finally {
      setDeleting(false)
    }
  }

  const displayUrl = getImageUrl(imageUrl)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg border bg-muted`}>
          {displayUrl ? (
            <>
              <Image
                src={displayUrl}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {!uploading && !deleting && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={!brandId}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No image uploaded</p>
              </div>
            </div>
          )}
          
          {(uploading || deleting) && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        <div>
          <input
            type="file"
            id={`${imageType}-upload`}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading || deleting || !brandId}
          />
          <Label
            htmlFor={`${imageType}-upload`}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-colors ${
              !brandId || uploading || deleting
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : displayUrl ? 'Replace Image' : 'Upload Image'}
          </Label>
          {!brandId && (
            <p className="text-xs text-muted-foreground mt-2">
              Save the brand first to upload images
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}