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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Pencil, Trash2, Plus, Save, X, Settings, Package,
  DollarSign, BarChart3, Palette, Hash, ChevronRight,
  ShoppingBag, Layers, Grid3x3, List, ToggleLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  // For product-specific pricing
  price?: number
  stock?: number
}

interface GlobalOptionType {
  id?: string
  name: string
  display_name: string
  input_type: 'radio' | 'dropdown' | 'checkbox' | 'buttons' | 'swatches' | 'grid'
  is_required: boolean
  display_order: number
  is_active: boolean
  values?: GlobalOptionValue[]
}

interface ProductAssignment {
  product_id: number
  product_name: string
  option_type_id: string
  is_required: boolean
  pricing?: Array<{
    option_value_id: string
    price_adjustment_cents: number
    stock_override?: number
    is_available: boolean
  }>
}

interface Props {
  initialOptionTypes: GlobalOptionType[]
  products?: Array<{ id: number; name: string; sku: string }>
  assignments?: ProductAssignment[]
}

export function EnhancedOptionsManager({ initialOptionTypes, products = [], assignments = [] }: Props) {
  const [optionTypes, setOptionTypes] = useState<GlobalOptionType[]>(initialOptionTypes)
  const [activeTab, setActiveTab] = useState('manage')
  const [selectedOptionType, setSelectedOptionType] = useState<GlobalOptionType | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [editingType, setEditingType] = useState<GlobalOptionType | null>(null)
  const [editingValue, setEditingValue] = useState<GlobalOptionValue | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Display type icons
  const DisplayTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'buttons': return <Grid3x3 className="h-4 w-4" />
      case 'dropdown': return <List className="h-4 w-4" />
      case 'swatches': return <Palette className="h-4 w-4" />
      case 'radio': return <ToggleLeft className="h-4 w-4" />
      case 'grid': return <Layers className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const handleSaveOptionType = async () => {
    if (!editingType) return
    
    try {
      if (editingType.id) {
        // Update existing
        const { error } = await supabase
          .from('global_option_types')
          .update({
            name: editingType.name,
            display_name: editingType.display_name,
            input_type: editingType.input_type,
            is_required: editingType.is_required,
            display_order: editingType.display_order,
            is_active: editingType.is_active
          })
          .eq('id', editingType.id)
        
        if (error) throw error
      } else {
        // Create new
        const { data, error } = await supabase
          .from('global_option_types')
          .insert({
            name: editingType.name || editingType.display_name.toLowerCase().replace(/\s+/g, '_'),
            display_name: editingType.display_name,
            input_type: editingType.input_type,
            is_required: editingType.is_required,
            display_order: editingType.display_order,
            is_active: editingType.is_active
          })
          .select()
          .single()
        
        if (error) throw error
        if (data) {
          setOptionTypes([...optionTypes, { ...data, values: [] }])
        }
      }
      
      toast.success('Option type saved successfully')
      setEditingType(null)
      router.refresh()
    } catch (error) {
      console.error('Error saving option type:', error)
      toast.error('Failed to save option type')
    }
  }

  const handleSaveOptionValue = async () => {
    if (!editingValue || !selectedOptionType) return
    
    try {
      if (editingValue.id) {
        // Update existing
        const { error } = await supabase
          .from('global_option_values')
          .update({
            value: editingValue.value,
            display_name: editingValue.display_name,
            hex_color: editingValue.hex_color,
            sku_suffix: editingValue.sku_suffix,
            display_order: editingValue.display_order,
            is_default: editingValue.is_default,
            is_active: editingValue.is_active
          })
          .eq('id', editingValue.id)
        
        if (error) throw error
      } else {
        // Create new
        const { data, error } = await supabase
          .from('global_option_values')
          .insert({
            option_type_id: selectedOptionType.id,
            value: editingValue.value,
            display_name: editingValue.display_name,
            hex_color: editingValue.hex_color,
            sku_suffix: editingValue.sku_suffix || `-${editingValue.value.toUpperCase()}`,
            display_order: editingValue.display_order,
            is_default: editingValue.is_default,
            is_active: editingValue.is_active
          })
          .select()
          .single()
        
        if (error) throw error
      }
      
      toast.success('Option value saved successfully')
      setEditingValue(null)
      router.refresh()
    } catch (error) {
      console.error('Error saving option value:', error)
      toast.error('Failed to save option value')
    }
  }

  const handleAssignToProduct = async (productId: number, optionTypeId: string) => {
    try {
      const { error } = await supabase
        .from('product_option_assignments')
        .insert({
          product_id: productId,
          option_type_id: optionTypeId,
          is_required: false,
          display_order: 0
        })
      
      if (error) throw error
      toast.success('Option assigned to product')
      router.refresh()
    } catch (error) {
      console.error('Error assigning option:', error)
      toast.error('Failed to assign option')
    }
  }

  const handleSavePricing = async (
    productId: number, 
    optionValueId: string, 
    priceAdjustment: number, 
    stockOverride?: number
  ) => {
    try {
      const { error } = await supabase
        .from('product_option_pricing')
        .upsert({
          product_id: productId,
          option_value_id: optionValueId,
          price_adjustment_cents: Math.round(priceAdjustment * 100),
          stock_override: stockOverride,
          is_available: true
        })
      
      if (error) throw error
      toast.success('Pricing saved')
    } catch (error) {
      console.error('Error saving pricing:', error)
      toast.error('Failed to save pricing')
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="manage">Manage Options</TabsTrigger>
          <TabsTrigger value="assign">Assign to Products</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
        </TabsList>

        {/* Manage Options Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Global Option Types</CardTitle>
                  <CardDescription>
                    Create reusable options like Size, Color, Material that can be applied to multiple products
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setEditingType({
                    name: '',
                    display_name: '',
                    input_type: 'buttons',
                    is_required: false,
                    display_order: 0,
                    is_active: true
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Option Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Option Type Form */}
              {editingType && (
                <Card className="mb-6 border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {editingType.id ? 'Edit' : 'Create'} Option Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Display Name</Label>
                        <Input
                          value={editingType.display_name}
                          onChange={(e) => setEditingType({
                            ...editingType,
                            display_name: e.target.value
                          })}
                          placeholder="e.g., Size, Color"
                        />
                      </div>
                      <div>
                        <Label>Display Type</Label>
                        <Select
                          value={editingType.input_type}
                          onValueChange={(value: any) => setEditingType({
                            ...editingType,
                            input_type: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buttons">
                              <div className="flex items-center gap-2">
                                <Grid3x3 className="h-4 w-4" />
                                Button Group
                              </div>
                            </SelectItem>
                            <SelectItem value="dropdown">
                              <div className="flex items-center gap-2">
                                <List className="h-4 w-4" />
                                Dropdown List
                              </div>
                            </SelectItem>
                            <SelectItem value="swatches">
                              <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Color Swatches
                              </div>
                            </SelectItem>
                            <SelectItem value="radio">
                              <div className="flex items-center gap-2">
                                <ToggleLeft className="h-4 w-4" />
                                Radio Buttons
                              </div>
                            </SelectItem>
                            <SelectItem value="grid">
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Grid Layout
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingType.is_required}
                          onCheckedChange={(checked) => setEditingType({
                            ...editingType,
                            is_required: checked
                          })}
                        />
                        <Label>Required</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingType.is_active}
                          onCheckedChange={(checked) => setEditingType({
                            ...editingType,
                            is_active: checked
                          })}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingType(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveOptionType}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Option Type
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Option Types List */}
              <div className="space-y-4">
                {optionTypes.map((optionType) => (
                  <Card key={optionType.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <DisplayTypeIcon type={optionType.input_type} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {optionType.display_name}
                              <Badge variant="outline" className="ml-2">
                                {optionType.values?.length || 0} values
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {optionType.input_type} • {optionType.is_required ? 'Required' : 'Optional'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOptionType(optionType)
                              setActiveTab('values')
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Values
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingType(optionType)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Preview of values */}
                      {optionType.values && optionType.values.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {optionType.values.slice(0, 8).map((value) => (
                            <Badge key={value.id} variant="secondary">
                              {value.display_name}
                            </Badge>
                          ))}
                          {optionType.values.length > 8 && (
                            <Badge variant="outline">
                              +{optionType.values.length - 8} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Values Management */}
          {selectedOptionType && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Values for {selectedOptionType.display_name}</CardTitle>
                    <CardDescription>
                      Define the available options (e.g., XS, S, M, L, XL for Size)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setEditingValue({
                      value: '',
                      display_name: '',
                      hex_color: '',
                      sku_suffix: '',
                      display_order: 0,
                      is_default: false,
                      is_active: true
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Value
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Value Form */}
                {editingValue && (
                  <Card className="mb-6 border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {editingValue.id ? 'Edit' : 'Add'} Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Value</Label>
                          <Input
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({
                              ...editingValue,
                              value: e.target.value.toLowerCase()
                            })}
                            placeholder="e.g., xs, red"
                          />
                        </div>
                        <div>
                          <Label>Display Name</Label>
                          <Input
                            value={editingValue.display_name}
                            onChange={(e) => setEditingValue({
                              ...editingValue,
                              display_name: e.target.value
                            })}
                            placeholder="e.g., Extra Small, Red"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SKU Suffix</Label>
                          <Input
                            value={editingValue.sku_suffix}
                            onChange={(e) => setEditingValue({
                              ...editingValue,
                              sku_suffix: e.target.value.toUpperCase()
                            })}
                            placeholder="e.g., -XS, -RED"
                          />
                        </div>
                        {selectedOptionType.input_type === 'swatches' && (
                          <div>
                            <Label>Color (Hex)</Label>
                            <Input
                              value={editingValue.hex_color}
                              onChange={(e) => setEditingValue({
                                ...editingValue,
                                hex_color: e.target.value
                              })}
                              placeholder="#FF0000"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingValue(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveOptionValue}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Value
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Values List */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedOptionType.values?.map((value) => (
                    <Card key={value.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          {value.hex_color && (
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: value.hex_color }}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingValue(value)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-medium">{value.display_name}</p>
                        <p className="text-xs text-muted-foreground">{value.value}</p>
                        {value.sku_suffix && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {value.sku_suffix}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Assign to Products Tab */}
        <TabsContent value="assign" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assign Options to Products</CardTitle>
              <CardDescription>
                Select which global options should be available for each product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Product</Label>
                  <Select
                    value={selectedProduct?.toString()}
                    onValueChange={(value) => setSelectedProduct(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Available Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {optionTypes.map((optionType) => {
                        const isAssigned = assignments.some(
                          a => a.product_id === selectedProduct && 
                               a.option_type_id === optionType.id
                        )
                        
                        return (
                          <Card key={optionType.id} className={isAssigned ? 'border-green-500' : ''}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{optionType.display_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {optionType.values?.length || 0} values
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant={isAssigned ? 'secondary' : 'default'}
                                  disabled={isAssigned}
                                  onClick={() => handleAssignToProduct(selectedProduct, optionType.id!)}
                                >
                                  {isAssigned ? 'Assigned' : 'Assign'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Stock Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Option Pricing & Stock</CardTitle>
              <CardDescription>
                Set pricing adjustments and stock levels for each option value per product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={selectedProduct?.toString()}
                    onValueChange={(value) => setSelectedProduct(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedOptionType?.id}
                    onValueChange={(value) => {
                      const type = optionTypes.find(t => t.id === value)
                      setSelectedOptionType(type || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option type" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id!}>
                          {type.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && selectedOptionType && (
                  <div className="space-y-4">
                    <h3 className="font-medium">
                      Pricing for {selectedOptionType.display_name} options
                    </h3>
                    <div className="space-y-2">
                      {selectedOptionType.values?.map((value) => (
                        <Card key={value.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <div>
                                <p className="font-medium">{value.display_name}</p>
                                <p className="text-sm text-muted-foreground">{value.value}</p>
                              </div>
                              
                              <div>
                                <Label className="text-xs">Price Adjustment</Label>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">$</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="h-8"
                                    onChange={(e) => {
                                      // Save on change
                                      handleSavePricing(
                                        selectedProduct,
                                        value.id!,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs">Stock Override</Label>
                                <Input
                                  type="number"
                                  placeholder="Unlimited"
                                  className="h-8"
                                  onChange={(e) => {
                                    // Save on change
                                    handleSavePricing(
                                      selectedProduct,
                                      value.id!,
                                      0,
                                      parseInt(e.target.value) || undefined
                                    )
                                  }}
                                />
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Switch defaultChecked />
                                <Label className="text-sm">Available</Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Example:</strong> If your base product is $19.99 and you set XS to -$2.00 
                        and 2XL to +$3.00, the final prices will be: XS = $17.99, 2XL = $22.99
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}