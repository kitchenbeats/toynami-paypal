import { CartProvider } from "@/lib/hooks/use-cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { TopBanner } from "@/components/top-banner";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <TopBanner />
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooterNew />
    </CartProvider>
  );
}
