import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ShoppingCart, Package, Home, User, Shield } from "lucide-react";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { data: profile } = user
    ? await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.sub)
        .single()
    : { data: null };

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5">
        <div className="flex gap-8 items-center">
          <Link href="/" className="font-bold text-lg">
            Toynami Store
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Account</span>
              </Link>
              {profile?.is_admin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}