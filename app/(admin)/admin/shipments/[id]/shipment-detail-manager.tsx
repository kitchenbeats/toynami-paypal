'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  DollarSign, 
  Truck, 
  User, 
  Hash,
  Printer,
  RefreshCw,
  Edit,
  X
} from 'lucide-react'
import Link from 'next/link'

interface ShipmentItem {
  name: string;
  quantity: number;
  unitPrice: number;
  sku?: string;
  lineItemKey?: string;
}

interface ShipmentAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface Shipment {
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  createDate: string;
  shipDate: string;
  shipmentCost: number;
  insuranceCost: number;
  trackingNumber: string;
  isReturnLabel: boolean;
  batchNumber?: string;
  carrierCode: string;
  serviceCode: string;
  packageCode: string;
  confirmation?: string;
  warehouseId?: string;
  voided: boolean;
  voidDate?: string;
  marketplaceNotified: boolean;
  notifyErrorMessage?: string;
  shipTo: ShipmentAddress;
  weight: {
    value: number;
    units: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    units: string;
  };
  insuranceOptions?: {
    provider: string;
    insureShipment: boolean;
    insuredValue: number;
  };
  advancedOptions?: Record<string, unknown>;
  items: ShipmentItem[];
  labelData?: string;
  formData?: string;
}

interface ShipmentDetailManagerProps {
  shipment: Shipment
}

