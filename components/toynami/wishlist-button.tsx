'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    if (user) {
      checkWishlistStatus()
    }
  }, [productId])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      checkWishlistStatus()
    }
  }

  const checkWishlistStatus = async () => {
    if (!user) return

    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    setIsInWishlist(!!data)
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/sign-in?redirect=/products/${productId}`)
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        
        setIsInWishlist(false)
      } else {
        // Add to wishlist
        await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: productId
          })
        
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={cn(
              'absolute top-2 left-2 z-10 bg-white/80 hover:bg-white',
              className
            )}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!user ? 'Sign in to save' : isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}