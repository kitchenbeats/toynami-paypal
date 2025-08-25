'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Pencil, Trash2, Plus, Save, X, Settings, 
  Palette, Hash
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GlobalOptionValue {
  id?: string
  option_type_id?: string
  value: string
  display_name: string
  hex_color?: string
  image_url?: string
  sku_suffix?: string
  display_order: number
  is_default: boolean
  is_active: boolean
}

interface GlobalOptionType {
  id?: string
  name: string
  display_name: string
  input_type: 'radio' | 'dropdown' | 'checkbox' | 'text' | 'textarea' | 'color' | 'file'
  is_required: boolean
  display_order: number
  is_active: boolean
  values?: GlobalOptionValue[]
}

interface GlobalOptionsManagerProps {
  initialOptionTypes: GlobalOptionType[]
}

export function GlobalOptionsManager({ initialOptionTypes }: GlobalOptionsManagerProps) {
  const [optionTypes, setOptionTypes] = useState<GlobalOptionType[]>(initialOptionTypes)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)
  const [editingValueId, setEditingValueId] = useState<string | null>(null)
  const [isCreatingType, setIsCreatingType] = useState(false)
  const [isCreatingValue, setIsCreatingValue] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('types')
  
  const [typeFormData, setTypeFormData] = useState<GlobalOptionType>({
    name: '',
    display_name: '',
    input_type: 'radio',
    is_required: false,
    display_order: 0,
    is_active: true,
  })
  
  const [valueFormData, setValueFormData] = useState<GlobalOptionValue>({
    value: '',
    display_name: '',
    hex_color: '',
    sku_suffix: '',
    display_order: 0,
    is_default: false,
    is_active: true,
  })

  const router = useRouter()
  const supabase = createClient()

  const handleCreateType = () => {
    setIsCreatingType(true)
    setEditingTypeId(null)
    setTypeFormData({
      name: '',
      display_name: '',
      input_type: 'radio',
      is_required: false,
      display_order: optionTypes.length,
      is_active: true,
    })
  }

  const handleEditType = (optionType: GlobalOptionType) => {
    setEditingTypeId(optionType.id || null)
    setTypeFormData(optionType)
    setIsCreatingType(false)
  }

  const handleSaveType = async () => {
    try {
      // Generate name from display_name if empty
      if (!typeFormData.name && typeFormData.display_name) {
        typeFormData.name = typeFormData.display_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
      }

      if (isCreatingType) {
        const { data, error } = await supabase
          .from('global_option_types')
          .insert([typeFormData])
          .select()
          .single()
        
        if (error) throw error
        setOptionTypes([...optionTypes, { ...data, values: [] }])
      } else if (editingTypeId) {
        const { data, error } = await supabase
          .from('global_option_types')
          .update(typeFormData)
          .eq('id', editingTypeId)
          .select()
          .single()
        
        if (error) throw error
        setOptionTypes(optionTypes.map(t => 
          t.id === editingTypeId ? { ...data, values: t.values } : t
        ))
      }
      
      handleCancelType()
      router.refresh()
    } catch (error) {
      console.error('Error saving option type:', error)
      alert('Failed to save option type')
    }
  }

  const handleDeleteType = async (id: string) => {
    if (!confirm('Are you sure? This will delete the option type and all its values.')) return
    
    try {
      const { error } = await supabase
        .from('global_option_types')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setOptionTypes(optionTypes.filter(t => t.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting option type:', error)
      alert('Failed to delete option type')
    }
  }

  const handleCancelType = () => {
    setEditingTypeId(null)
    setIsCreatingType(false)
    setTypeFormData({
      name: '',
      display_name: '',
      input_type: 'radio',
      is_required: false,
      display_order: 0,
      is_active: true,
    })
  }

  const handleCreateValue = (typeId: string) => {
    setIsCreatingValue(typeId)
    setEditingValueId(null)
    const optionType = optionTypes.find(t => t.id === typeId)
    setValueFormData({
      value: '',
      display_name: '',
      hex_color: '',
      sku_suffix: '',
      display_order: optionType?.values?.length || 0,
      is_default: false,
      is_active: true,
    })
  }

  const handleEditValue = (value: GlobalOptionValue) => {
    setEditingValueId(value.id || null)
    setValueFormData(value)
    setIsCreatingValue(null)
  }

  const handleSaveValue = async () => {
    try {
      const valueData = { 
        ...valueFormData, 
        option_type_id: isCreatingValue || editingValueId ? 
          optionTypes.find(t => t.id === isCreatingValue)?.id || 
          optionTypes.find(t => t.values?.some(v => v.id === editingValueId))?.id
          : undefined
      }

      if (isCreatingValue) {
        const { data, error } = await supabase
          .from('global_option_values')
          .insert([valueData])
          .select()
          .single()
        
        if (error) throw error
        
        // Update local state
        setOptionTypes(optionTypes.map(t => 
          t.id === isCreatingValue 
            ? { ...t, values: [...(t.values || []), data] }
            : t
        ))
      } else if (editingValueId) {
        const { data, error } = await supabase
          .from('global_option_values')
          .update(valueData)
          .eq('id', editingValueId)
          .select()
          .single()
        
        if (error) throw error
        
        // Update local state
        setOptionTypes(optionTypes.map(t => ({
          ...t,
          values: t.values?.map(v => v.id === editingValueId ? data : v)
        })))
      }
      
      handleCancelValue()
      router.refresh()
    } catch (error) {
      console.error('Error saving option value:', error)
      alert('Failed to save option value')
    }
  }

  const handleDeleteValue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this option value?')) return
    
    try {
      const { error } = await supabase
        .from('global_option_values')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Update local state
      setOptionTypes(optionTypes.map(t => ({
        ...t,
        values: t.values?.filter(v => v.id !== id)
      })))
      
      router.refresh()
    } catch (error) {
      console.error('Error deleting option value:', error)
      alert('Failed to delete option value')
    }
  }

  const handleCancelValue = () => {
    setEditingValueId(null)
    setIsCreatingValue(null)
    setValueFormData({
      value: '',
      display_name: '',
      hex_color: '',
      sku_suffix: '',
      display_order: 0,
      is_default: false,
      is_active: true,
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="types">Option Types</TabsTrigger>
        <TabsTrigger value="values">Option Values</TabsTrigger>
      </TabsList>

      <TabsContent value="types" className="space-y-6">
        {/* Add New Option Type Button */}
        <div className="flex justify-end">
          <Button onClick={handleCreateType} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Option Type
          </Button>
        </div>

        {/* Create/Edit Option Type Form */}
        {(isCreatingType || editingTypeId) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isCreatingType ? 'Create Option Type' : 'Edit Option Type'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name">Display Name *</Label>
                  <Input
                    id="display_name"
                    value={typeFormData.display_name}
                    onChange={(e) => setTypeFormData({ 
                      ...typeFormData, 
                      display_name: e.target.value 
                    })}
                    placeholder="e.g., Size, Color, Material"
                  />
                </div>
                <div>
                  <Label htmlFor="name">System Name</Label>
                  <Input
                    id="name"
                    value={typeFormData.name}
                    onChange={(e) => setTypeFormData({ 
                      ...typeFormData, 
                      name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                    })}
                    placeholder="Auto-generated from display name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used in code (lowercase, underscores only)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="input_type">Input Type</Label>
                  <Select
                    value={typeFormData.input_type}
                    onValueChange={(value) => 
                      setTypeFormData({ ...typeFormData, input_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radio">Radio Buttons</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="checkbox">Checkboxes</SelectItem>
                      <SelectItem value="color">Color Picker</SelectItem>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={typeFormData.display_order}
                    onChange={(e) => setTypeFormData({ 
                      ...typeFormData, 
                      display_order: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_required"
                    checked={typeFormData.is_required}
                    onCheckedChange={(checked) => 
                      setTypeFormData({ ...typeFormData, is_required: checked })
                    }
                  />
                  <Label htmlFor="is_required">Required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={typeFormData.is_active}
                    onCheckedChange={(checked) => 
                      setTypeFormData({ ...typeFormData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelType}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveType}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Option Type
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Option Types List */}
        <div className="grid gap-4">
          {optionTypes.map((optionType) => (
            <Card key={optionType.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{optionType.display_name}</h3>
                        <Badge variant="outline">{optionType.input_type}</Badge>
                        {optionType.is_required && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                        {!optionType.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        System name: {optionType.name} • {optionType.values?.length || 0} values
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditType(optionType)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => optionType.id && handleDeleteType(optionType.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="values" className="space-y-6">
        <div className="text-sm text-muted-foreground mb-4">
          Manage individual values for each option type (e.g., XS, S, M, L for Size).
        </div>

        {optionTypes.map((optionType) => (
          <Card key={optionType.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {optionType.input_type === 'color' && <Palette className="h-5 w-5" />}
                    {optionType.input_type === 'text' && <Hash className="h-5 w-5" />}
                    {['radio', 'dropdown', 'checkbox'].includes(optionType.input_type) && 
                      <Settings className="h-5 w-5" />}
                    {optionType.display_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {optionType.values?.length || 0} values • {optionType.input_type} input
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => optionType.id && handleCreateValue(optionType.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </CardHeader>

            {/* Create/Edit Value Form */}
            {(isCreatingValue === optionType.id || 
              (editingValueId && optionType.values?.some(v => v.id === editingValueId))) && (
              <CardContent className="border-t">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Value *</Label>
                      <Input
                        id="value"
                        value={valueFormData.value}
                        onChange={(e) => setValueFormData({ 
                          ...valueFormData, 
                          value: e.target.value.toLowerCase()
                        })}
                        placeholder="e.g., xs, red, cotton"
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_name">Display Name *</Label>
                      <Input
                        id="display_name"
                        value={valueFormData.display_name}
                        onChange={(e) => setValueFormData({ 
                          ...valueFormData, 
                          display_name: e.target.value 
                        })}
                        placeholder="e.g., Extra Small, Bright Red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {optionType.input_type === 'color' && (
                      <div>
                        <Label htmlFor="hex_color">Hex Color</Label>
                        <Input
                          id="hex_color"
                          value={valueFormData.hex_color}
                          onChange={(e) => setValueFormData({ 
                            ...valueFormData, 
                            hex_color: e.target.value 
                          })}
                          placeholder="#FF0000"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="sku_suffix">SKU Suffix</Label>
                      <Input
                        id="sku_suffix"
                        value={valueFormData.sku_suffix}
                        onChange={(e) => setValueFormData({ 
                          ...valueFormData, 
                          sku_suffix: e.target.value.toUpperCase()
                        })}
                        placeholder="e.g., -XS, -RED"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_default"
                        checked={valueFormData.is_default}
                        onCheckedChange={(checked) => 
                          setValueFormData({ ...valueFormData, is_default: checked })
                        }
                      />
                      <Label htmlFor="is_default">Default Value</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active_value"
                        checked={valueFormData.is_active}
                        onCheckedChange={(checked) => 
                          setValueFormData({ ...valueFormData, is_active: checked })
                        }
                      />
                      <Label htmlFor="is_active_value">Active</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelValue}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveValue}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Value
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Values List */}
            <CardContent>
              <div className="grid gap-2">
                {optionType.values?.map((value) => (
                  <div 
                    key={value.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {value.hex_color && (
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: value.hex_color }}
                        />
                      )}
                      <div>
                        <span className="font-medium">{value.display_name}</span>
                        <span className="text-muted-foreground ml-2">({value.value})</span>
                        {value.sku_suffix && (
                          <Badge variant="outline" className="ml-2">
                            {value.sku_suffix}
                          </Badge>
                        )}
                        {value.is_default && (
                          <Badge className="ml-2 bg-blue-500">Default</Badge>
                        )}
                        {!value.is_active && (
                          <Badge variant="secondary" className="ml-2">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditValue(value)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => value.id && handleDeleteValue(value.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!optionType.values || optionType.values.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No values created yet. Click &quot;Add Value&quot; to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  )
}