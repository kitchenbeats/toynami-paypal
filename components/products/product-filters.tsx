'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
  name: string
  slug: string
}

interface Brand {
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  brands: Brand[]
  priceRange: {
    min: number
    max: number
  }
  hideBrandFilter?: boolean
}

export function ProductFilters({ categories, brands, priceRange, hideBrandFilter = false }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    condition: false,
  })

  // Get current filters from URL
  const currentCategory = searchParams.get('category')
  const currentBrand = searchParams.get('brand')
  const currentMinPrice = searchParams.get('min_price')
  const currentMaxPrice = searchParams.get('max_price')

  const [localPriceRange, setLocalPriceRange] = useState([
    currentMinPrice ? parseInt(currentMinPrice) : priceRange.min,
    currentMaxPrice ? parseInt(currentMaxPrice) : priceRange.max
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentCategory ? [currentCategory] : []
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    currentBrand ? [currentBrand] : []
  )

  // Update state when URL changes
  useEffect(() => {
    setSelectedCategories(currentCategory ? [currentCategory] : [])
    setSelectedBrands(currentBrand ? [currentBrand] : [])
    setLocalPriceRange([
      currentMinPrice ? parseInt(currentMinPrice) : priceRange.min,
      currentMaxPrice ? parseInt(currentMaxPrice) : priceRange.max
    ])
  }, [currentCategory, currentBrand, currentMinPrice, currentMaxPrice, priceRange])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateURL = (filters: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    
    // Reset to first page when filters change
    current.set('page', '1')
    
    router.push(`/products?${current.toString()}`)
  }

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter(c => c !== categorySlug)
      : [categorySlug] // Only allow one category at a time for now
    
    setSelectedCategories(newCategories)
    updateURL({ category: newCategories[0] || undefined })
  }

  const handleBrandToggle = (brandSlug: string) => {
    const newBrands = selectedBrands.includes(brandSlug)
      ? selectedBrands.filter(b => b !== brandSlug)
      : [brandSlug] // Only allow one brand at a time for now
    
    setSelectedBrands(newBrands)
    updateURL({ brand: newBrands[0] || undefined })
  }

  const handlePriceChange = () => {
    updateURL({
      min_price: localPriceRange[0] > priceRange.min ? localPriceRange[0].toString() : undefined,
      max_price: localPriceRange[1] < priceRange.max ? localPriceRange[1].toString() : undefined
    })
  }


  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setLocalPriceRange([priceRange.min, priceRange.max])
    
    // Clear all filter params but keep sort and per_page
    const current = new URLSearchParams(searchParams.toString())
    current.delete('category')
    current.delete('brand')
    current.delete('min_price')
    current.delete('max_price')
    current.set('page', '1')
    
    router.push(`/products?${current.toString()}`)
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    localPriceRange[0] > priceRange.min || 
    localPriceRange[1] < priceRange.max

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">
            Price Range {(localPriceRange[0] > priceRange.min || localPriceRange[1] < priceRange.max) && (
              <span className="text-sm font-normal text-blue-600">
                (${localPriceRange[0]}-${localPriceRange[1]})
              </span>
            )}
          </h3>
          {openSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.price && (
          <div className="mt-4 space-y-4">
            <div className="px-2">
              <Slider
                value={localPriceRange}
                onValueChange={setLocalPriceRange}
                onValueCommit={handlePriceChange}
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>${localPriceRange[0]}</span>
              <span>${localPriceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">
            Categories {selectedCategories.length > 0 && (
              <span className="text-sm font-normal text-blue-600">
                ({selectedCategories.length})
              </span>
            )}
          </h3>
          {openSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.categories && (
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <Checkbox 
                  id={category.slug}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryToggle(category.slug)}
                />
                <Label htmlFor={category.slug} className="text-sm font-normal cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      {!hideBrandFilter && (
        <div className="border rounded-lg p-4">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold">
              Brands {selectedBrands.length > 0 && (
                <span className="text-sm font-normal text-blue-600">
                  ({selectedBrands.length})
                </span>
              )}
            </h3>
            {openSections.brands ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {openSections.brands && (
            <div className="mt-4 space-y-3">
              {brands.map((brand) => (
                <div key={brand.slug} className="flex items-center space-x-2">
                  <Checkbox 
                    id={brand.slug}
                    checked={selectedBrands.includes(brand.slug)}
                    onCheckedChange={() => handleBrandToggle(brand.slug)}
                  />
                  <Label htmlFor={brand.slug} className="text-sm font-normal cursor-pointer">
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )
}