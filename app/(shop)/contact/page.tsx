import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Package,
  ShoppingCart,
  AlertCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Toynami',
  description: 'Get in touch with Toynami customer service. We\'re here to help with your orders, products, and collectibles questions.',
  openGraph: {
    title: 'Contact Toynami',
    description: 'Contact our customer service team for help with orders, products, and more.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative py-24">
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl opacity-90">
              We're here to help with any questions about your orders or our products
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Get help via email
                </p>
                <a 
                  href="mailto:customerservice@toynamishop.com" 
                  className="text-primary hover:underline"
                >
                  customerservice@toynamishop.com
                </a>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Phone className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">
                  Speak with our team
                </p>
                <p className="font-semibold">1-888-TOYNAMI</p>
                <p className="text-sm text-gray-500 mt-2">Mon-Fri 9AM-5PM PST</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">
                  Our headquarters
                </p>
                <p className="text-sm">
                  Toynami<br />
                  Los Angeles, CA<br />
                  United States
                </p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible. 
                  Typical response time is within 24-48 business hours.
                </p>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number (if applicable)</Label>
                    <Input 
                      id="orderNumber" 
                      placeholder="TOY-123456" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <select 
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Status</option>
                      <option value="product">Product Question</option>
                      <option value="shipping">Shipping Information</option>
                      <option value="return">Returns & Refunds</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you today?" 
                      rows={6}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    * Required fields
                  </p>
                </form>
              </div>
              
              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">How do I track my order?</h3>
                        <p className="text-gray-600 text-sm">
                          Once your order ships, you'll receive an email with tracking information. 
                          You can also log into your account to view order status and tracking details.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">What are your business hours?</h3>
                        <p className="text-gray-600 text-sm">
                          Our customer service team is available Monday through Friday, 
                          9:00 AM to 5:00 PM Pacific Time. We're closed on weekends and major holidays.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <ShoppingCart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">Can I cancel or modify my order?</h3>
                        <p className="text-gray-600 text-sm">
                          Orders can be modified or cancelled within 1 hour of placement. 
                          After that, please contact customer service immediately as we may 
                          have already begun processing your order.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">What is your return policy?</h3>
                        <p className="text-gray-600 text-sm">
                          We accept returns of unopened items within 30 days of delivery. 
                          Items must be in original condition with all packaging. 
                          Please contact us for a return authorization before sending items back.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">How quickly will I get a response?</h3>
                        <p className="text-gray-600 text-sm">
                          We typically respond to all inquiries within 24-48 business hours. 
                          During busy periods or holidays, response times may be slightly longer.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Need More Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Check out our comprehensive help center for detailed guides and answers.
                  </p>
                  <Link href="/help">
                    <Button variant="outline">
                      Visit Help Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
            <p className="text-gray-600 mb-8">
              Follow us on social media for the latest product releases, 
              exclusive offers, and collector community updates.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="https://facebook.com/toynami" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Facebook
              </a>
              <a 
                href="https://twitter.com/toynami" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Twitter
              </a>
              <a 
                href="https://instagram.com/toynami" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Instagram
              </a>
              <a 
                href="https://youtube.com/toynami" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}