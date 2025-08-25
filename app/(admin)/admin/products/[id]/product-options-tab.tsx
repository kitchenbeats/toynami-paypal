'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, Check
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface OptionType {
  id: string
  name: string
  display_name: string
  input_type: string
  values: Array<{
    id: string
    value: string
    display_name: string
    sku_suffix: string
  }>
}

interface OptionAssignment {
  option_type_id: string
  is_required: boolean
  option_type?: OptionType
}

interface OptionPricing {
  option_value_id: string
  price_adjustment_cents: number
  stock_override?: number
  is_available: boolean
}

interface Props {
  productId: number
  optionTypes: OptionType[]
  currentAssignments: OptionAssignment[]
}

export function ProductOptionsTab({ productId, optionTypes, currentAssignments }: Props) {
  const [assignments, setAssignments] = useState<OptionAssignment[]>(currentAssignments)
  const [pricing, setPricing] = useState<Record<string, OptionPricing>>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadPricing()
  }, [productId, assignments])

  const loadPricing = async () => {
    if (assignments.length === 0) return
    
    const valueIds = assignments.flatMap(a => 
      a.option_type?.values?.map(v => v.id) || []
    )
    
    const { data } = await supabase
      .from('product_option_pricing')
      .select('*')
      .eq('product_id', productId)
      .in('option_value_id', valueIds)
    
    if (data) {
      const pricingMap: Record<string, OptionPricing> = {}
      data.forEach(p => {
        pricingMap[p.option_value_id] = {
          option_value_id: p.option_value_id,
          price_adjustment_cents: p.price_adjustment_cents,
          stock_override: p.stock_override,
          is_available: p.is_available
        }
      })
      setPricing(pricingMap)
    }
  }

  const toggleOption = async (optionTypeId: string) => {
    setLoading(true)
    
    try {
      const isAssigned = assignments.some(a => a.option_type_id === optionTypeId)
      
      if (isAssigned) {
        // Remove assignment
        await supabase
          .from('product_option_assignments')
          .delete()
          .eq('product_id', productId)
          .eq('option_type_id', optionTypeId)
        
        setAssignments(assignments.filter(a => a.option_type_id !== optionTypeId))
        toast.success('Option removed')
      } else {
        // Add assignment
        const { error } = await supabase
          .from('product_option_assignments')
          .insert({
            product_id: productId,
            option_type_id: optionTypeId,
            is_required: false,
            display_order: assignments.length
          })
          .select()
          .single()
        
        if (error) throw error
        
        const optionType = optionTypes.find(o => o.id === optionTypeId)
        if (optionType) {
          setAssignments([...assignments, {
            option_type_id: optionTypeId,
            is_required: false,
            option_type: optionType
          }])
        }
        
        toast.success('Option added')
      }
    } catch (error) {
      console.error('Error toggling option:', error)
      toast.error('Failed to update option')
    } finally {
      setLoading(false)
    }
  }

  const toggleRequired = async (optionTypeId: string, required: boolean) => {
    try {
      await supabase
        .from('product_option_assignments')
        .update({ is_required: required })
        .eq('product_id', productId)
        .eq('option_type_id', optionTypeId)
      
      setAssignments(assignments.map(a => 
        a.option_type_id === optionTypeId 
          ? { ...a, is_required: required }
          : a
      ))
      
      toast.success('Requirement updated')
    } catch (error) {
      console.error('Error updating requirement:', error)
      toast.error('Failed to update requirement')
    }
  }

  const updatePricing = async (
    optionValueId: string, 
    field: 'price' | 'stock' | 'available',
    value: string | number | boolean
  ) => {
    try {
      const currentPricing = pricing[optionValueId] || {
        option_value_id: optionValueId,
        price_adjustment_cents: 0,
        stock_override: undefined,
        is_available: true
      }
      
      const updateData: Record<string, unknown> = {
        product_id: productId,
        option_value_id: optionValueId,
        price_adjustment_cents: currentPricing.price_adjustment_cents,
        stock_override: currentPricing.stock_override,
        is_available: currentPricing.is_available
      }
      
      if (field === 'price') {
        updateData.price_adjustment_cents = Math.round((value || 0) * 100)
      } else if (field === 'stock') {
        updateData.stock_override = value || null
      } else if (field === 'available') {
        updateData.is_available = value
      }
      
      await supabase
        .from('product_option_pricing')
        .upsert(updateData)
      
      setPricing({
        ...pricing,
        [optionValueId]: {
          ...currentPricing,
          ...(field === 'price' && { price_adjustment_cents: updateData.price_adjustment_cents }),
          ...(field === 'stock' && { stock_override: updateData.stock_override }),
          ...(field === 'available' && { is_available: updateData.is_available })
        }
      })
      
      toast.success('Pricing updated')
    } catch (error) {
      console.error('Error updating pricing:', error)
      toast.error('Failed to update pricing')
    }
  }

  return (
    <div className="space-y-6">
      {/* Available Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Options</CardTitle>
          <CardDescription>
            Select which options this product should have
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {optionTypes.map((optionType) => {
              const isAssigned = assignments.some(a => a.option_type_id === optionType.id)
              const assignment = assignments.find(a => a.option_type_id === optionType.id)
              
              return (
                <Card key={optionType.id} className={isAssigned ? 'border-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{optionType.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {optionType.values.length} values • {optionType.input_type}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isAssigned ? 'default' : 'outline'}
                        onClick={() => toggleOption(optionType.id)}
                        disabled={loading}
                      >
                        {isAssigned ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isAssigned && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Required</Label>
                          <Switch
                            checked={assignment?.is_required || false}
                            onCheckedChange={(checked) => toggleRequired(optionType.id, checked)}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {optionType.values.slice(0, 4).map((value) => (
                        <Badge key={value.id} variant="secondary" className="text-xs">
                          {value.display_name}
                        </Badge>
                      ))}
                      {optionType.values.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{optionType.values.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Stock Per Option */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Option Pricing & Stock</CardTitle>
            <CardDescription>
              Set price adjustments and stock levels for each option value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assignments.map((assignment, index) => (
              <div key={`${assignment.option_type_id}-${index}`}>
                <h4 className="font-medium mb-3">
                  {assignment.option_type?.display_name}
                </h4>
                <div className="space-y-2">
                  {assignment.option_type?.values.map((value) => {
                    const valuePricing = pricing[value.id] || {
                      price_adjustment_cents: 0,
                      stock_override: undefined,
                      is_available: true
                    }
                    
                    return (
                      <div key={value.id} className="grid grid-cols-12 gap-3 items-center p-3 border rounded">
                        <div className="col-span-3">
                          <p className="font-medium">{value.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {value.value} • {value.sku_suffix}
                          </p>
                        </div>
                        
                        <div className="col-span-3">
                          <Label className="text-xs">Price Adjustment</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={(valuePricing.price_adjustment_cents / 100) || ''}
                              onChange={(e) => updatePricing(
                                value.id,
                                'price',
                                parseFloat(e.target.value)
                              )}
                              placeholder="0.00"
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <Label className="text-xs">Stock Override</Label>
                          <Input
                            type="number"
                            value={valuePricing.stock_override || ''}
                            onChange={(e) => updatePricing(
                              value.id,
                              'stock',
                              e.target.value ? parseInt(e.target.value) : null
                            )}
                            placeholder="Unlimited"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-3 flex items-center gap-2">
                          <Switch
                            checked={valuePricing.is_available}
                            onCheckedChange={(checked) => updatePricing(
                              value.id,
                              'available',
                              checked
                            )}
                          />
                          <Label className="text-sm">Available</Label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Price adjustments are added to the base product price. 
                Stock overrides replace the main product stock for that specific option.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}