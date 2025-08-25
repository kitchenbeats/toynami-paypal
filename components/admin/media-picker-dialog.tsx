'use client'

import React, { useState } from 'react'
import { MediaItem, MediaFolder } from '@/lib/types/media'
import { MediaManager } from './media-manager'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

interface MediaPickerDialogProps {
  value?: string | null // Can be a URL or media ID
  onChange: (mediaItem: MediaItem | null) => void
  buttonLabel?: string
  dialogTitle?: string
  mimeTypeFilter?: string
  folderFilter?: MediaFolder
  className?: string
}

export function MediaPickerDialog({
  value,
  onChange,
  buttonLabel = "Select Media",
  dialogTitle = "Select Media",
  mimeTypeFilter = "image/",
  folderFilter,
  className
}: MediaPickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)

  const handleSelect = (media: MediaItem) => {
    setSelectedMedia(media)
    setPreviewUrl(media.file_url)
    onChange(media)
    setOpen(false)
  }

  const handleRemove = () => {
    setSelectedMedia(null)
    setPreviewUrl(null)
    onChange(null)
  }

  return (
    <div className={className}>
      {previewUrl ? (
        <div className="relative group">
          <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
            {mimeTypeFilter?.startsWith('image/') ? (
              <Image
                src={previewUrl}
                alt={selectedMedia?.alt_text || 'Selected media'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  {selectedMedia?.filename || 'Selected file'}
                </p>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <MediaManager
                  onSelect={handleSelect}
                  selectionMode="single"
                  mimeTypeFilter={mimeTypeFilter}
                  folderFilter={folderFilter}
                />
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <ImagePlus className="w-4 h-4 mr-2" />
              {buttonLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <MediaManager
              onSelect={handleSelect}
              selectionMode="single"
              mimeTypeFilter={mimeTypeFilter}
              folderFilter={folderFilter}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}