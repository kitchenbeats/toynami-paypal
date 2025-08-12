'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { toast } from 'sonner'
import { getImageSrc } from '@/lib/utils/image-utils'

export function CartContent() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [quantityMessages, setQuantityMessages] = useState<Record<string, string>>({})

  const handleUpdateQuantity = (productId: string, newQuantity: number, variantId?: string) => {
    const result = updateQuantity(productId, newQuantity, variantId)
    
    if (!result.success && result.message) {
      const key = `${productId}-${variantId}`
      setQuantityMessages(prev => ({ 
        ...prev, 
        [key]: result.message || ''
      }))
      // Clear message after 3 seconds
      setTimeout(() => {
        setQuantityMessages(prev => {
          const newMessages = { ...prev }
          delete newMessages[key]
          return newMessages
        })
      }, 3000)
    }
  }

  const handleRemoveItem = (productId: string, variantId?: string) => {
    removeItem(productId, variantId)
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      toast.success('Cart cleared')
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity / 100), 0)

  if (items.length === 0) {
    return null
  }

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
          {items.map((item) => {
            const key = `${item.productId}-${item.variantId}`
            const minQty = item.min_purchase_quantity && item.min_purchase_quantity > 0 ? item.min_purchase_quantity : 1
            const maxQty = item.max_purchase_quantity || null
            
            return (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <Link href={`/products/${item.productId}`} className="shrink-0">
                    <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                      {item.image ? (
                        <Image
                          src={getImageSrc(item.image)}
                          alt={item.productName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">
                            {item.productName}
                          </h3>
                        </Link>
                        {item.variantId && (
                          <p className="text-sm text-muted-foreground">Variant ID: {item.variantId}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.variantId)}
                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              disabled={item.quantity <= minQty}
                              className="p-1 hover:bg-muted disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              disabled={maxQty ? item.quantity >= maxQty : false}
                              className="p-1 hover:bg-muted disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {maxQty === 1 && !quantityMessages[key] && (
                            <span className="text-xs text-blue-600">
                              🎯 Limited Edition
                            </span>
                          )}
                        </div>
                        {quantityMessages[key] && (
                          <p className="text-xs text-blue-600 ml-20">{quantityMessages[key]}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.price / 100).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/products">
            <Button variant="outline" className="cursor-pointer">Continue Shopping</Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-destructive cursor-pointer"
            onClick={handleClearCart}
          >
            Clear Cart
          </Button>
        </div>
      </Card>
    </div>
  )
}