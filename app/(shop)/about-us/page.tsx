import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Package, Shield, Truck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Toynami',
  description: 'Learn about Toynami - your premier destination for collectibles, toys, and exclusive merchandise. Serving collectors since 2000.',
  openGraph: {
    title: 'About Toynami',
    description: 'Discover the story behind Toynami and our commitment to bringing you the best collectibles and toys.',
    type: 'website',
  },
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative py-24">
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Toynami</h1>
            <p className="text-xl opacity-90">
              Your Premier Destination for Collectibles & Exclusive Merchandise
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2000, Toynami has been at the forefront of creating and distributing 
                high-quality collectibles, toys, and exclusive merchandise for over two decades. 
                What started as a small passion project has grown into one of the most trusted 
                names in the collectibles industry.
              </p>
              <p className="text-gray-600 mb-6">
                We specialize in bringing beloved characters from anime, manga, video games, 
                and pop culture to life through meticulously crafted figures, statues, and 
                collectibles. Our partnerships with major entertainment brands allow us to 
                offer exclusive items you won't find anywhere else.
              </p>
              <p className="text-gray-600">
                From our headquarters in California, we serve collectors worldwide, ensuring 
                that every product meets our exacting standards for quality, authenticity, 
                and craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Toynami</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Authenticity Guaranteed</h3>
                <p className="text-gray-600 text-sm">
                  Every product is 100% authentic and officially licensed
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Exclusive Items</h3>
                <p className="text-gray-600 text-sm">
                  Access to limited editions and convention exclusives
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Truck className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Shipping</h3>
                <p className="text-gray-600 text-sm">
                  Careful packaging and reliable worldwide delivery
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community First</h3>
                <p className="text-gray-600 text-sm">
                  Supporting collectors and fan communities since 2000
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Brands We Work With</h2>
            <div className="prose prose-lg max-w-none text-center mb-8">
              <p className="text-gray-600">
                We're proud to partner with the world's leading entertainment brands to bring 
                you officially licensed collectibles from your favorite franchises.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {/* Brand logos would go here - using text placeholders for now */}
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Robotech</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Voltron</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Naruto</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Bleach</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Sonic</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Futurama</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Skelanimals</span>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-xl font-bold text-gray-700">Ciboys</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl opacity-90 mb-8">
              To create and deliver exceptional collectibles that celebrate the characters 
              and stories fans love, while building a global community of collectors united 
              by their passion for pop culture.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our products or want to learn more about Toynami? 
              We'd love to hear from you.
            </p>
            <div className="flex gap-8 justify-center text-left">
              <div>
                <h3 className="font-semibold mb-2">Customer Service</h3>
                <p className="text-gray-600">customerservice@toynamishop.com</p>
                <p className="text-gray-600">1-888-TOYNAMI</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Inquiries</h3>
                <p className="text-gray-600">business@toynamishop.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}