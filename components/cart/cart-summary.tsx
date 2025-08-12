'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Shield, Truck, CreditCard, Tag } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { toast } from 'sonner'

export function CartSummary() {
  const router = useRouter()
  const { items, totalPrice } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Calculate totals
  const subtotal = totalPrice / 100
  const tax = 0 // Will be calculated at checkout
  const shipping = 0 // Will be calculated at checkout
  const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const total = subtotal - discount // Final total calculated at checkout
  
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // TODO: Validate coupon with backend
      setAppliedCoupon(couponCode)
      setCouponCode('')
      toast.success(`Coupon "${couponCode}" applied - 10% discount!`)
    }
  }
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    toast.success('Coupon removed')
  }
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // TODO: Create order in database
      // TODO: Initialize PayPal checkout
      
      // For now, just redirect to a checkout page
      toast.info('Redirecting to checkout...')
      setTimeout(() => {
        router.push('/checkout')
      }, 1000)
    } catch (error) {
      toast.error('Failed to process checkout. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
          

          <div className="space-y-2">
            <Label htmlFor="coupon" className="text-sm">
              Promo Code
            </Label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm font-medium">{appliedCoupon} applied</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRemoveCoupon}
                  className="h-auto p-1 text-xs cursor-pointer"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button 
                  onClick={handleApplyCoupon} 
                  variant="outline"
                  disabled={!couponCode.trim()}
                  className="cursor-pointer"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Button 
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
          </Button>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure checkout powered by PayPal</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Fast, reliable shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>Authentic collectibles</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Express Checkout</h3>
        <div className="space-y-2">
          <Button 
            className="w-full cursor-pointer" 
            variant="outline"
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
          >
            <span className="text-[#FFC439] font-bold mr-1">Pay</span>
            <span className="text-[#009CDE] font-bold">Pal</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}