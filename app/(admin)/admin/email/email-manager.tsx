'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, Mail, Send, Users, BarChart3,
  Target, Zap, Heart, ShoppingCart, Gift
} from 'lucide-react'

export function EmailManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage email marketing campaigns to engage your customers
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Templates */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Campaign Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Heart className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Welcome Series</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Onboard new customers with a warm welcome
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Welcome Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Abandoned Cart</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Recover lost sales with cart reminders
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Cart Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Gift className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Product Launch</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Announce new products to your customers
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Launch Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Zap className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Flash Sale</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Create urgency with limited-time offers
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Sale Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Mail className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Share updates and content with subscribers
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Newsletter
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-solid transition-all cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Customer Feedback</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Collect reviews and testimonials
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Survey Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Automation Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Customer Journey</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Welcome Series</Badge>
                <Badge variant="outline" className="mr-2">First Purchase</Badge>
                <Badge variant="outline" className="mr-2">Repeat Customer</Badge>
                <Badge variant="outline" className="mr-2">VIP Customer</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Behavioral Triggers</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Cart Abandonment</Badge>
                <Badge variant="outline" className="mr-2">Browse Abandonment</Badge>
                <Badge variant="outline" className="mr-2">Win-back Campaign</Badge>
                <Badge variant="outline" className="mr-2">Restock Alerts</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent className="p-12 text-center">
          <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Marketing Coming Soon</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Advanced email marketing capabilities are in development. Create beautiful 
            campaigns, automate customer journeys, and track detailed analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Drag & Drop Editor</Badge>
            <Badge variant="outline">Customer Segmentation</Badge>
            <Badge variant="outline">A/B Testing</Badge>
            <Badge variant="outline">Automation Workflows</Badge>
            <Badge variant="outline">Analytics Dashboard</Badge>
            <Badge variant="outline">Template Library</Badge>
            <Badge variant="outline">Personalization</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}