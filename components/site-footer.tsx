import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="hover:text-primary">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=sale" className="hover:text-primary">
                  On Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/account" className="hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-primary">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="hover:text-primary">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-primary">
                  Loyalty Program
                </Link>
              </li>
              <li>
                <Link href="/raffles" className="hover:text-primary">
                  Raffles
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Toynami Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}