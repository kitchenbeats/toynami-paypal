'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Check, Loader2, Shield, MapPin, DollarSign } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

// US States for tax collection
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
]

// SST Member States (Free TaxCloud)
const SST_STATES = [
  'AR', 'GA', 'IN', 'IA', 'KS', 'KY', 'MI', 'MN', 'NE', 'NV', 
  'NJ', 'NC', 'ND', 'OH', 'OK', 'RI', 'SD', 'TN', 'UT', 'VT', 
  'WA', 'WV', 'WI', 'WY'
]

interface TaxSettings {
  enabled: boolean
  provider: 'taxcloud' | 'none'
  origin_address: string | null
  origin_city: string | null
  origin_state: string | null
  origin_zip: string | null
  origin_country: string
  tax_shipping: boolean
  tax_enabled_states: string[] | null
}

export default function TaxSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [settings, setSettings] = useState<TaxSettings>({
    enabled: false,
    provider: 'taxcloud',
    origin_address: null,
    origin_city: null,
    origin_state: null,
    origin_zip: null,
    origin_country: 'US',
    tax_shipping: true,
    tax_enabled_states: null
  })
  const [hasApiKeys, setHasApiKeys] = useState(false)
  const [selectAllStates, setSelectAllStates] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    // Check if all states are selected
    const allSelected = settings.tax_enabled_states === null || 
      settings.tax_enabled_states.length === US_STATES.length
    setSelectAllStates(allSelected)
  }, [settings.tax_enabled_states])

  const loadSettings = async () => {
    try {
      // Check if API keys are configured in environment
      const response = await fetch('/api/tax/calculate', { method: 'GET' })
      const status = await response.json()
      setHasApiKeys(status.configured)

      const { data, error } = await supabase
        .from('tax_settings')
        .select('enabled, provider, origin_address, origin_city, origin_state, origin_zip, origin_country, tax_shipping, tax_enabled_states')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error
      }

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load tax settings:', error)
      toast.error('Failed to load tax settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('tax_settings')
        .select('id')
        .single()

      let result
      if (existing) {
        // Update existing record
        result = await supabase
          .from('tax_settings')
          .update(settings)
          .eq('id', existing.id)
      } else {
        // Insert new record
        result = await supabase
          .from('tax_settings')
          .insert(settings)
      }

      if (result.error) {
        throw result.error
      }

      toast.success('Tax settings saved successfully')
    } catch (error) {
      console.error('Failed to save tax settings:', error)
      toast.error('Failed to save tax settings')
    } finally {
      setSaving(false)
    }
  }

  const testConfiguration = async () => {
    setTesting(true)
    try {
      // Test with a sample California address
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: 'TEST001',
            name: 'Test Product',
            price: 100.00,
            quantity: 1
          }],
          shippingAddress: {
            address: '123 Test St',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001'
          },
          shippingAmount: 10.00
        })
      })

      const result = await response.json()
      
      if (result.success && result.enabled) {
        toast.success(`Test successful! Tax calculated: $${result.totalTax.toFixed(2)} (${(result.taxRate * 100).toFixed(2)}%)`)
      } else if (!result.enabled) {
        toast.warning('Tax calculation is disabled. Enable it to test.')
      } else {
        toast.error(result.error || 'Test failed')
      }
    } catch (error) {
      console.error('Failed to test tax configuration:', error)
      toast.error('Failed to test tax configuration')
    } finally {
      setTesting(false)
    }
  }

  const handleStateToggle = (stateCode: string) => {
    const currentStates = settings.tax_enabled_states || []
    const isSelected = currentStates.includes(stateCode)
    
    if (isSelected) {
      setSettings({
        ...settings,
        tax_enabled_states: currentStates.filter(s => s !== stateCode)
      })
    } else {
      setSettings({
        ...settings,
        tax_enabled_states: [...currentStates, stateCode]
      })
    }
  }

  const handleSelectAllStates = (checked: boolean) => {
    setSelectAllStates(checked)
    if (checked) {
      setSettings({
        ...settings,
        tax_enabled_states: null // null means all states
      })
    } else {
      setSettings({
        ...settings,
        tax_enabled_states: [] // empty array means no states
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tax Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure sales tax calculation using TaxCloud&apos;s FREE API
        </p>
        
        {/* Cost Breakdown */}
        <Alert className="mt-4 border-green-200 bg-green-50">
          <DollarSign className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">TaxCloud Pricing Breakdown</AlertTitle>
          <AlertDescription className="text-green-700">
            <div className="mt-2 space-y-1">
              <p>✓ <strong>Tax Calculations via API:</strong> FREE forever (what you&apos;re using)</p>
              <p>✓ <strong>No credit card required</strong> for API access</p>
              <p className="text-xs mt-2 text-gray-600">
                Optional services you&apos;re NOT using: Tax filing ($10-50/mo), Exemption certificates ($5/mo)
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-6">
        {/* Master Switch */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tax Calculation
            </CardTitle>
            <CardDescription>
              Enable or disable tax calculation for all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tax-enabled">Enable Tax Calculation</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  When disabled, no tax will be calculated or collected
                </p>
              </div>
              <Switch
                id="tax-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>

            {settings.enabled && !hasApiKeys && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Configuration Required</AlertTitle>
                <AlertDescription className="text-red-700">
                  TaxCloud API keys are not configured in environment variables. 
                  Add TAXCLOUD_API_KEY and TAXCLOUD_API_LOGIN_ID to your .env.local file.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* TaxCloud Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>TaxCloud Configuration</CardTitle>
            <CardDescription>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-green-600">✓ Tax calculations are 100% FREE</span> through TaxCloud&apos;s API
                </p>
                <p className="text-sm">
                  Sign up at{' '}
                  <a href="https://taxcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    taxcloud.com
                  </a>
                  {' '}• No credit card required • Free API access for calculations
                </p>
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Note:</strong> TaxCloud offers optional paid tax filing services ($10-50/month), but you only need their FREE calculation API. 
                    File taxes yourself with your accountant.
                  </AlertDescription>
                </Alert>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>API Credentials Required</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <p className="font-semibold">Add to your .env.local file:</p>
                  <pre className="bg-muted p-2 rounded text-xs">
{`TAXCLOUD_API_KEY=your_api_key
TAXCLOUD_API_LOGIN_ID=your_login_id
TAXCLOUD_USPS_USER_ID=optional_usps_id`}
                  </pre>
                  <p className="text-xs mt-2">
                    Never store API keys in the database. Keep them in environment variables for security.
                  </p>
                  {hasApiKeys && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✓ API keys detected in environment
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Origin Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Origin Address
            </CardTitle>
            <CardDescription>
              Your business location for tax calculation (ship-from address)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="origin-address">Street Address</Label>
              <Input
                id="origin-address"
                type="text"
                value={settings.origin_address || ''}
                onChange={(e) => setSettings({ ...settings, origin_address: e.target.value })}
                placeholder="123 Business St"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="origin-city">City</Label>
                <Input
                  id="origin-city"
                  type="text"
                  value={settings.origin_city || ''}
                  onChange={(e) => setSettings({ ...settings, origin_city: e.target.value })}
                  placeholder="Los Angeles"
                  required
                />
              </div>
              <div>
                <Label htmlFor="origin-state">State</Label>
                <select
                  id="origin-state"
                  value={settings.origin_state || ''}
                  onChange={(e) => setSettings({ ...settings, origin_state: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="origin-zip">ZIP Code</Label>
                <Input
                  id="origin-zip"
                  type="text"
                  value={settings.origin_zip || ''}
                  onChange={(e) => setSettings({ ...settings, origin_zip: e.target.value })}
                  placeholder="90001"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tax Options
            </CardTitle>
            <CardDescription>
              Configure how tax is calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tax-shipping">Tax Shipping Charges</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Apply tax to shipping costs (varies by state law)
                </p>
              </div>
              <Switch
                id="tax-shipping"
                checked={settings.tax_shipping}
                onCheckedChange={(checked) => setSettings({ ...settings, tax_shipping: checked })}
              />
            </div>

            <Separator />

            <div>
              <Label>Tax Collection States</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Select states where you have nexus and should collect tax
              </p>
              
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAllStates}
                    onCheckedChange={handleSelectAllStates}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Select all states
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-3 border rounded-lg">
                {US_STATES.map(state => {
                  const isSelected = settings.tax_enabled_states === null || 
                    settings.tax_enabled_states?.includes(state.code)
                  const isSSTState = SST_STATES.includes(state.code)
                  
                  return (
                    <div key={state.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`state-${state.code}`}
                        checked={isSelected}
                        onCheckedChange={() => handleStateToggle(state.code)}
                      />
                      <label
                        htmlFor={`state-${state.code}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                      >
                        {state.name}
                        {isSSTState && (
                          <span className="text-xs text-green-600" title="Free in TaxCloud">
                            (SST)
                          </span>
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>
              
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Important:</strong> Only select states where you have nexus (physical presence or meet economic thresholds).</p>
                    <p className="text-xs">• <strong className="text-green-600">SST states marked (SST)</strong> = Free filing if you use TaxCloud&apos;s filing service</p>
                    <p className="text-xs">• <strong>All states</strong> = Free tax calculations via API</p>
                    <p className="text-xs">• You&apos;re only using the free calculation API, not their filing service</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={testConfiguration}
            disabled={testing || !settings.enabled || !hasApiKeys}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Configuration'
            )}
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}