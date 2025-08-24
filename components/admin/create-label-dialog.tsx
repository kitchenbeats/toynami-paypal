'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface CreateLabelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: {
    orderId: string
    orderNumber: string
    shipTo: {
      name: string
      street1: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    weight?: {
      value: number
      units: string
    }
  }
  onSuccess?: () => void
}

export function CreateLabelDialog({ open, onOpenChange, order, onSuccess }: CreateLabelDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    carrierCode: 'usps',
    serviceCode: 'usps_priority_mail',
    packageCode: 'package',
    weight: order.weight?.value || 1,
    weightUnits: order.weight?.units || 'pounds'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/shipstation/create-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          ...formData,
          weight: {
            value: formData.weight,
            units: formData.weightUnits
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create label')
      }

      const result = await response.json()
      
      // Show success message
      toast.success(`Label created! Tracking: ${result.trackingNumber}`)
      
      // Open label in new window/tab for printing
      if (result.labelUrl) {
        // If it's a base64 PDF, create a blob and open it
        if (result.labelUrl.startsWith('data:application/pdf')) {
          const win = window.open(result.labelUrl, '_blank')
          if (win) {
            win.focus()
            // Trigger print dialog after a short delay
            setTimeout(() => {
              win.print()
            }, 1000)
          }
        } else {
          // If it's a URL, just open it
          window.open(result.labelUrl, '_blank')
        }
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating label:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create label')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Shipping Label</DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ship To Address (Read-only) */}
          <div className="space-y-2">
            <Label>Ship To</Label>
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              <div>{order.shipTo.name}</div>
              <div>{order.shipTo.street1}</div>
              <div>{order.shipTo.city}, {order.shipTo.state} {order.shipTo.postalCode}</div>
              <div>{order.shipTo.country}</div>
            </div>
          </div>

          {/* Carrier Selection */}
          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select 
              value={formData.carrierCode} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, carrierCode: value }))}
            >
              <SelectTrigger id="carrier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usps">USPS</SelectItem>
                <SelectItem value="ups">UPS</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
                <SelectItem value="dhl_express">DHL Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select 
              value={formData.serviceCode} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCode: value }))}
            >
              <SelectTrigger id="service">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usps_priority_mail">Priority Mail</SelectItem>
                <SelectItem value="usps_first_class_mail">First Class Mail</SelectItem>
                <SelectItem value="usps_parcel_select">Parcel Select</SelectItem>
                <SelectItem value="usps_media_mail">Media Mail</SelectItem>
                <SelectItem value="ups_ground">UPS Ground</SelectItem>
                <SelectItem value="ups_next_day_air">UPS Next Day Air</SelectItem>
                <SelectItem value="fedex_ground">FedEx Ground</SelectItem>
                <SelectItem value="fedex_2day">FedEx 2Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Package Type */}
          <div className="space-y-2">
            <Label htmlFor="package">Package Type</Label>
            <Select 
              value={formData.packageCode} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, packageCode: value }))}
            >
              <SelectTrigger id="package">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="package">Package</SelectItem>
                <SelectItem value="large_envelope_or_flat">Large Envelope</SelectItem>
                <SelectItem value="flat_rate_envelope">Flat Rate Envelope</SelectItem>
                <SelectItem value="flat_rate_padded_envelope">Flat Rate Padded Envelope</SelectItem>
                <SelectItem value="small_flat_rate_box">Small Flat Rate Box</SelectItem>
                <SelectItem value="medium_flat_rate_box">Medium Flat Rate Box</SelectItem>
                <SelectItem value="large_flat_rate_box">Large Flat Rate Box</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightUnits">Units</Label>
              <Select 
                value={formData.weightUnits} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, weightUnits: value }))}
              >
                <SelectTrigger id="weightUnits">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pounds">Pounds</SelectItem>
                  <SelectItem value="ounces">Ounces</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="kilograms">Kilograms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Label'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}