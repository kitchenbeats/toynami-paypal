import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, TrendingUp } from 'lucide-react'

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Looks like you haven&apos;t added any collectibles to your cart yet. 
        Start exploring our exclusive collection!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button asChild size="lg">
          <Link href="/products">
            <Package className="h-4 w-4 mr-2" />
            Browse Products
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Featured Items
          </Link>
        </Button>
      </div>

      <div className="border-t pt-12">
        <h3 className="text-lg font-semibold mb-6">Benefits of Shopping with Us</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <span className="text-2xl">🚚</span>
            </div>
            <h4 className="font-medium mb-1">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On orders over $100</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="font-medium mb-1">Loyalty Rewards</h4>
            <p className="text-sm text-muted-foreground">Earn points with every purchase</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="font-medium mb-1">Exclusive Items</h4>
            <p className="text-sm text-muted-foreground">Limited edition collectibles</p>
          </div>
        </div>
      </div>
    </div>
  )
}