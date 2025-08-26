'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ClaimPurchaseButtonProps {
  productId: number
  raffleWinnerId: string
  price: string
}

export default function ClaimPurchaseButton({ 
  productId, 
  raffleWinnerId,
  price 
}: ClaimPurchaseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleAddToCart = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('You must be signed in to purchase')
      }
      
      // Verify winner eligibility one more time
      const { data: verification, error: verifyError } = await supabase
        .rpc('verify_raffle_purchase', {
          p_user_id: user.id,
          p_product_id: productId
        })
        .single()
      
      if (verifyError || !verification?.can_purchase) {
        throw new Error(verification?.message || 'Not eligible to purchase this product')
      }
      
      // Get or create cart
      let { data: cart } = await supabase
        .from('shopping_carts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      
      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from('shopping_carts')
          .insert({ user_id: user.id, status: 'active' })
          .select('id')
          .single()
        
        if (cartError) throw new Error('Failed to create cart')
        cart = newCart
      }
      
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .single()
      
      if (existingItem) {
        toast.info('This item is already in your cart')
        router.push('/cart')
        return
      }
      
      // Add to cart with raffle winner reference
      const { error: addError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity: 1,
          price_cents: Math.round(parseFloat(price) * 100),
          metadata: {
            raffle_winner_id: raffleWinnerId,
            raffle_purchase: true
          }
        })
      
      if (addError) throw new Error('Failed to add item to cart')
      
      toast.success('Added to cart! Proceeding to checkout...')
      
      // Redirect to cart/checkout
      setTimeout(() => {
        router.push('/cart')
      }, 500)
      
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        size="lg"
        className="w-full text-lg py-6"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart - ${price}
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        You will be redirected to checkout after adding to cart
      </p>
    </div>
  )
}