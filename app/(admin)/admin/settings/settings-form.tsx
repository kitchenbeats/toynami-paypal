'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Mail, Search, Settings } from 'lucide-react'

interface Setting {
  id: string
  key: string
  value: string | null
  type: string
  category: string
  label: string
  description: string | null
}

interface SettingsFormProps {
  groupedSettings: Record<string, Setting[]>
}

const categoryIcons: Record<string, string | boolean> = {
  social: Globe,
  general: Settings,
  seo: Search,
  email: Mail
}

const categoryTitles: Record<string, string> = {
  social: 'Social Media',
  general: 'General',
  seo: 'SEO',
  email: 'Email & Newsletter'
}

const socialIcons: Record<string, string | boolean> = {
  social_facebook: Facebook,
  social_twitter: Twitter,
  social_instagram: Instagram,
  social_linkedin: Linkedin,
  social_youtube: Youtube
}

export function SettingsForm({ groupedSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<Record<string, Setting[]>>(groupedSettings)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const handleChange = (category: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category].map(setting =>
        setting.key === key ? { ...setting, value } : setting
      )
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Flatten all settings
      const allSettings = Object.values(settings).flat()
      
      // Update each setting
      for (const setting of allSettings) {
        const { error } = await supabase
          .from('settings')
          .update({ value: setting.value || '' })
          .eq('id', setting.id)
        
        if (error) {
          console.error(`Failed to update setting ${setting.id}:`, error)
        }
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      
      // Refresh the page after a short delay to show the new settings in footer
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const renderInput = (setting: Setting, category: string) => {
    const Icon = socialIcons[setting.key]
    
    switch (setting.type) {
      case 'url':
        return (
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />}
            <Input
              type="url"
              value={setting.value || ''}
              onChange={(e) => handleChange(category, setting.key, e.target.value)}
              placeholder={setting.description || ''}
              className={Icon ? 'pl-10' : ''}
            />
          </div>
        )
      case 'text':
        if (setting.key.includes('description') || setting.key.includes('address')) {
          return (
            <Textarea
              value={setting.value || ''}
              onChange={(e) => handleChange(category, setting.key, e.target.value)}
              placeholder={setting.description || ''}
              rows={3}
            />
          )
        }
        return (
          <Input
            type="text"
            value={setting.value || ''}
            onChange={(e) => handleChange(category, setting.key, e.target.value)}
            placeholder={setting.description || ''}
          />
        )
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={setting.key}
              checked={setting.value === 'true'}
              onChange={(e) => handleChange(category, setting.key, e.target.checked ? 'true' : 'false')}
              className="h-4 w-4"
            />
            <Label htmlFor={setting.key}>Enable</Label>
          </div>
        )
      default:
        return (
          <Input
            type="text"
            value={setting.value || ''}
            onChange={(e) => handleChange(category, setting.key, e.target.value)}
            placeholder={setting.description || ''}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(settings).map(category => {
            const Icon = categoryIcons[category]
            return (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {categoryTitles[category] || category}
              </TabsTrigger>
            )
          })}
        </TabsList>
        
        {Object.entries(settings).map(([category, categorySettings]) => {
          const Icon = categoryIcons[category]
          
          return (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {Icon && <Icon className="h-5 w-5" />}
                    {categoryTitles[category] || category} Settings
                  </CardTitle>
                  <CardDescription>
                    {category === 'social' && 'Manage your social media links'}
                    {category === 'general' && 'General site configuration'}
                    {category === 'seo' && 'Search engine optimization settings'}
                    {category === 'email' && 'Email and newsletter configuration'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySettings.map(setting => (
                    <div key={setting.id} className="space-y-2">
                      <Label htmlFor={setting.key}>
                        {setting.label}
                        {setting.description && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({setting.description})
                          </span>
                        )}
                      </Label>
                      {renderInput(setting, category)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}