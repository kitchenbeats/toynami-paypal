'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Package, Heart, MapPin, CreditCard, Trophy, Settings, ShoppingBag, Clock } from 'lucide-react'

interface AccountDashboardProps {
  user: User | null
}

export function AccountDashboard({ user }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in production, fetch from Supabase
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-03-15',
      total: 439.98,
      status: 'delivered',
      items: 2,
    },
    {
      id: 'ORD-002',
      date: '2024-03-10',
      total: 189.99,
      status: 'shipped',
      items: 1,
    },
    {
      id: 'ORD-003',
      date: '2024-03-05',
      total: 79.99,
      status: 'processing',
      items: 1,
    },
  ]

  const loyaltyTier = {
    name: 'Silver Collector',
    points: 1250,
    nextTier: 'Gold Collector',
    pointsToNext: 750,
    totalSpent: 709.96,
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime purchases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${loyaltyTier.totalSpent}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyTier.points}</div>
              <p className="text-xs text-muted-foreground">{loyaltyTier.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Saved for later</p>
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
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items} items • {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'default'
                          : order.status === 'shipped'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {orders.map((order) => (
                <div key={order.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'default'
                            : order.status === 'shipped'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {order.status}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wishlist" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
            <CardDescription>Items you've saved for later</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your wishlist is empty</p>
              <Button className="mt-4">Browse Products</Button>
            </div>
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
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Home (Default)</p>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street<br />
                        Anytown, ST 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add New Address
              </Button>
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
            <div className="text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">{loyaltyTier.name}</h3>
              <p className="text-muted-foreground">Current Tier</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Points</span>
                <span className="font-medium">{loyaltyTier.points}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(loyaltyTier.points / (loyaltyTier.points + loyaltyTier.pointsToNext)) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {loyaltyTier.pointsToNext} points to {loyaltyTier.nextTier}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Your Benefits</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 5% discount on all orders</li>
                  <li>• Early access to sales</li>
                  <li>• Free shipping on orders over $75</li>
                  <li>• Birthday bonus points</li>
                </ul>
              </div>
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
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" />
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
  )
}