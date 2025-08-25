'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MediaItem } from '@/lib/types/media'
import { ImageIcon, X } from 'lucide-react'

interface MediaSelectorProps {
  value?: string | null
  onChange: (media: MediaItem | null) => void
  buttonText?: string
}

export function MediaSelector({
  value,
  onChange,
  buttonText = 'Select Media'
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false)

  // For now, just a placeholder - you'll connect this to your actual media library
  // const handleSelect = (media: MediaItem) => {
  //   onChange(media)
  //   setOpen(false)
  // }

  return (
    <>
      {/* Button or Preview */}
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Selected media"
              fill
              className="object-cover"
            />
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
              onClick={() => onChange(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      )}

      {/* Simple Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <div className="h-full p-6">
            <h2 className="text-2xl font-bold mb-4">Media Library</h2>
            
            {/* This is where your media grid goes */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center text-muted-foreground">
                Media library content here...
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}