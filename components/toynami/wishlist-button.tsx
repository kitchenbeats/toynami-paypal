'use client'

import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
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
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      checkWishlistStatus()
    }
  }, [productId, user])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const checkWishlistStatus = async () => {
    if (!user) return

    // First get or create user's default wishlist
    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('deleted_at', null)
      .single()

    if (!wishlist) {
      // Create default wishlist for user
      const { data: newWishlist } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          name: 'Default'
        })
        .select('id')
        .single()
      
      wishlist = newWishlist
    }

    if (wishlist) {
      // Check if product is in wishlist
      const { data: item } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId)
        .single()

      setIsInWishlist(!!item)
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname
      router.push(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`)
      return
    }

    setIsLoading(true)

    try {
      // Get or create user's default wishlist
      let { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .single()

      if (!wishlist) {
        // Create default wishlist for user
        const { data: newWishlist } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            name: 'Default'
          })
          .select('id')
          .single()
        
        wishlist = newWishlist
      }

      if (!wishlist) {
        throw new Error('Could not create or find wishlist')
      }

      if (isInWishlist) {
        // Remove from wishlist
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('wishlist_id', wishlist.id)
          .eq('product_id', productId)
        
        setIsInWishlist(false)
      } else {
        // Add to wishlist
        await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlist.id,
            product_id: parseInt(productId)
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
              'absolute top-2 left-2 z-10 bg-white/80 hover:bg-white hover:shadow-md cursor-pointer transition-all duration-200',
              className
            )}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all duration-200',
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
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