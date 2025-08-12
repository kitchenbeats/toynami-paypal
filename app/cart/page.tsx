'use client'

import { useCart } from '@/lib/hooks/use-cart'
import { CartContent } from '@/components/cart/cart-content'
import { CartSummary } from '@/components/cart/cart-summary'
import { EmptyCart } from '@/components/cart/empty-cart'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function CartPage() {
  const { items } = useCart()
  const isEmpty = items.length === 0

  return (
    <main className="min-h-screen">
      <div className="bg-muted py-8 mb-12">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold mt-4">
            Shopping Cart {items.length > 0 && `(${items.length} ${items.length === 1 ? 'item' : 'items'})`}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <CartContent />
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}