'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { SimpleImageUpload } from '@/components/admin/simple-image-upload'
import { 
  getCarouselSlides, 
  getCarouselSettings,
  updateCarouselSlides,
  updateCarouselSettings
} from '@/lib/data/carousel'

interface SlideForm {
  id: string
  heading: string
  text: string
  button_text: string
  link: string
  image_url: string
  is_active: boolean
}

export default function CarouselAdminPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<SlideForm[]>([])
  const [swapInterval, setSwapInterval] = useState(5)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [slidesData, settingsData] = await Promise.all([
        getCarouselSlides(true), // Include inactive slides
        getCarouselSettings()
      ])
      
      setSlides(slidesData.map(slide => ({
        id: slide.id,
        heading: slide.heading || '',
        text: slide.text || '',
        button_text: slide.button_text || '',
        link: slide.link || '',
        image_url: slide.image_url || '',
        is_active: slide.is_active
      })))
      
      setSettings(settingsData)
      setSwapInterval(Math.floor(settingsData.swap_interval / 1000))
    } catch (error) {
      console.error('Error loading carousel data:', error)
      setMessage({ type: 'error', text: 'Failed to load carousel data' })
    } finally {
      setLoading(false)
    }
  }

  const addSlide = () => {
    const newSlide: SlideForm = {
      id: `new_${Date.now()}`,
      heading: '',
      text: '',
      button_text: '',
      link: '',
      image_url: '',
      is_active: true
    }
    setSlides([...slides, newSlide])
  }

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index))
  }

  const updateSlide = (index: number, field: keyof SlideForm, value: string | boolean) => {
    const updatedSlides = [...slides]
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value
    }
    setSlides(updatedSlides)
  }

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === index) return

    const draggedSlide = slides[draggedItem]
    const newSlides = slides.filter((_, i) => i !== draggedItem)
    newSlides.splice(index, 0, draggedSlide)
    
    setSlides(newSlides)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      // Validate swap interval
      const intervalMs = swapInterval * 1000
      if (intervalMs < 1000 || intervalMs > 90000) {
        setMessage({ type: 'error', text: 'Swap interval must be between 1 and 90 seconds' })
        setSaving(false)
        return
      }

      // Update slides
      const slidesResult = await updateCarouselSlides(
        slides.map((slide, index) => ({
          heading: slide.heading || null,
          text: slide.text || null,
          button_text: slide.button_text || null,
          link: slide.link || null,
          image_url: slide.image_url || null,
          display_order: index,
          is_active: slide.is_active
        }))
      )
      
      if (!slidesResult.success) {
        throw new Error(slidesResult.error)
      }

      // Update settings
      const settingsResult = await updateCarouselSettings({
        swap_interval: intervalMs,
        is_autoplay: true
      })
      
      if (!settingsResult.success) {
        throw new Error(settingsResult.error)
      }

      setMessage({ type: 'success', text: 'Carousel saved successfully!' })
      
      // Reload data to get fresh IDs
      await loadData()
    } catch (error) {
      console.error('Error saving carousel:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save carousel' 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading carousel data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Homepage Carousel</h1>
        <p className="text-gray-600">Manage your homepage carousel slides</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </div>
        </Alert>
      )}

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="swap-interval">Swap Every (seconds)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="swap-interval"
                type="number"
                min="1"
                max="90"
                value={swapInterval}
                onChange={(e) => setSwapInterval(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600">Must be between 1-90 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slides */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Slides</h2>
          <Button onClick={addSlide} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Button>
        </div>

        {slides.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            No slides yet. Click &quot;Add Slide&quot; to create your first slide.
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Click and drag to change the slide order.</p>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg shadow-sm border p-6 cursor-move ${
                  draggedItem === index ? 'opacity-50' : ''
                } ${!slide.is_active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-2">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Slide {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={slide.is_active}
                            onChange={(e) => updateSlide(index, 'is_active', e.target.checked)}
                            className="rounded"
                          />
                          Active
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSlide(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`heading-${index}`}>Heading</Label>
                        <Input
                          id={`heading-${index}`}
                          value={slide.heading}
                          onChange={(e) => updateSlide(index, 'heading', e.target.value)}
                          placeholder="Enter slide heading"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`button-${index}`}>Button Text</Label>
                        <Input
                          id={`button-${index}`}
                          value={slide.button_text}
                          onChange={(e) => updateSlide(index, 'button_text', e.target.value)}
                          placeholder="e.g., Shop Now"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`text-${index}`}>Text</Label>
                      <Input
                        id={`text-${index}`}
                        value={slide.text}
                        onChange={(e) => updateSlide(index, 'text', e.target.value)}
                        placeholder="Enter slide description"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`link-${index}`}>Link</Label>
                      <Input
                        id={`link-${index}`}
                        value={slide.link}
                        onChange={(e) => updateSlide(index, 'link', e.target.value)}
                        placeholder="e.g., /products/robotech-collection"
                      />
                    </div>
                    
                    <SimpleImageUpload
                      value={slide.image_url}
                      onChange={(url) => updateSlide(index, 'image_url', url || '')}
                      label="Slide Image"
                      aspectRatio="aspect-[21/9]"
                      folder="carousel"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}