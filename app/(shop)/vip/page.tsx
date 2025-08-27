import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Crown, 
  Gem, 
  Trophy,
  Star,
  ChevronRight,
  Medal
} from 'lucide-react'
import Link from 'next/link'

// Types
interface CustomerGroup {
  id: string
  name: string
  slug: string
  badge_color: string | null
  badge_icon: string | null
  discount_percentage: number
  free_shipping_threshold_cents: number | null
  benefits: {
    early_access?: boolean
    exclusive_products?: boolean
    priority_support?: boolean
    custom_benefits?: string[]
  } | null
}

interface UserSpendingInfo {
  lifetime_spend_cents: number
  current_year_spend_cents: number
  first_purchase_date: string | null
  total_orders_count: number
}

interface VIPProduct {
  id: string
  name: string
  slug: string
  description: string | null
  base_price_cents: number
  compare_price_cents: number | null
  is_on_sale: boolean
  is_new: boolean
  is_featured: boolean
  stock_level: number | null
  brand: {
    name: string
    slug: string
  } | null
  images?: Array<{
    image_filename: string
    alt_text: string | null
    is_primary: boolean
  }>
}


export const metadata: Metadata = {
  title: 'VIP Members | Exclusive Access | Toynami',
  description: 'Access exclusive VIP-only products and benefits. Join our VIP program for first access to limited editions and special pricing.',
}

async function getUserGroups(userId: string): Promise<CustomerGroup[]> {
  const supabase = await createClient()
  
  const { data: groups } = await supabase
    .from('user_customer_groups')
    .select(`
      group:customer_groups(
        id,
        name,
        slug,
        badge_color,
        badge_icon,
        discount_percentage,
        free_shipping_threshold_cents,
        benefits
      )
    `)
    .eq('user_id', userId)
    .not('approved_at', 'is', null)
    
  return (groups?.map(g => g.group).filter(Boolean) as CustomerGroup[]) || []
}

async function getUserSpendingInfo(userId: string): Promise<UserSpendingInfo | null> {
  const supabase = await createClient()
  
  const { data: user } = await supabase
    .from('users')
    .select(`
      lifetime_spend_cents,
      current_year_spend_cents,
      first_purchase_date,
      total_orders_count
    `)
    .eq('id', userId)
    .single()
    
  return user as UserSpendingInfo | null
}

async function getVIPProducts(): Promise<VIPProduct[]> {
  const supabase = await createClient()
  
  // Get VIP group ID
  const { data: vipGroup } = await supabase
    .from('customer_groups')
    .select('id')
    .eq('slug', 'vip')
    .single()
    
  if (!vipGroup) return []
  
  // Get products restricted to VIP group
  const { data: vipProducts } = await supabase
    .from('product_customer_groups')
    .select(`
      product:products(
        id,
        name,
        slug,
        description,
        base_price_cents,
        compare_price_cents,
        is_on_sale,
        is_new,
        is_featured,
        stock_level,
        brand:brands(name, slug)
      )
    `)
    .eq('group_id', vipGroup.id)
    .limit(12)
    
  // Get images for each product
  const products = (vipProducts?.map(p => p.product).filter(Boolean) || []) as VIPProduct[]
  
  for (const product of products) {
    const { data: mediaUsage } = await supabase
      .from('media_usage')
      .select(`
        media:media_library(file_url, alt_text)
      `)
      .eq('entity_type', 'product')
      .eq('entity_id', product.id.toString())
      .eq('field_name', 'primary_image')
      .single()
      
    if (mediaUsage?.media) {
      product.images = [{
        image_filename: mediaUsage.media.file_url,
        alt_text: mediaUsage.media.alt_text,
        is_primary: true
      }]
    }
  }
  
  return products
}

