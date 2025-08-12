'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Upload, Trash2, GripVertical, Star, 
  ImagePlus, X, Loader2, Check 
} from 'lucide-react'
import {
  uploadProductImage,
  deleteProductImage,
  updateImagePosition,
  updateImageAltText,
  setImageAsPrimary
} from '@/app/admin/products/[id]/actions'

interface ProductImage {
  id: string
  product_id: number
  image_filename: string
  alt_text: string | null
  position: number
  is_primary: boolean
}

interface ProductImagesManagerProps {
  productId: number
  initialImages: ProductImage[]
  onImagesChange?: (images: ProductImage[]) => void
}

function SortableImage({ 
  image, 
  onRemove, 
  onSetPrimary,
  isDragging 
}: { 
  image: ProductImage
  onRemove: () => void
  onSetPrimary: () => void
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getImageUrl = (filename: string) => {
    if (filename.startsWith('http')) {
      return filename
    } else if (filename.includes('bigcommerce')) {
      return `https://cdn11.bigcommerce.com/s-2x00x/${filename}`
    } else {
      return `https://www.toynami.com/uploads/${filename}`
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <Card className="overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={getImageUrl(image.image_filename)}
            alt={image.alt_text || 'Product image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 p-1.5 bg-white/90 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Primary Badge */}
          {image.is_primary && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">
              Primary
            </Badge>
          )}

          {/* Actions */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!image.is_primary && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onSetPrimary}
                title="Set as primary"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Position Number */}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            #{image.position + 1}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function ProductImagesManager({
  productId,
  initialImages,
  onImagesChange
}: ProductImagesManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(
    initialImages.sort((a, b) => a.position - b.position)
  )
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    initialImages.length > 0 ? initialImages[0] : null
  )
  const [uploading, setUploading] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [altText, setAltText] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update alt text when selected image changes
  useEffect(() => {
    if (selectedImage) {
      setAltText(selectedImage.alt_text || '')
    }
  }, [selectedImage])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedId(null)

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        position: idx
      }))

      setImages(newImages)
      onImagesChange?.(newImages)

      // Update positions in database
      try {
        const updates = newImages.map(img => 
          updateImagePosition(img.id, img.position)
        )
        
        await Promise.all(updates)
        toast.success('Image order updated')
      } catch (error) {
        console.error('Error updating image positions:', error)
        toast.error('Failed to update image order')
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: ProductImage[] = []

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          continue
        }

        // Create FormData for server action
        const formData = new FormData()
        formData.append('file', file)

        try {
          const imageData = await uploadProductImage(productId, formData)
          newImages.push(imageData)
          toast.success(`Uploaded ${file.name}`)
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages]
        setImages(updatedImages)
        onImagesChange?.(updatedImages)
        // Select first new image
        setSelectedImage(newImages[0])
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleRemoveImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    const confirmed = window.confirm('Are you sure you want to delete this image?')
    if (!confirmed) return

    try {
      await deleteProductImage(imageId, image.image_filename)

      // Update local state
      const newImages = images
        .filter(img => img.id !== imageId)
        .map((img, idx) => ({ ...img, position: idx }))
      
      setImages(newImages)
      onImagesChange?.(newImages)
      
      // If we removed the selected image, select another
      if (selectedImage?.id === imageId) {
        setSelectedImage(newImages.length > 0 ? newImages[0] : null)
      }
      
      // If we removed the primary image, set the first image as primary
      if (image.is_primary && newImages.length > 0) {
        await handleSetPrimary(newImages[0].id)
      }

      toast.success('Image deleted')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      await setImageAsPrimary(productId, imageId)

      // Update local state
      const newImages = images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }))
      
      setImages(newImages)
      onImagesChange?.(newImages)
      
      // Update selected image if it's the one being set as primary
      if (selectedImage?.id === imageId) {
        setSelectedImage({ ...selectedImage, is_primary: true })
      }
      
      toast.success('Primary image updated')
    } catch (error) {
      console.error('Error setting primary image:', error)
      toast.error('Failed to set primary image')
    }
  }

  const handleUpdateAltText = async () => {
    if (!selectedImage) return

    try {
      await updateImageAltText(selectedImage.id, altText)

      // Update local state
      const newImages = images.map(img => 
        img.id === selectedImage.id ? { ...img, alt_text: altText } : img
      )
      setImages(newImages)
      setSelectedImage({ ...selectedImage, alt_text: altText })
      onImagesChange?.(newImages)
      toast.success('Alt text updated')
    } catch (error) {
      console.error('Error updating alt text:', error)
      toast.error('Failed to update alt text')
    }
  }

  const getImageUrl = (filename: string) => {
    if (filename.startsWith('http')) {
      return filename
    } else if (filename.includes('bigcommerce')) {
      return `https://cdn11.bigcommerce.com/s-2x00x/${filename}`
    } else {
      return `https://www.toynami.com/uploads/${filename}`
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Images Grid */}
      <div className="lg:col-span-2 space-y-4">
        {images.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Product Images ({images.length})</h3>
              <p className="text-sm text-muted-foreground">
                Click to select • Drag to reorder
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(event) => setDraggedId(event.active.id as string)}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map(img => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedImage?.id === image.id 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : ''
                      }`}
                    >
                      <SortableImage
                        image={image}
                        onRemove={() => handleRemoveImage(image.id)}
                        onSetPrimary={() => handleSetPrimary(image.id)}
                        isDragging={draggedId === image.id}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <ImagePlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No images yet</p>
              <p className="text-sm text-muted-foreground">
                Upload images using the panel on the right
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Right: Upload & Details Panel */}
      <div className="space-y-4">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF (max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Image Details Section */}
        {selectedImage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Image Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview */}
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={getImageUrl(selectedImage.image_filename)}
                  alt={selectedImage.alt_text || 'Product image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {selectedImage.is_primary && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Primary Image
                  </Badge>
                )}
              </div>

              {/* Image Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">#{selectedImage.position + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {selectedImage.is_primary ? 'Primary' : 'Secondary'}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="alt-text">Alt Text (SEO)</Label>
                <div className="flex gap-2">
                  <Input
                    id="alt-text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe this image"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateAltText}
                    disabled={altText === selectedImage.alt_text}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Important for SEO and accessibility
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!selectedImage.is_primary && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSetPrimary(selectedImage.id)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set as Primary
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleRemoveImage(selectedImage.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}