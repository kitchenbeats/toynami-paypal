'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Shield, Truck, CreditCard, Tag } from 'lucide-react'

interface CartItem {
  id: number
  price: number
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode)
      setCouponCode('')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
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
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
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
                  className="h-auto p-1 text-xs"
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
                <Button onClick={handleApplyCoupon} variant="outline">
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Button className="w-full" size="lg">
            <CreditCard className="h-4 w-4 mr-2" />
            Proceed to Checkout
          </Button>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure checkout powered by PayPal</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>30-day return policy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Express Checkout</h3>
        <div className="space-y-2">
          <Button className="w-full" variant="outline">
            <span className="text-[#FFC439]">Pay</span>
            <span className="text-[#009CDE]">Pal</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}