'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, X, Plus, Minus, Package } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { getImageSrc } from '@/lib/utils/image-utils'

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, itemCount, totalPrice, removeItem, updateQuantity } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1 text-sm hover:text-primary transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white border-2 border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-white" />
                <h3 className="font-bold text-lg text-white">Shopping Cart</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10 p-1"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add some items to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <Image
                            src={getImageSrc(item.image)}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.productName}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => {
                                const result = updateQuantity(item.productId, item.quantity - 1, item.variantId)
                                if (!result.success && result.message) {
                                  // Could show an error message here
                                }
                              }}
                              className="p-1 hover:bg-gray-100 cursor-pointer rounded-l-lg transition-colors"
                              disabled={item.quantity <= (item.min_purchase_quantity || 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const result = updateQuantity(item.productId, item.quantity + 1, item.variantId)
                                if (!result.success && result.message) {
                                  // Could show an error message here
                                }
                              }}
                              className="p-1 hover:bg-gray-100 cursor-pointer rounded-r-lg transition-colors"
                              disabled={item.max_purchase_quantity ? item.quantity >= item.max_purchase_quantity : false}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-red-500 hover:text-red-600 text-xs mt-1 cursor-pointer font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <div className="border-t-2 border-gray-100 p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-xl text-gray-900">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full cursor-pointer hover:bg-gray-100 border-2 font-semibold">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold text-white shadow-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}