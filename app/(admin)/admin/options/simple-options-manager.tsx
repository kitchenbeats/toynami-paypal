'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, Save, X, Trash2, GripVertical, 
  Check, Pencil, Copy
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OptionValue {
  id?: string
  value: string
  label: string
  sku_suffix: string
  is_default: boolean
}

interface OptionType {
  id?: string
  display_name: string
  option_name: string
  type: 'dropdown' | 'buttons' | 'swatches' | 'radio'
  values: OptionValue[]
  is_active: boolean
}

interface Props {
  initialOptions: OptionType[]
}

export function SimpleOptionsManager({ initialOptions }: Props) {
  const [options, setOptions] = useState<OptionType[]>(initialOptions)
  const [editingOption, setEditingOption] = useState<OptionType | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const createNewOption = () => {
    setIsCreating(true)
    setEditingOption({
      display_name: '',
      option_name: '',
      type: 'dropdown',
      values: [
        { value: '', label: '', sku_suffix: '', is_default: true }
      ],
      is_active: true
    })
  }

  const addValue = () => {
    if (!editingOption) return
    
    setEditingOption({
      ...editingOption,
      values: [
        ...editingOption.values,
        { value: '', label: '', sku_suffix: '', is_default: false }
      ]
    })
  }

  const removeValue = (index: number) => {
    if (!editingOption) return
    
    const newValues = editingOption.values.filter((_, i) => i !== index)
    // Ensure at least one value is default
    if (newValues.length > 0 && !newValues.some(v => v.is_default)) {
      newValues[0].is_default = true
    }
    
    setEditingOption({
      ...editingOption,
      values: newValues
    })
  }

  const updateValue = (index: number, field: keyof OptionValue, value: any) => {
    if (!editingOption) return
    
    const newValues = [...editingOption.values]
    
    // If setting as default, unset others
    if (field === 'is_default' && value === true) {
      newValues.forEach((v, i) => {
        v.is_default = i === index
      })
    } else {
      newValues[index] = { ...newValues[index], [field]: value }
    }
    
    // Auto-generate SKU suffix from value if not set
    if (field === 'value' && !newValues[index].sku_suffix) {
      newValues[index].sku_suffix = `-${value.toUpperCase()}`
    }
    
    setEditingOption({
      ...editingOption,
      values: newValues
    })
  }

  const generateOptionName = (displayName: string) => {
    return displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  }

  const saveOption = async () => {
    if (!editingOption) return
    
    // Validation
    if (!editingOption.display_name) {
      toast.error('Display name is required')
      return
    }
    
    if (editingOption.values.length === 0) {
      toast.error('At least one value is required')
      return
    }
    
    if (editingOption.values.some(v => !v.label)) {
      toast.error('All values must have labels')
      return
    }
    
    try {
      // Auto-generate option name if not set
      if (!editingOption.option_name) {
        editingOption.option_name = generateOptionName(editingOption.display_name)
      }
      
      // Auto-generate values if not set
      editingOption.values.forEach(v => {
        if (!v.value) {
          v.value = v.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')
        }
        if (!v.sku_suffix) {
          v.sku_suffix = `-${v.value.toUpperCase()}`
        }
      })
      
      if (isCreating) {
        // Create new option type
        const { data: optionType, error: typeError } = await supabase
          .from('global_option_types')
          .insert({
            name: editingOption.option_name,
            display_name: editingOption.display_name,
            input_type: editingOption.type,
            is_active: editingOption.is_active,
            display_order: options.length
          })
          .select()
          .single()
        
        if (typeError) throw typeError
        
        // Create option values
        const valuesToInsert = editingOption.values.map((v, index) => ({
          option_type_id: optionType.id,
          value: v.value,
          display_name: v.label,
          sku_suffix: v.sku_suffix,
          is_default: v.is_default,
          display_order: index,
          is_active: true
        }))
        
        const { error: valuesError } = await supabase
          .from('global_option_values')
          .insert(valuesToInsert)
        
        if (valuesError) throw valuesError
        
      } else if (editingOption.id) {
        // Update existing option type
        const { error: typeError } = await supabase
          .from('global_option_types')
          .update({
            display_name: editingOption.display_name,
            input_type: editingOption.type,
            is_active: editingOption.is_active
          })
          .eq('id', editingOption.id)
        
        if (typeError) throw typeError
        
        // Delete existing values and recreate (simpler than complex update logic)
        await supabase
          .from('global_option_values')
          .delete()
          .eq('option_type_id', editingOption.id)
        
        // Create new values
        const valuesToInsert = editingOption.values.map((v, index) => ({
          option_type_id: editingOption.id,
          value: v.value,
          display_name: v.label,
          sku_suffix: v.sku_suffix,
          is_default: v.is_default,
          display_order: index,
          is_active: true
        }))
        
        const { error: valuesError } = await supabase
          .from('global_option_values')
          .insert(valuesToInsert)
        
        if (valuesError) throw valuesError
      }
      
      toast.success('Option saved successfully')
      setEditingOption(null)
      setIsCreating(false)
      router.refresh()
      
    } catch (error) {
      console.error('Error saving option:', error)
      toast.error('Failed to save option')
    }
  }

  const deleteOption = async (id: string) => {
    if (!confirm('Delete this option? This will remove it from all products.')) return
    
    try {
      const { error } = await supabase
        .from('global_option_types')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('Option deleted')
      router.refresh()
    } catch (error) {
      console.error('Error deleting option:', error)
      toast.error('Failed to delete option')
    }
  }

  const duplicateOption = (option: OptionType) => {
    setIsCreating(true)
    setEditingOption({
      ...option,
      id: undefined,
      display_name: `${option.display_name} (Copy)`,
      option_name: `${option.option_name}_copy`,
      values: option.values.map(v => ({ ...v, id: undefined }))
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Options</h2>
          <p className="text-muted-foreground">
            Create reusable options like Size and Color that can be applied to products
          </p>
        </div>
        <Button onClick={createNewOption}>
          <Plus className="h-4 w-4 mr-2" />
          Create Option
        </Button>
      </div>

      {/* Create/Edit Form */}
      {editingOption && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Option' : 'Edit Option'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Display name</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Visible to customers on storefront
                  </p>
                  <Input
                    value={editingOption.display_name}
                    onChange={(e) => setEditingOption({
                      ...editingOption,
                      display_name: e.target.value
                    })}
                    placeholder="Color, Size, etc."
                  />
                </div>
                <div>
                  <Label>Option name</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Unique identifier for managing options, not visible to customers
                  </p>
                  <Input
                    value={editingOption.option_name}
                    onChange={(e) => setEditingOption({
                      ...editingOption,
                      option_name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                    })}
                    placeholder="Auto-generated from display name"
                  />
                </div>
              </div>
            </div>

            {/* Type */}
            <div>
              <Label>Type</Label>
              <Select
                value={editingOption.type}
                onValueChange={(value: any) => setEditingOption({
                  ...editingOption,
                  type: value
                })}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="radio">Radio Select</SelectItem>
                  <SelectItem value="buttons">Buttons</SelectItem>
                  <SelectItem value="swatches">Color Swatches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Option Values */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Option Values</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addValue}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
                  <div className="col-span-3">Display Label</div>
                  <div className="col-span-3">Value</div>
                  <div className="col-span-3">SKU Suffix</div>
                  <div className="col-span-2">Default</div>
                  <div className="col-span-1"></div>
                </div>
                
                {editingOption.values.map((value, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Input
                        value={value.label}
                        onChange={(e) => updateValue(index, 'label', e.target.value)}
                        placeholder="Extra Small"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={value.value}
                        onChange={(e) => updateValue(index, 'value', e.target.value)}
                        placeholder="xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={value.sku_suffix}
                        onChange={(e) => updateValue(index, 'sku_suffix', e.target.value)}
                        placeholder="-XS"
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <Button
                        type="button"
                        variant={value.is_default ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateValue(index, 'is_default', true)}
                      >
                        {value.is_default && <Check className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValue(index)}
                        disabled={editingOption.values.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingOption(null)
                  setIsCreating(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveOption}>
                <Save className="h-4 w-4 mr-2" />
                Save Option
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Options List */}
      <div className="grid gap-4">
        {options.map((option) => (
          <Card key={option.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {option.display_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.option_name} • {option.type}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <Badge key={value.id} variant="secondary">
                        {value.label}
                        {value.is_default && (
                          <Check className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateOption(option)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingOption(option)
                      setIsCreating(false)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => option.id && deleteOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {options.length === 0 && !editingOption && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No options created yet
              </p>
              <Button onClick={createNewOption}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Option
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}