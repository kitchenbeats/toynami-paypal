import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandLogos } from "@/components/home/brand-logos";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <HeroBanner />
        
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Collectibles</h2>
            <p className="text-muted-foreground">Discover our exclusive selection of premium toys and collectibles</p>
          </div>
          <FeaturedProducts />
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Brand</h2>
              <p className="text-muted-foreground">Explore collections from your favorite brands</p>
            </div>
            <BrandLogos />
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Exclusive Raffles</h3>
              <p className="text-muted-foreground mb-6">Enter for a chance to win limited edition collectibles</p>
              <Button asChild>
                <Link href="/raffles">View Active Raffles</Link>
              </Button>
            </div>
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Loyalty Program</h3>
              <p className="text-muted-foreground mb-6">Earn rewards and unlock exclusive access with every purchase</p>
              <Button asChild variant="outline">
                <Link href="/loyalty">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
