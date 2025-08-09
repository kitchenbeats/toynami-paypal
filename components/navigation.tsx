import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/logout-button'
import { ShoppingCart, User, Package, Home } from 'lucide-react'

export async function Navigation() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = user ? await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single() : { data: null }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Toynami Store
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 hover:text-primary">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="/products" className="flex items-center space-x-2 hover:text-primary">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link href="/cart" className="flex items-center space-x-2 hover:text-primary">
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/account" className="flex items-center space-x-2 hover:text-primary">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Account</span>
                </Link>
                {profile?.is_admin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}