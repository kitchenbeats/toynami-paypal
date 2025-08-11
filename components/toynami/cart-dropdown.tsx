'use client'

import { ShoppingCart, X, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/lib/hooks/use-cart'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CartDropdown() {
  const { items, itemCount, totalPrice, removeItem, updateQuantity, isOpen, setIsOpen } = useCart()

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Shopping Cart</h3>
            <span className="text-sm text-muted-foreground">{itemCount} items</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Link href="/products">
                <Button className="mt-4" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={`${item.productId}-${item.variantId}`} 
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(
                              item.productId, 
                              item.quantity - 1, 
                              item.variantId
                            )}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(
                              item.productId, 
                              item.quantity + 1, 
                              item.variantId
                            )}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 mt-1"
                          onClick={() => removeItem(item.productId, item.variantId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold">Total:</span>
                  <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="grid gap-2">
                  <Link href="/cart">
                    <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}