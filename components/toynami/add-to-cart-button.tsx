'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number // in cents
  inStock: boolean
  variantId?: string
  quantity?: number
  image?: string
  className?: string
}

export function AddToCartButton({
  productId,
  productName,
  price,
  inStock,
  variantId,
  quantity = 1,
  image,
  className
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    if (!inStock || isAdding) return

    setIsAdding(true)
    
    try {
      await addItem({
        productId,
        variantId,
        productName,
        price,
        quantity,
        image
      })
      
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!inStock || isAdding}
      className={cn(
        'w-full transition-all',
        justAdded && 'bg-green-600 hover:bg-green-700',
        className
      )}
    >
      {justAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!inStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
        </>
      )}
    </Button>
  )
}