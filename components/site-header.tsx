import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { MainNavigation } from "@/components/main-navigation";
import { UserMenu } from "@/components/user-menu";
import { ShoppingCart } from "lucide-react";

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
    <header>
      {/* Top Header Bar */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10">
        <div className="w-full max-w-7xl grid grid-cols-3 items-center py-6 px-5 gap-8">
          {/* Left Column - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/toynami-logo.webp"
                alt="Toynami Store"
                width={190}
                height={46}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Middle Column - Search */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column - Navigation & Icons */}
          <div className="flex items-center justify-end gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                ABOUT US
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                CONTACT
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <UserMenu user={user} profile={profile} />
              
              <Link
                href="/cart"
                className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Navigation */}
      <MainNavigation />
    </header>
  );
}