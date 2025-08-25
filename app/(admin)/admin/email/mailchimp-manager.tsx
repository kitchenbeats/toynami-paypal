'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, Users, ShoppingCart, Package, 
  RefreshCw, CheckCircle, XCircle, AlertCircle,
  Zap, ExternalLink, Activity
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface MailchimpSettings {
  id?: string
  api_key?: string
  server_prefix?: string
  list_id?: string
  store_id?: string
  sync_customers?: boolean
  sync_orders?: boolean
  sync_products?: boolean
  sync_carts?: boolean
  is_active?: boolean
  store_name?: string
  store_domain?: string
  store_currency_code?: string
  last_sync_at?: string
  last_sync_status?: string
}

interface Props {
  initialSettings?: MailchimpSettings | null
  stats: {
    totalSynced: number
    pending: number
    failed: number
  }
}

export function MailchimpManager({ initialSettings, stats }: Props) {
  const [settings, setSettings] = useState<MailchimpSettings>(initialSettings || {
    sync_customers: true,
    sync_orders: true,
    sync_products: true,
    sync_carts: true,
    is_active: false,
    store_currency_code: 'USD'
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean
    message?: string
    data?: unknown
  } | null>(null)
  
  const supabase = createClient()

  const testConnection = useCallback(async () => {
    setTesting(true)
    setConnectionStatus(null)
    
    try {
      const response = await fetch('/api/admin/mailchimp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setConnectionStatus({
          connected: true,
          message: 'Connection successful!',
          data: result.data
        })
        toast.success('Connected to Mailchimp successfully')
      } else {
        setConnectionStatus({
          connected: false,
          message: result.error || 'Connection failed'
        })
        toast.error(result.error || 'Connection failed')
      }
    } catch {
      setConnectionStatus({
        connected: false,
        message: 'Failed to test connection'
      })
      toast.error('Failed to test connection')
    } finally {
      setTesting(false)
    }
  }, [settings])

  // Test connection when component mounts if configured
  useEffect(() => {
    if (settings.api_key && settings.is_active) {
      testConnection()
    }
  }, [settings.api_key, settings.is_active, testConnection])

  const saveSettings = async () => {
    setLoading(true)
    try {
      if (settings.id) {
        // Update existing
        const { error } = await supabase
          .from('mailchimp_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
        
        if (error) throw error
      } else {
        // Create new
        const { data, error } = await supabase
          .from('mailchimp_settings')
          .insert({
            ...settings,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        if (data) setSettings(data)
      }
      
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }


  const syncAllCustomers = async () => {
    if (!confirm('This will sync all customers to Mailchimp. Continue?')) return
    
    setSyncing(true)
    try {
      const response = await fetch('/api/admin/mailchimp/sync-customers', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(`Synced ${result.count} customers to Mailchimp`)
      } else {
        toast.error(result.error || 'Sync failed')
      }
    } catch {
      toast.error('Failed to sync customers')
    } finally {
      setSyncing(false)
    }
  }

  const syncAllProducts = async () => {
    if (!confirm('This will sync all products to Mailchimp. Continue?')) return
    
    setSyncing(true)
    try {
      const response = await fetch('/api/admin/mailchimp/sync-products', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(`Synced ${result.count} products to Mailchimp`)
      } else {
        toast.error(result.error || 'Sync failed')
      }
    } catch {
      toast.error('Failed to sync products')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {connectionStatus && (
        <Alert className={connectionStatus.connected ? 'border-green-500' : 'border-red-500'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{connectionStatus.message}</p>
                {connectionStatus.data && (
                  <div className="text-sm mt-1">
                    <p>List: {connectionStatus.data.listName}</p>
                    <p>Members: {connectionStatus.data.memberCount}</p>
                  </div>
                )}
              </div>
              {connectionStatus.connected && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Integration Status</p>
                <div className="flex items-center gap-2">
                  {settings.is_active ? (
                    <>
                      <Badge variant="default">Active</Badge>
                      <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    </>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Synced Customers</p>
                <p className="text-2xl font-bold">{stats.totalSynced}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="sync">Sync Options</TabsTrigger>
          <TabsTrigger value="tools">Manual Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mailchimp Configuration</CardTitle>
              <CardDescription>
                Connect your Mailchimp account to sync customers and track purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key *</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={settings.api_key || ''}
                    onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us14"
                  />
                  <p className="text-xs text-muted-foreground">
                    Find your API key in Mailchimp → Account → Extras → API keys
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server_prefix">Server Prefix *</Label>
                  <Input
                    id="server_prefix"
                    value={settings.server_prefix || ''}
                    onChange={(e) => setSettings({ ...settings, server_prefix: e.target.value })}
                    placeholder="us14"
                  />
                  <p className="text-xs text-muted-foreground">
                    The last part of your API key (e.g., us14, us21)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="list_id">List/Audience ID *</Label>
                  <Input
                    id="list_id"
                    value={settings.list_id || ''}
                    onChange={(e) => setSettings({ ...settings, list_id: e.target.value })}
                    placeholder="abc123def4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mailchimp → Audience → Settings → Audience name and defaults
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_id">Store ID (for e-commerce)</Label>
                  <Input
                    id="store_id"
                    value={settings.store_id || ''}
                    onChange={(e) => setSettings({ ...settings, store_id: e.target.value })}
                    placeholder="toynami-store"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Enable e-commerce tracking
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settings.is_active || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, is_active: checked })}
                  />
                  <div>
                    <Label>Enable Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Start syncing data to Mailchimp
                    </p>
                  </div>
                </div>
                <Button onClick={testConnection} disabled={testing}>
                  {testing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://mailchimp.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Mailchimp
                </Button>
                <Button onClick={saveSettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Options</CardTitle>
              <CardDescription>
                Choose what data to sync with Mailchimp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Sync Customers</p>
                      <p className="text-sm text-muted-foreground">
                        Add new customers to your Mailchimp audience
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sync_customers || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, sync_customers: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Sync Orders</p>
                      <p className="text-sm text-muted-foreground">
                        Track purchases for segmentation and ROI
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sync_orders || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, sync_orders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Sync Products</p>
                      <p className="text-sm text-muted-foreground">
                        Enable product recommendations in emails
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sync_products || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, sync_products: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Track Abandoned Carts</p>
                      <p className="text-sm text-muted-foreground">
                        Trigger abandoned cart emails automatically
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sync_carts || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, sync_carts: checked })}
                  />
                </div>
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  All syncing happens in real-time as events occur. No scheduled jobs required!
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Sync Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Sync Tools</CardTitle>
              <CardDescription>
                Manually sync data to Mailchimp when needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <h3 className="font-medium">Sync All Customers</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Push all customers to your Mailchimp audience
                      </p>
                      <Button 
                        onClick={syncAllCustomers} 
                        disabled={syncing || !settings.is_active}
                        className="w-full"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Customers
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        <h3 className="font-medium">Sync All Products</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Push product catalog to Mailchimp
                      </p>
                      <Button 
                        onClick={syncAllProducts} 
                        disabled={syncing || !settings.is_active || !settings.store_id}
                        className="w-full"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Products
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-1">When to use manual sync:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Initial setup to sync existing data</li>
                    <li>After importing data from another system</li>
                    <li>To fix sync issues or missing data</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {settings.last_sync_at && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Last sync: {new Date(settings.last_sync_at).toLocaleString()}
                  </p>
                  {settings.last_sync_status && (
                    <p className="text-sm">
                      Status: <Badge variant="outline">{settings.last_sync_status}</Badge>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}