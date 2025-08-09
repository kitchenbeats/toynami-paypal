import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CartContent } from '@/components/cart/cart-content'
import { CartSummary } from '@/components/cart/cart-summary'
import { EmptyCart } from '@/components/cart/empty-cart'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function CartPage() {
  // Mock cart data - in production, fetch from Supabase/context
  const cartItems = [
    {
      id: 1,
      productId: 1,
      name: 'VF-1S Valkyrie Roy Focker Special Edition',
      brand: 'Robotech',
      price: 249.99,
      quantity: 1,
      image: '/images/product-placeholder.jpg',
      slug: 'vf-1s-valkyrie',
      inStock: true,
      maxQuantity: 5,
    },
    {
      id: 2,
      productId: 2,
      name: 'Voltron Legendary Defender Complete Set',
      brand: 'Voltron',
      price: 189.99,
      quantity: 2,
      image: '/images/product-placeholder.jpg',
      slug: 'voltron-defender',
      inStock: true,
      maxQuantity: 10,
    },
  ]

  const isEmpty = cartItems.length === 0

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="bg-muted py-8">
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
            <h1 className="text-4xl font-bold mt-4">Shopping Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CartContent items={cartItems} />
              </div>
              <div className="lg:col-span-1">
                <CartSummary items={cartItems} />
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}