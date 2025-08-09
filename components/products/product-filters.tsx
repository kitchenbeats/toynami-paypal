'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function ProductFilters() {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    condition: false,
  })

  const [priceRange, setPriceRange] = useState([0, 500])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">Categories</h3>
          {openSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.categories && (
          <div className="mt-4 space-y-3">
            {['Action Figures', 'Collectibles', 'Model Kits', 'Statues', 'Accessories'].map(
              (category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">Brands</h3>
          {openSections.brands ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.brands && (
          <div className="mt-4 space-y-3">
            {['Robotech', 'Voltron', 'Naruto', 'Macross', 'Acid Rain', 'Emily'].map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={brand} />
                <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">Price Range</h3>
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
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <button
          onClick={() => toggleSection('condition')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold">Condition</h3>
          {openSections.condition ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.condition && (
          <div className="mt-4 space-y-3">
            {['New', 'Used', 'Refurbished'].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox id={condition} />
                <Label htmlFor={condition} className="text-sm font-normal cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full">Apply Filters</Button>
      <Button variant="outline" className="w-full">
        Clear All
      </Button>
    </div>
  )
}