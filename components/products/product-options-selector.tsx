'use client'

import { useState, useEffect, useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface OptionValue {
  id: string
  value: string
  display_name: string
  hex_color?: string
  sku_suffix: string
  is_default: boolean
}

interface ProductOption {
  id: string
  name: string
  display_name: string
  input_type: string
  is_required: boolean
  values: OptionValue[]
}

interface OptionPricing {
  option_value_id: string
  price_adjustment_cents: number
  stock_override?: number
  is_available: boolean
}

interface Props {
  options: ProductOption[]
  pricing: OptionPricing[]
  baseStock?: number
  onSelectionChange: (selections: Record<string, string>, priceAdjustment: number, availableStock: number | null) => void
}

export function ProductOptionsSelector({ options, pricing, baseStock = 0, onSelectionChange }: Props) {
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [stockMessage, setStockMessage] = useState<string | null>(null)
  const [autoSelectedMessage, setAutoSelectedMessage] = useState<string | null>(null)

  // Initialize with default values (smart selection for out-of-stock)
  useEffect(() => {
    const defaults: Record<string, string> = {}
    
    options.forEach(option => {
      // First, try to use the designated default value if it's available
      const defaultValue = option.values.find(v => v.is_default)
      
      if (defaultValue) {
        // Check if the default is available
        const defaultPricing = pricing.find(p => p.option_value_id === defaultValue.id)
        const defaultStock = defaultPricing?.stock_override
        const defaultIsAvailable = defaultPricing?.is_available !== false
        const defaultNotOutOfStock = !(defaultStock !== undefined && defaultStock !== null && defaultStock === 0)
        
        if (defaultIsAvailable && defaultNotOutOfStock) {
          // Default is available, use it
          defaults[option.id] = defaultValue.id
        } else {
          // Default is out of stock, find first available option
          const availableValue = option.values.find(v => {
            const pricingInfo = pricing.find(p => p.option_value_id === v.id)
            const stock = pricingInfo?.stock_override
            const isAvailable = pricingInfo?.is_available !== false
            const notOutOfStock = !(stock !== undefined && stock !== null && stock === 0)
            return isAvailable && notOutOfStock
          })
          
          if (availableValue) {
            defaults[option.id] = availableValue.id
            // Set a message that we auto-selected a different option
            setAutoSelectedMessage(`${option.display_name}: Auto-selected ${availableValue.display_name} (${defaultValue.display_name} is out of stock)`)
          } else if (option.values.length > 0) {
            // No available options, still select the default or first (will show as disabled)
            defaults[option.id] = defaultValue.id
            // Check if ALL options are out of stock
            const allOutOfStock = option.values.every(v => {
              const pricingInfo = pricing.find(p => p.option_value_id === v.id)
              const stock = pricingInfo?.stock_override
              const isOutOfStock = stock !== undefined && stock !== null && stock === 0
              return isOutOfStock
            })
            if (allOutOfStock) {
              setAutoSelectedMessage(`All ${option.display_name} options are currently out of stock`)
            }
          }
        }
      } else if (option.values.length > 0) {
        // No default specified, find first available option
        const availableValue = option.values.find(v => {
          const pricingInfo = pricing.find(p => p.option_value_id === v.id)
          const stock = pricingInfo?.stock_override
          const isAvailable = pricingInfo?.is_available !== false
          const notOutOfStock = !(stock !== undefined && stock !== null && stock === 0)
          return isAvailable && notOutOfStock
        })
        
        defaults[option.id] = availableValue?.id || option.values[0].id
      }
    })
    
    setSelections(defaults)
  }, [options, pricing])

  // Calculate total price adjustment and check stock
  useEffect(() => {
    let totalAdjustment = 0
    let availableStock: number | null = null
    let hasStockLimit = false
    
    Object.values(selections).forEach(valueId => {
      const pricingInfo = pricing.find(p => p.option_value_id === valueId)
      if (pricingInfo) {
        totalAdjustment += pricingInfo.price_adjustment_cents
        
        // Only limit stock if there's an explicit stock override
        if (pricingInfo.stock_override !== undefined && pricingInfo.stock_override !== null) {
          hasStockLimit = true
          if (availableStock === null || pricingInfo.stock_override < availableStock) {
            availableStock = pricingInfo.stock_override
          }
        }
      }
    })
    
    // If no option has stock limits, use base stock (or null for unlimited)
    if (!hasStockLimit) {
      availableStock = baseStock > 0 ? baseStock : null
    }
    
    // Set stock message
    if (availableStock !== null && availableStock === 0) {
      setStockMessage('Out of Stock')
    } else if (availableStock !== null && availableStock > 0 && availableStock <= 5) {
      setStockMessage(`Only ${availableStock} left in stock`)
    } else if (hasStockLimit && availableStock !== null && availableStock > 5) {
      setStockMessage(`${availableStock} available`)
    } else {
      setStockMessage(null)
    }
    
    onSelectionChange(selections, totalAdjustment / 100, availableStock)
  }, [selections, pricing, baseStock, onSelectionChange])

  const handleSelectionChange = useCallback((optionId: string, valueId: string) => {
    setSelections(prev => ({
      ...prev,
      [optionId]: valueId
    }))
  }, [])

  const renderOption = (option: ProductOption) => {
    const selectedValueId = selections[option.id]

    switch (option.input_type) {
      case 'dropdown':
        return (
          <div key={option.id} className="space-y-2">
            <Label>
              {option.display_name}
              {option.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={selectedValueId}
              onValueChange={(value) => handleSelectionChange(option.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${option.display_name}`} />
              </SelectTrigger>
              <SelectContent>
                {option.values.map((value) => {
                  const pricingInfo = pricing.find(p => p.option_value_id === value.id)
                  const priceAdjustment = pricingInfo?.price_adjustment_cents || 0
                  const isAvailable = pricingInfo?.is_available !== false
                  
                  const stock = pricingInfo?.stock_override
                  const stockText = stock !== undefined && stock !== null ? 
                    (stock === 0 ? ' • Out of Stock' : stock <= 5 ? ` • ${stock} left` : '') : ''
                  
                  return (
                    <SelectItem 
                      key={value.id} 
                      value={value.id}
                      disabled={!isAvailable || (stock !== undefined && stock !== null && stock === 0)}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span>{value.display_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {priceAdjustment !== 0 && (
                            <span>
                              {priceAdjustment > 0 ? '+' : ''}${(priceAdjustment / 100).toFixed(2)}
                            </span>
                          )}
                          {stockText && (
                            <span className={stock === 0 ? 'text-red-500' : 'text-orange-500'}>
                              {stockText}
                            </span>
                          )}
                        </span>
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )

      case 'radio':
        return (
          <div key={option.id} className="space-y-2">
            <Label>
              {option.display_name}
              {option.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={selectedValueId}
              onValueChange={(value) => handleSelectionChange(option.id, value)}
            >
              {option.values.map((value) => {
                const pricingInfo = pricing.find(p => p.option_value_id === value.id)
                const priceAdjustment = pricingInfo?.price_adjustment_cents || 0
                const isAvailable = pricingInfo?.is_available !== false
                const stock = pricingInfo?.stock_override
                const isOutOfStock = stock !== undefined && stock !== null && stock === 0
                const isLowStock = stock !== undefined && stock !== null && stock > 0 && stock <= 5
                
                return (
                    <div key={value.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={value.id} 
                        id={value.id}
                        disabled={!isAvailable || isOutOfStock}
                      />
                      <Label 
                        htmlFor={value.id}
                        className={cn(
                          "cursor-pointer flex items-center gap-2",
                          (!isAvailable || isOutOfStock) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span>{value.display_name}</span>
                        {priceAdjustment !== 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({priceAdjustment > 0 ? '+' : ''}${(priceAdjustment / 100).toFixed(2)})
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                        )}
                        {isLowStock && (
                          <span className="text-xs text-orange-500 font-medium">{stock} left</span>
                        )}
                      </Label>
                    </div>
                  )
              })}
            </RadioGroup>
          </div>
        )

      case 'buttons':
        return (
          <div key={option.id} className="space-y-2">
            <Label>
              {option.display_name}
              {option.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const pricingInfo = pricing.find(p => p.option_value_id === value.id)
                const priceAdjustment = pricingInfo?.price_adjustment_cents || 0
                const isAvailable = pricingInfo?.is_available !== false
                const isSelected = selectedValueId === value.id
                const stock = pricingInfo?.stock_override
                const isOutOfStock = stock !== undefined && stock !== null && stock === 0
                const isLowStock = stock !== undefined && stock !== null && stock > 0 && stock <= 5
                
                return (
                    <Button
                      key={value.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectionChange(option.id, value.id)}
                      disabled={!isAvailable || isOutOfStock}
                      className={cn(
                        "relative",
                        isOutOfStock && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="flex flex-col items-center">
                        <span>{value.display_name}</span>
                        {priceAdjustment !== 0 && (
                          <span className="text-xs opacity-75">
                            {priceAdjustment > 0 ? '+' : ''}${(priceAdjustment / 100).toFixed(2)}
                          </span>
                        )}
                      </span>
                      {isOutOfStock && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          Out
                        </span>
                      )}
                      {isLowStock && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {stock}
                        </span>
                      )}
                    </Button>
                  )
              })}
            </div>
          </div>
        )

      case 'swatches':
      case 'color':
        return (
          <div key={option.id} className="space-y-2">
            <Label>
              {option.display_name}
              {option.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const pricingInfo = pricing.find(p => p.option_value_id === value.id)
                const isAvailable = pricingInfo?.is_available !== false
                const isSelected = selectedValueId === value.id
                
                return (
                  <button
                    key={value.id}
                    onClick={() => handleSelectionChange(option.id, value.id)}
                    disabled={!isAvailable}
                    className={cn(
                      "w-10 h-10 rounded-lg border-2 relative",
                      isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-gray-300",
                      !isAvailable && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ backgroundColor: value.hex_color || '#ccc' }}
                    title={value.display_name}
                  >
                    {!isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs bg-black/50 rounded px-1">X</span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {autoSelectedMessage && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{autoSelectedMessage}</span>
        </div>
      )}
      
      {options.map(option => renderOption(option))}
      
      {stockMessage && (
        <div className={cn(
          "flex items-center gap-2 text-sm font-medium",
          stockMessage.includes('Out of Stock') ? 'text-red-600' : 
          stockMessage.includes('Only') ? 'text-orange-600' : 'text-gray-600'
        )}>
          <AlertCircle className="h-4 w-4" />
          {stockMessage}
        </div>
      )}
    </div>
  )
}