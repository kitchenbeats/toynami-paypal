import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Award, Settings, Image, Tag, FileText, Palette, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  activeProducts: number
  activeRaffles: number
  totalEntries: number
}

async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  
  // Get product count
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)

  // Get customer count
  const { count: customerCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  // Get active raffles count
  const { count: raffleCount } = await supabase
    .from('raffles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .is('deleted_at', null)

  // Get total raffle entries
  const { count: entryCount } = await supabase
    .from('raffle_entries')
    .select('*', { count: 'exact', head: true })

  return {
    totalRevenue: 0, // Orders not implemented yet
    totalOrders: 0, // Orders not implemented yet  
    totalCustomers: customerCount || 0,
    avgOrderValue: 0, // Orders not implemented yet
    activeProducts: productCount || 0,
    activeRaffles: raffleCount || 0,
    totalEntries: entryCount || 0,
  }
}

async function getTopProducts() {
  const supabase = await createClient()
  
  // Get top products by featured status and recent creation
  const { data: products } = await supabase
    .from('products')
    .select(`
      name,
      variants:product_variants(price_cents, stock),
      categories:product_categories(
        category:categories(name)
      )
    `)
    .eq('is_featured', true)
    .eq('status', 'active')
    .eq('is_visible', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(3)

  return products || []
}

export async function AdminDashboardServer() {
  const stats = await getAdminStats()
  const topProducts = await getTopProducts()

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Orders not implemented yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders not implemented yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">Live products</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Raffles</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRaffles}</div>
              <p className="text-xs text-muted-foreground">{stats.totalEntries} total entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Order system not implemented yet</p>
                <p className="text-sm text-muted-foreground mt-2">Orders will appear here once payment processing is complete</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Currently featured items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? topProducts.map((product, index) => {
                  const minPrice = product.variants && product.variants.length > 0 
                    ? Math.min(...product.variants.map((v: any) => v.price_cents)) / 100
                    : 0
                  const totalStock = product.variants 
                    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
                    : 0
                  
                  return (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{totalStock} in stock</p>
                        </div>
                      </div>
                      <p className="font-medium">${minPrice.toFixed(2)}+</p>
                    </div>
                  )
                }) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No featured products found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/carousel">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Homepage Carousel
                    </CardTitle>
                    <CardDescription>Manage hero slides</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure homepage carousel slides and settings</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products
                    </CardTitle>
                    <CardDescription>Manage products with PayPal sync</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create and manage products synced with PayPal Catalog</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Categories
                    </CardTitle>
                    <CardDescription>Organize products into categories</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage product categories and hierarchy</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/brands">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Brands
                    </CardTitle>
                    <CardDescription>Manage product brands</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Add and organize brands</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/banners">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Banners
                    </CardTitle>
                    <CardDescription>Manage promotional banners</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure homepage and promotional banners</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Blog/Announcements
                    </CardTitle>
                    <CardDescription>Manage blog posts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create and publish announcements</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customer-groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Customer Groups
                    </CardTitle>
                    <CardDescription>Manage customer permissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Control product visibility by group</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/options">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Global Options
                    </CardTitle>
                    <CardDescription>Manage product option types</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create reusable options like Size, Color, Material</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="products" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your product catalog - {stats.activeProducts} active products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced product management interface coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">Use the Products link above for basic product management</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Order management system coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">Orders will be managed here once PayPal integration is complete</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>View and manage customer accounts - {stats.totalCustomers} registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Customer management interface coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>Configure your store settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Settings interface coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}