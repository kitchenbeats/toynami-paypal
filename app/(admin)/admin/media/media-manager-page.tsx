'use client'

import React, { useState } from 'react'
import { MediaManager } from '@/components/admin/media-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Image, FileText, Film, Music, Archive } from 'lucide-react'

export function MediaManagerPage() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { value: 'all', label: 'All Media', icon: Archive },
    { value: 'images', label: 'Images', icon: Image, mimeType: 'image/' },
    { value: 'videos', label: 'Videos', icon: Film, mimeType: 'video/' },
    { value: 'documents', label: 'Documents', icon: FileText, mimeType: 'application/' },
    { value: 'audio', label: 'Audio', icon: Music, mimeType: 'audio/' },
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen w-full flex flex-col">
      <TabsList className="mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="flex-1">
          <MediaManager
            mimeTypeFilter={tab.mimeType}
            allowUpload={true}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}