export function ShipmentDetailManager({ shipment }: ShipmentDetailManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'awaiting_shipment':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'on_hold':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateLabel = () => {
    // This should open the create label dialog
    // For now, we'll redirect to the shipments page where the dialog is available
    router.push('/admin/shipments')
    toast.info('Use the print button on the shipments list to create a label')
  }

  const handlePrintLabel = () => {
    // If there's a tracking number, try to get the label from our database
    if (shipment.trackingNumber) {
      // Open ShipStation label URL if available
      // ShipStation tracking numbers can be used to generate label URLs
      const labelUrl = `https://ship.shipstation.com/label/${shipment.shipmentId}`
      window.open(labelUrl, '_blank')
    } else {
      toast.error('No label available for this shipment')
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/shipstation/orders/${shipment.orderId}/cancel`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to cancel order')
      
      toast.success('Order cancelled successfully')
      router.refresh()
    } catch (error) {
        console.error('API request failed:', error)
      toast.error('Failed to cancel order')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/shipments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Shipment Details</h1>
            <p className="text-muted-foreground">
              Order #{shipment.orderNumber} • ShipStation ID: {shipment.orderId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(shipment.orderStatus)}>
            {shipment.orderStatus?.replace('_', ' ').toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {shipment.orderStatus === 'awaiting_shipment' && (
              <>
                <Button onClick={handleCreateLabel} disabled={loading}>
                  <Printer className="h-4 w-4 mr-2" />
                  Create Label
                </Button>
                <Button variant="outline" disabled={loading}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
                <Button variant="destructive" onClick={handleCancelOrder} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              </>
            )}
            {shipment.orderStatus === 'shipped' && (
              <>
                <Button variant="outline" onClick={handlePrintLabel}>
                  <Printer className="h-4 w-4 mr-2" />
                  Reprint Label
                </Button>
                <Button variant="outline" onClick={() => {
                  if (shipment.trackingNumber) {
                    // Open tracking page - this varies by carrier
                    const carrier = shipment.carrierCode?.toLowerCase()
                    let trackingUrl = ''
                    
                    switch(carrier) {
                      case 'usps':
                        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${shipment.trackingNumber}`
                        break
                      case 'ups':
                        trackingUrl = `https://www.ups.com/track?tracknum=${shipment.trackingNumber}`
                        break
                      case 'fedex':
                        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${shipment.trackingNumber}`
                        break
                      default:
                        trackingUrl = `https://www.google.com/search?q=${shipment.trackingNumber}`
                    }
                    
                    window.open(trackingUrl, '_blank')
                  } else {
                    toast.error('No tracking number available')
                  }
                }}>
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Date:</span>
                <p className="font-medium">{new Date(shipment.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ship By Date:</span>
                <p className="font-medium">
                  {shipment.shipByDate ? new Date(shipment.shipByDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Order Total:</span>
                <p className="font-medium text-lg">${shipment.orderTotal || '0.00'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shipping Amount:</span>
                <p className="font-medium">${shipment.shippingAmount || '0.00'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tax Amount:</span>
                <p className="font-medium">${shipment.taxAmount || '0.00'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Weight:</span>
                <p className="font-medium">
                  {shipment.weight ? `${shipment.weight.value} ${shipment.weight.units}` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{shipment.customerUsername || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{shipment.customerEmail || 'N/A'}</p>
              </div>
              {shipment.customerPhone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{shipment.customerPhone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shipment.shipTo ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{shipment.shipTo.name}</p>
                {shipment.shipTo.company && <p>{shipment.shipTo.company}</p>}
                <p>{shipment.shipTo.street1}</p>
                {shipment.shipTo.street2 && <p>{shipment.shipTo.street2}</p>}
                {shipment.shipTo.street3 && <p>{shipment.shipTo.street3}</p>}
                <p>
                  {shipment.shipTo.city}, {shipment.shipTo.state} {shipment.shipTo.postalCode}
                </p>
                <p>{shipment.shipTo.country}</p>
                {shipment.shipTo.phone && <p className="mt-2">Phone: {shipment.shipTo.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address available</p>
            )}
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shipment.billTo ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{shipment.billTo.name}</p>
                {shipment.billTo.company && <p>{shipment.billTo.company}</p>}
                <p>{shipment.billTo.street1}</p>
                {shipment.billTo.street2 && <p>{shipment.billTo.street2}</p>}
                <p>
                  {shipment.billTo.city}, {shipment.billTo.state} {shipment.billTo.postalCode}
                </p>
                <p>{shipment.billTo.country}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Same as shipping address</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items ({shipment.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shipment.items && shipment.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3">SKU</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-center p-3">Qty</th>
                    <th className="text-right p-3">Unit Price</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {shipment.items.map((item, index) => (
                    <tr key={item.orderItemId || index} className="border-b">
                      <td className="p-3 font-mono text-xs">{item.sku || 'N/A'}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.imageUrl && (
                            <div className="relative h-12 w-12 mt-1">
                              <Image 
                                src={item.imageUrl} 
                                alt={item.name} 
                                fill
                                className="object-cover rounded" 
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice || '0.00'}</td>
                      <td className="p-3 text-right font-medium">
                        ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-medium">Subtotal:</td>
                    <td className="p-3 text-right font-medium">
                      ${shipment.items.reduce((sum: number, item) => 
                        sum + (item.unitPrice || 0) * item.quantity, 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No items in this order</p>
          )}
        </CardContent>
      </Card>

      {/* Shipping Information */}
      {(shipment.carrierCode || shipment.serviceCode) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Carrier:</span>
                <p className="font-medium">{shipment.carrierCode?.toUpperCase() || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Service:</span>
                <p className="font-medium">{shipment.serviceCode || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Package Type:</span>
                <p className="font-medium">{shipment.packageCode || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Confirmation:</span>
                <p className="font-medium">{shipment.confirmation || 'None'}</p>
              </div>
            </div>
            
            {shipment.advancedOptions && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Advanced Options</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Saturday Delivery:</span>
                    <p className="font-medium">{shipment.advancedOptions.saturdayDelivery ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Non-Machinable:</span>
                    <p className="font-medium">{shipment.advancedOptions.nonMachinable ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contains Alcohol:</span>
                    <p className="font-medium">{shipment.advancedOptions.containsAlcohol ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bill to Party:</span>
                    <p className="font-medium">{shipment.advancedOptions.billToParty || 'My Account'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {(shipment.customerNotes || shipment.internalNotes || shipment.gift) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes & Special Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shipment.customerNotes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Customer Notes</h4>
                <p className="text-sm p-3 bg-yellow-50 rounded">{shipment.customerNotes}</p>
              </div>
            )}
            {shipment.internalNotes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Internal Notes</h4>
                <p className="text-sm p-3 bg-blue-50 rounded">{shipment.internalNotes}</p>
              </div>
            )}
            {shipment.gift && (
              <div>
                <Badge variant="secondary" className="mb-2">Gift Order</Badge>
                {shipment.giftMessage && (
                  <p className="text-sm p-3 bg-pink-50 rounded">{shipment.giftMessage}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}