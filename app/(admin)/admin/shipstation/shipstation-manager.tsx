'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Store,
  Plus,
  Settings,
  Ban,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface ShipStationManagerProps {
  stores: any[]
  blockedStores: string[]
  currentStoreId: string | null
  connected: boolean
}

export function ShipStationManager({
  stores,
  blockedStores,
  currentStoreId,
  connected
}: ShipStationManagerProps) {
  const [selectedStoreId, setSelectedStoreId] = useState(currentStoreId)
  const [saving, setSaving] = useState(false)

  // Check if a store is blocked
  const isBlocked = (storeId: number | string) => {
    return blockedStores.includes(storeId.toString())
  }

  // Filter stores to separate blocked and available
  const availableStores = stores.filter(store => !isBlocked(store.storeId))
  const blockedStoresList = stores.filter(store => isBlocked(store.storeId))

  // Save store selection
  const saveStoreSelection = async () => {
    if (!selectedStoreId) {
      toast.error('Please select a store')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/shipstation/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: selectedStoreId })
      })

      if (!response.ok) throw new Error('Failed to save store selection')
      
      toast.success('Store selection saved')
    } catch (error) {
      toast.error('Failed to save store selection')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (!connected) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>ShipStation Not Connected</AlertTitle>
        <AlertDescription>
          Please check your ShipStation API credentials in the environment configuration.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm">ShipStation Connected</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://ship.shipstation.com/stores" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage in ShipStation
              </a>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Store Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Store Configuration</CardTitle>
          <CardDescription>
            Select which ShipStation store to use for this integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStoreId ? (
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertTitle>Current Store</AlertTitle>
              <AlertDescription>
                Currently using Store ID: {currentStoreId}
                {stores.find(s => s.storeId == currentStoreId)?.storeName && 
                  ` (${stores.find(s => s.storeId == currentStoreId).storeName})`
                }
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>No Store Selected</AlertTitle>
              <AlertDescription>
                You need to create a new store or select an available store for this integration.
              </AlertDescription>
            </Alert>
          )}

          {/* Create New Store Instructions */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Store (Recommended)
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Go to ShipStation dashboard</li>
              <li>Navigate to Settings → Stores & Orders → Store Setup</li>
              <li>Click "Connect a Store or Marketplace"</li>
              <li>Select "ShipStation" as the selling channel</li>
              <li>Name it "Toynami PayPal Integration" or similar</li>
              <li>Complete setup and note the new Store ID</li>
              <li>Return here and refresh to see the new store</li>
            </ol>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              asChild
            >
              <a 
                href="https://ship.shipstation.com/stores/add" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Store in ShipStation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blocked Stores */}
      {blockedStoresList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Blocked Stores
            </CardTitle>
            <CardDescription>
              These existing stores cannot be used for this integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blockedStoresList.map(store => (
                <div 
                  key={store.storeId} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-red-50"
                >
                  <div>
                    <p className="font-medium">{store.storeName}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {store.storeId} • {store.marketplaceName}
                    </p>
                  </div>
                  <Badge variant="destructive">Blocked</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Stores */}
      {availableStores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Stores</CardTitle>
            <CardDescription>
              Select a store for this integration (create a new one if none exist)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {availableStores.map(store => (
                <div 
                  key={store.storeId} 
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStoreId == store.storeId 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedStoreId(store.storeId.toString())}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="store"
                      value={store.storeId}
                      checked={selectedStoreId == store.storeId}
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-medium">{store.storeName}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {store.storeId} • {store.marketplaceName}
                        {store.companyName && ` • ${store.companyName}`}
                      </p>
                    </div>
                  </div>
                  {store.active ? (
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={saveStoreSelection}
                disabled={!selectedStoreId || saving}
              >
                {saving ? 'Saving...' : 'Save Store Selection'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Store ID Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Configuration</CardTitle>
          <CardDescription>
            If you've created a new store, enter its ID here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-store-id">Store ID</Label>
            <div className="flex gap-2">
              <Input
                id="manual-store-id"
                type="text"
                placeholder="Enter Store ID"
                value={selectedStoreId || ''}
                onChange={(e) => setSelectedStoreId(e.target.value)}
              />
              <Button 
                onClick={saveStoreSelection}
                disabled={!selectedStoreId || saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the Store ID from ShipStation after creating a new store
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}