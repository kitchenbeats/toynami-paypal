'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Check, ChevronsUpDown, Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getImageSrc } from '@/lib/utils/image-utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Product {
  id: number
  name: string
  sku?: string
  base_price_cents?: number
  is_visible: boolean
  image_url?: string
}

interface SearchableProductSelectProps {
  products: Product[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function SearchableProductSelect({
  products,
  value,
  onValueChange,
  placeholder = "Select a product...",
  required = false
}: SearchableProductSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products
    
    const query = searchQuery.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.sku && product.sku.toLowerCase().includes(query))
    )
  }, [products, searchQuery])

  // Get selected product
  const selectedProduct = products.find(p => p.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal h-auto min-h-[2.5rem]",
            !value && "text-muted-foreground"
          )}
        >
          {selectedProduct ? (
            <div className="flex items-center gap-3 py-1">
              <div className="relative h-10 w-10 flex-shrink-0">
                {selectedProduct.image_url ? (
                  <Image
                    src={getImageSrc(selectedProduct.image_url)}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{selectedProduct.name}</div>
                {selectedProduct.base_price_cents !== undefined && selectedProduct.base_price_cents > 0 && (
                  <div className="text-sm text-muted-foreground">
                    ${(selectedProduct.base_price_cents / 100).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="py-6 text-center text-sm">
                No products found.
              </div>
            ) : (
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id.toString()}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="cursor-pointer py-3"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        value === product.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={getImageSrc(product.image_url)}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{product.name}</div>
                        {product.base_price_cents !== undefined && product.base_price_cents > 0 && (
                          <div className="text-sm text-muted-foreground">
                            ${(product.base_price_cents / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}