'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Package, Heart, MapPin, CreditCard, Trophy, ShoppingBag } from 'lucide-react'

interface AccountDashboardProps {
  user: User | null
}

export function AccountDashboard({ user }: AccountDashboardProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [orders, setOrders] = useState<unknown[]>([])
  const [addresses, setAddresses] = useState<unknown[]>([])
  const [wishlistItems, setWishlistItems] = useState<unknown[]>([])
  // User profile state removed - not currently used
  const [loading, setLoading] = useState(true)
  const [editableProfile, setEditableProfile] = useState({
    full_name: '',
    phone: ''
  })
  
  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview')
  }, [searchParams])
  
  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])
  
  const fetchUserData = async () => {
    if (!user) return
    
    const supabase = createClient()
    setLoading(true)
    
    try {
      // Fetch user profile from users table
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      // Fetch actual orders from database
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      // Fetch user addresses  
      const { data: addressesData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
      
      // Fetch wishlist items with product data
      // First get user's wishlists, then get items from those wishlists
      const { data: userWishlists } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .is('deleted_at', null)
      
      let wishlistData: Array<{
        id: string;
        added_at: string;
        product_id: string;
        products: {
          id: string;
          name: string;
          slug: string;
          base_price_cents: number;
          images: Array<{ image_filename: string; is_primary: boolean }>;
        };
      }> = []
      if (userWishlists && userWishlists.length > 0) {
        const wishlistIds = userWishlists.map(w => w.id)
        const { data: items } = await supabase
          .from('wishlist_items')
          .select(`
            id,
            added_at,
            product_id,
            products (
              id,
              name
            )
          `)
          .in('wishlist_id', wishlistIds)
        wishlistData = items || []
      }
      
      setOrders(ordersData || [])
      setAddresses(addressesData || [])
      setWishlistItems(wishlistData)
      setUserProfile(profileData)
      
      // Set editable profile state
      if (profileData) {
        setEditableProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'overview') {
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    router.push(`${pathname}?${params.toString()}`)
    setActiveTab(value)
  }

  // Calculate totals from real data (using correct column names from schema)
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_cents || 0), 0)
  const totalOrders = orders.length
  const wishlistCount = wishlistItems.length

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="flex -space-x-px rounded-lg mb-8">
        <button
          onClick={() => handleTabChange('overview')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-l-lg border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'overview' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange('orders')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'orders' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => handleTabChange('wishlist')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'wishlist' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => handleTabChange('addresses')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'addresses' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Addresses
        </button>
        <button
          onClick={() => handleTabChange('loyalty')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'loyalty' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Loyalty
        </button>
        <button
          onClick={() => handleTabChange('settings')}
          className={`relative flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-r-lg border focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            activeTab === 'settings' 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Settings
        </button>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {totalOrders === 0 ? 'No orders yet' : 'All time orders'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `$${(totalSpent / 100).toFixed(2)}`}</div>
              <p className="text-xs text-muted-foreground">
                {totalSpent === 0 ? 'No purchases yet' : 'All time spending'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Loyalty system coming soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : wishlistCount}</div>
              <p className="text-xs text-muted-foreground">
                {wishlistCount === 0 ? 'No items saved yet' : 'Saved for later'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${((order.total_cents || 0) / 100).toFixed(2)}</p>
                      <Badge variant="outline">
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and track all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${((order.total_cents || 0) / 100).toFixed(2)}</p>
                        <Badge variant="outline">
                          {order.status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Track Order</Button>
                      {order.status === 'delivered' && (
                        <Button size="sm" variant="outline">Leave Review</Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wishlist" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
            <CardDescription>Items you&apos;ve saved for later</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading wishlist...</p>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your wishlist is empty</p>
                <Button className="mt-4">Browse Products</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.products?.name || 'Product'}</h3>
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(item.added_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Add to Cart</Button>
                      <Button size="sm" variant="outline">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="addresses" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>Manage your shipping and billing addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No saved addresses yet</p>
                  <Button className="mt-4">
                    Add New Address
                  </Button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">
                            {address.full_name || 'Address'} {address.is_default && '(Default)'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.address_line1}<br />
                            {address.address_line2 && `${address.address_line2}<br />`}
                            {address.city}, {address.state} {address.postal_code}<br />
                            {address.country || 'United States'}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))
              )}
              {addresses.length > 0 && (
                <Button variant="outline" className="w-full">
                  Add New Address
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="loyalty" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program</CardTitle>
            <CardDescription>Track your rewards and tier status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground">Loyalty Program</h3>
              <p className="text-muted-foreground mt-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-4">
                Earn points on every purchase and unlock exclusive rewards
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={editableProfile.full_name} 
                onChange={(e) => setEditableProfile(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={editableProfile.phone} 
                onChange={(e) => setEditableProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number" 
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>Choose what emails you want to receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Order updates', 'New products', 'Sales & promotions', 'Loyalty rewards'].map((pref) => (
                <div key={pref} className="flex items-center space-x-2">
                  <input type="checkbox" id={pref} className="rounded" defaultChecked />
                  <Label htmlFor={pref} className="font-normal cursor-pointer">
                    {pref}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}