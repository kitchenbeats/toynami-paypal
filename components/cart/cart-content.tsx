'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: number
  productId: number
  name: string
  brand: string
  price: number
  quantity: number
  image: string
  slug: string
  inStock: boolean
  maxQuantity: number
}

interface CartContentProps {
  items: CartItem[]
}

export function CartContent({ items: initialItems }: CartContentProps) {
  const [items, setItems] = useState(initialItems)

  const updateQuantity = (id: number, delta: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
            return { ...item, quantity: newQuantity }
          }
        }
        return item
      })
    )
  }

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-primary">{totalItems}</span>
            {totalItems === 1 ? ' Item' : ' Items'} in Cart
          </h2>
          <div className="text-lg font-medium">
            Total Value: <span className="text-primary">${totalValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <Link href={`/products/${item.slug}`} className="shrink-0">
                  <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                </Link>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-muted disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 min-w-[40px] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="p-1 hover:bg-muted disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {item.quantity >= item.maxQuantity && (
                        <span className="text-xs text-muted-foreground">
                          (Max: {item.maxQuantity})
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Button variant="ghost" className="text-destructive">
            Clear Cart
          </Button>
        </div>
      </Card>
    </div>
  )
}