export default async function VIPPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/vip')
  }
  
  // Get user's groups and spending info
  const [userGroups, spendingInfo, vipProducts] = await Promise.all([
    getUserGroups(user.id),
    getUserSpendingInfo(user.id),
    getVIPProducts()
  ])
  
  // Check if user is VIP
  const isVIP = userGroups.some(g => g?.slug === 'vip')
  const highestGroup = userGroups.reduce((highest, group) => {
    if (!highest || (group?.discount_percentage || 0) > (highest.discount_percentage || 0)) {
      return group
    }
    return highest
  }, null)
  
  // Calculate progress to next tier
  const lifetimeSpend = spendingInfo?.lifetime_spend_cents || 0
  let nextTier = null
  let progressToNext = 0
  
  if (lifetimeSpend < 50000) {
    nextTier = { name: 'Bronze', threshold: 50000 }
    progressToNext = (lifetimeSpend / 50000) * 100
  } else if (lifetimeSpend < 100000) {
    nextTier = { name: 'Silver', threshold: 100000 }
    progressToNext = ((lifetimeSpend - 50000) / 50000) * 100
  } else if (lifetimeSpend < 250000) {
    nextTier = { name: 'Gold', threshold: 250000 }
    progressToNext = ((lifetimeSpend - 100000) / 150000) * 100
  } else if (lifetimeSpend < 500000) {
    nextTier = { name: 'VIP', threshold: 500000 }
    progressToNext = ((lifetimeSpend - 250000) / 250000) * 100
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <Gem className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              {isVIP ? 'Welcome to VIP' : 'VIP Members Club'}
            </h1>
            <p className="text-xl opacity-90">
              {isVIP 
                ? 'Enjoy exclusive access to limited editions and special benefits'
                : 'Join our exclusive membership tiers for special benefits and first access'
              }
            </p>
          </div>
        </div>
      </section>

      {/* User Status Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Membership Status</h2>
                  <div className="flex items-center gap-3">
                    {highestGroup ? (
                      <>
                        <Badge 
                          className="px-3 py-1 text-sm"
                          style={{ backgroundColor: highestGroup.badge_color }}
                        >
                          {highestGroup.name}
                        </Badge>
                        {highestGroup.discount_percentage > 0 && (
                          <span className="text-sm text-gray-600">
                            {highestGroup.discount_percentage}% discount on all orders
                          </span>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary">General Member</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Lifetime Spend</p>
                  <p className="text-3xl font-bold">
                    ${(lifetimeSpend / 100).toFixed(2)}
                  </p>
                  {spendingInfo?.total_orders_count && (
                    <p className="text-sm text-gray-600 mt-1">
                      {spendingInfo.total_orders_count} orders
                    </p>
                  )}
                </div>
              </div>

              {nextTier && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Progress to {nextTier.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${((nextTier.threshold - lifetimeSpend) / 100).toFixed(2)} to go
                    </span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <p className="text-xs text-gray-600 mt-2">
                    Spend ${(nextTier.threshold / 100).toFixed(0)} total to unlock {nextTier.name} benefits
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Membership Tiers</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Valued Customer */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Star className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">Valued Customer</h3>
                    <p className="text-sm text-gray-600">Any purchase</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    <span>5% discount on all orders</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    <span>Exclusive newsletter</span>
                  </li>
                </ul>
              </Card>

              {/* Bronze */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Trophy className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">Bronze</h3>
                    <p className="text-sm text-gray-600">$500-$999</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600" />
                    <span>7% discount</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600" />
                    <span>Free shipping over $100</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600" />
                    <span>Early access to new releases</span>
                  </li>
                </ul>
              </Card>

              {/* Silver */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Medal className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">Silver</h3>
                    <p className="text-sm text-gray-600">$1,000-$2,499</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <span>10% discount</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <span>Free shipping over $50</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <span>Silver-exclusive products</span>
                  </li>
                </ul>
              </Card>

              {/* Gold */}
              <Card className="p-6 hover:shadow-lg transition-shadow border-yellow-500 border-2">
                <div className="flex items-center mb-4">
                  <Crown className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">Gold</h3>
                    <p className="text-sm text-gray-600">$2,500-$4,999</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                    <span>15% discount</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                    <span>Free shipping always</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                    <span>Early convention exclusives</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </Card>

              {/* VIP */}
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-600 border-2 lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex items-center mb-4">
                  <Gem className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">VIP</h3>
                    <p className="text-sm text-gray-600">$5,000+ or by invitation</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>20% discount on everything</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>Free expedited shipping</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>First access to limited editions</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>VIP-only exclusive products</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>Personal account manager</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>Event invitations</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Exclusive Products */}
      {isVIP && vipProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 px-4 py-1 bg-purple-600 text-white">
                  VIP EXCLUSIVE
                </Badge>
                <h2 className="text-3xl font-bold">Your Exclusive Products</h2>
                <p className="text-gray-600 mt-2">
                  These products are only available to VIP members
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vipProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!isVIP && (
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Start Your Journey to VIP
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Every purchase brings you closer to exclusive benefits and first access to limited editions
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" variant="secondary">
                    Shop Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/account">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-purple-600">
                    View Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}