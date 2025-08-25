"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider,
  PayPalButtons,
  PayPalFieldsProvider, 
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalFields } from "@paypal/react-paypal-js";
import { useCart } from "@/lib/hooks/use-cart";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  Lock 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
// import { createClient } from "@/lib/supabase/client";
import { getImageSrc } from "@/lib/utils/image-utils";

// PayPal configuration - latest 2025 best practices
const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
  components: "buttons,card-fields,funding-eligibility",
  "enable-funding": "venmo,paylater",
  "disable-funding": "",
  "integration-date": "2025-01-11", // Today's date for latest features
  "buyer-country": "US",
  locale: "en_US",
  //fields styling
  dataAttributes: {
    "data-card-fields-style": JSON.stringify({
      input: {
        "font-size": "14px",
        "font-family": "system-ui, -apple-system, sans-serif",
        "padding": "12px",
        "color": "#111827",
        "background": "#ffffff",
        "border": "1px solid #d1d5db",
        "border-radius": "6px"
      },
      ":focus": {
        "border": "1px solid #4f46e5",
        "outline": "none"
      },
      ".invalid": {
        "border": "1px solid #ef4444",
        "color": "#ef4444"
      }
    })
  }
};

// Custom submit button component that uses the card fields
function FieldsSubmit({ isProcessing, disabled, total, billingName }: {
  isProcessing: boolean
  disabled: boolean
  total: number
  billingName: string
}) {
  const { cardFieldsForm } = usePayPalFields()
  
  const handleSubmit = async () => {
    if (!cardFieldsForm) return
    
    try {
      // Submit with the billing name from the shipping form
      await cardFieldsForm.submit({
        billingAddress: {
          firstName: billingName.split(' ')[0] || '',
          lastName: billingName.split(' ').slice(1).join(' ') || ''
        }
      })
    } catch (err) {
      console.error('submit error:', err)
    }
  }
  
  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isProcessing || disabled}
      className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
    >
      {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
    </button>
  )
}

export default function CheckoutForm({ user }) {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  
  // Multi-step state  
  const [currentStep, setCurrentStep] = useState(1)
  // const _totalSteps = 4 // Contact -> Shipping -> Rate -> Payment
  
  // Form states
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  // const [_sameAsBilling, setSameAsBilling] = useState(true)
  
  // Shipping states
  const [shippingRates, setShippingRates] = useState<unknown[]>([])
  const [selectedShippingRate, setSelectedShippingRate] = useState<string | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)
  
  // Tax states
  const [tax, setTax] = useState(0)
  const [loadingTax, setLoadingTax] = useState(false)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Calculations
  const subtotal = totalPrice / 100
  const selectedRate = shippingRates.find(rate => rate.id === selectedShippingRate)
  const shipping = selectedRate ? selectedRate.amount : 0
  const total = subtotal + shipping + tax

  // Fetch shipping rates
  const fetchShippingRates = useCallback(async (address) => {
    if (!address.zipCode || !address.city || !address.state) return
    
    setLoadingRates(true)
    
    try {
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            weight: item.weight
          })),
          shippingAddress: {
            name: `${address.firstName} ${address.lastName}`.trim() || 'Customer',
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country
          }
        })
      })

      const data = await response.json()

      if (data.success && data.rates) {
        setShippingRates(data.rates)
        if (data.rates.length > 0) {
          setSelectedShippingRate(data.rates[0].id)
        }
      }
    } catch (error) {
      console.error('Shipping error:', error)
    } finally {
      setLoadingRates(false)
    }
  }, [items])

  // Fetch tax calculation
  const calculateTax = useCallback(async (address, shippingCost) => {
    if (!address.zipCode || !address.city || !address.state) return
    
    setLoadingTax(true)
    
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.productId,
            name: item.productName,
            price: item.price / 100,
            quantity: item.quantity
          })),
          shippingAddress: {
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country || 'US'
          },
          shippingAmount: shippingCost
        })
      })

      const data = await response.json()
      if (data.totalTax !== undefined) {
        setTax(data.totalTax)
      }
    } catch (error) {
      console.error('Tax calculation error:', error)
      setTax(0)
    } finally {
      setLoadingTax(false)
    }
  }, [items])

  // Effects for shipping and tax
  useEffect(() => {
    // Start fetching rates as soon as we have a complete address
    if (shippingAddress.firstName && shippingAddress.lastName && 
        shippingAddress.address && shippingAddress.city && 
        shippingAddress.state && shippingAddress.zipCode) {
      const timeoutId = setTimeout(() => {
        fetchShippingRates(shippingAddress)
      }, 500) // Reduced delay for faster feedback
      return () => clearTimeout(timeoutId)
    }
  }, [shippingAddress, fetchShippingRates])

  useEffect(() => {
    // Calculate tax when we have a complete address AND shipping rate selected
    // Since we auto-select the first rate, this should trigger automatically
    if (shippingAddress.firstName && shippingAddress.lastName && 
        shippingAddress.address && shippingAddress.city && 
        shippingAddress.state && shippingAddress.zipCode && selectedShippingRate && shipping >= 0) {
      const timeoutId = setTimeout(() => {
        calculateTax(shippingAddress, shipping)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [shippingAddress, shipping, selectedShippingRate, calculateTax])

  // PayPal handlers
  const createOrder = useCallback(async () => {
    if (!selectedRate) {
      toast.error('Please select a shipping option')
      throw new Error('No shipping selected')
    }

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping,
          tax,
          total,
          shippingAddress
        })
      })

      const data = await response.json()
      if (data.id) return data.id
      throw new Error('Failed to create order')
    } catch (error) {
      toast.error('Failed to create order')
      throw error
    }
  }, [items, shipping, tax, total, selectedRate, shippingAddress])

  const onApprove = useCallback(async (data) => {
    setIsProcessing(true)
    
    try {
      const selectedRateData = shippingRates.find(rate => rate.id === selectedShippingRate)
      
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID,
          userId: user?.id,
          items,
          billing: { ...shippingAddress, email },
          shippingAddress,
          shippingRate: selectedRateData
        })
      })

      const captureData = await response.json()
      
      if (captureData.error) {
        throw new Error(captureData.error)
      }

      clearCart()
      toast.success('Payment successful!')
      
      setTimeout(() => {
        router.push(`/order-confirmation/${captureData.orderId}`)
      }, 1500)
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [items, user, email, shippingAddress, clearCart, router, shippingRates, selectedShippingRate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-600">Add some items to your cart to checkout</p>
          <Link href="/products" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="mx-auto w-full max-w-lg">
            <h2 className="sr-only">Order summary</h2>

            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex space-x-6 py-6">
                    {item.image ? (
                      <Image
                        src={getImageSrc(item.image)}
                        alt={item.productName}
                        width={96}
                        height={96}
                        className="size-24 flex-none rounded-md bg-gray-100 object-cover"
                      />
                    ) : (
                      <div className="size-24 flex-none rounded-md bg-gray-100" />
                    )}
                    <div className="flex-auto">
                      <div className="space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6">
                        <div className="flex-auto space-y-1 text-sm font-medium">
                          <h3 className="text-gray-900">
                            {item.productName}
                          </h3>
                          <p className="text-gray-900">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                          <p className="hidden text-gray-500 sm:block">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="flex flex-none space-x-4">
                          <Link
                            href="/cart"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-gray-900">{shipping > 0 ? `$${shipping.toFixed(2)}` : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-gray-900">{loadingTax ? '...' : `$${tax.toFixed(2)}`}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  shape: 'rect',
                  height: 40,
                  tagline: false
                }}
                fundingSource="paypal"
                createOrder={async () => {
                  // For express checkout, create order with estimated shipping
                  try {
                    const response = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        items,
                        shipping: 10, // Estimated shipping
                        tax: 0,
                        total: subtotal + 10,
                        expressCheckout: true
                      })
                    })

                    const data = await response.json()
                    if (data.id) return data.id
                    throw new Error('Failed to create order')
                  } catch (error) {
                      console.error('Failed to create:', error)
                    toast.error('Failed to create order')
                    throw error
                  }
                }}
                onApprove={async (data, actions) => {
                  // Get shipping address from PayPal and show shipping selection
                  try {
                    const orderDetails = await actions.order.get()
                    const paypalShipping = orderDetails.purchase_units[0].shipping
                    
                    if (paypalShipping?.address) {
                      // Update our shipping address with PayPal data
                      const newAddress = {
                        firstName: paypalShipping.name?.full_name?.split(' ')[0] || '',
                        lastName: paypalShipping.name?.full_name?.split(' ').slice(1).join(' ') || '',
                        company: '',
                        address: paypalShipping.address.address_line_1 || '',
                        apartment: paypalShipping.address.address_line_2 || '',
                        city: paypalShipping.address.admin_area_2 || '',
                        state: paypalShipping.address.admin_area_1 || '',
                        zipCode: paypalShipping.address.postal_code || '',
                        country: paypalShipping.address.country_code || 'US'
                      }
                      
                      setShippingAddress(newAddress)
                      setEmail(orderDetails.payer?.email_address || '')
                      
                      // Jump to rate selection step
                      setCurrentStep(3)
                      toast.info('Please select your shipping method to complete checkout')
                      return
                    }
                  } catch (error) {
                      console.error('Failed to create:', error)
                    console.error('Express checkout error:', error)
                    toast.error('Something went wrong. Please try again.')
                  }
                }}
                onError={(err) => {
                  console.error('PayPal error:', err)
                  toast.error('Payment failed. Please try again.')
                }}
              />
              
              <div className="mt-4">
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    shape: 'rect',
                    height: 40,
                    tagline: false
                  }}
                  fundingSource="venmo"
                  createOrder={async () => {
                    // For express checkout, create order with estimated shipping
                    try {
                      const response = await fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          items,
                          shipping: 10, // Estimated shipping
                          tax: 0,
                          total: subtotal + 10,
                          expressCheckout: true
                        })
                      })

                      const data = await response.json()
                      if (data.id) return data.id
                      throw new Error('Failed to create order')
                    } catch (error) {
                        console.error('Failed to create:', error)
                      toast.error('Failed to create order')
                      throw error
                    }
                  }}
                  onApprove={async (data, actions) => {
                    // Get shipping address from PayPal and show shipping selection
                    try {
                      const orderDetails = await actions.order.get()
                      const paypalShipping = orderDetails.purchase_units[0].shipping
                      
                      if (paypalShipping?.address) {
                        // Update our shipping address with PayPal data
                        const newAddress = {
                          firstName: paypalShipping.name?.full_name?.split(' ')[0] || '',
                          lastName: paypalShipping.name?.full_name?.split(' ').slice(1).join(' ') || '',
                          company: '',
                          address: paypalShipping.address.address_line_1 || '',
                          apartment: paypalShipping.address.address_line_2 || '',
                          city: paypalShipping.address.admin_area_2 || '',
                          state: paypalShipping.address.admin_area_1 || '',
                          zipCode: paypalShipping.address.postal_code || '',
                          country: paypalShipping.address.country_code || 'US'
                        }
                        
                        setShippingAddress(newAddress)
                        setEmail(orderDetails.payer?.email_address || '')
                        
                        // Jump to rate selection step
                        setCurrentStep(3)
                        toast.info('Please select your shipping method to complete checkout')
                        return
                      }
                    } catch (error) {
                        console.error('Failed to create:', error)
                      console.error('Express checkout error:', error)
                      toast.error('Something went wrong. Please try again.')
                    }
                  }}
                  onError={(err) => {
                    console.error('Venmo error:', err)
                    toast.error('Payment failed. Please try again.')
                  }}
                />
              </div>
            </PayPalScriptProvider>

            <div className="relative mt-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-medium text-gray-500">
                  or
                </span>
              </div>
            </div>

            <form className="mt-6">
              {/* Step 1: Contact information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Contact information
                  </h2>

                  <div className="mt-6">
                    <label
                      htmlFor="email-address"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email-address"
                        name="email-address"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="phone"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!email}
                    className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Shipping address */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping address
                  </h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                      <div className="sm:col-span-3 grid grid-cols-2 gap-x-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-700">
                            First name
                          </label>
                          <div className="mt-2">
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              value={shippingAddress.firstName}
                              onChange={handleChange}
                              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-700">
                            Last name
                          </label>
                          <div className="mt-2">
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                              value={shippingAddress.lastName}
                              onChange={handleChange}
                              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="company" className="block text-sm/6 font-medium text-gray-700">
                          Company (optional)
                        </label>
                        <div className="mt-2">
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={shippingAddress.company}
                            onChange={handleChange}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="address" className="block text-sm/6 font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-2">
                          <input
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="street-address"
                            value={shippingAddress.address}
                            onChange={handleChange}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="apartment" className="block text-sm/6 font-medium text-gray-700">
                          Apartment, suite, etc. (optional)
                        </label>
                        <div className="mt-2">
                          <input
                            id="apartment"
                            name="apartment"
                            type="text"
                            value={shippingAddress.apartment}
                            onChange={handleChange}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="address-level2"
                            value={shippingAddress.city}
                            onChange={handleChange}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm/6 font-medium text-gray-700">
                          State
                        </label>
                        <div className="mt-2">
                          <input
                            id="state"
                            name="state"
                            type="text"
                            autoComplete="address-level1"
                            value={shippingAddress.state}
                            onChange={handleChange}
                            maxLength={2}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm/6 font-medium text-gray-700">
                          ZIP code
                        </label>
                        <div className="mt-2">
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            autoComplete="postal-code"
                            value={shippingAddress.zipCode}
                            onChange={handleChange}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode}
                      className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Select Shipping Rate */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Select shipping rate
                  </h2>

                  <div className="mt-6">
                    {loadingRates ? (
                      <p className="text-sm text-gray-500">Calculating shipping rates...</p>
                    ) : shippingRates.length > 0 ? (
                      <div className="isolate -space-y-px rounded-lg shadow-sm">
                        {shippingRates.map((rate, index) => (
                          <button
                            key={rate.id}
                            type="button"
                            onClick={() => setSelectedShippingRate(rate.id)}
                            className={`
                              relative flex items-center justify-between w-full px-4 py-3 text-sm font-medium
                              ${index === 0 ? 'rounded-t-lg' : ''}
                              ${index === shippingRates.length - 1 ? 'rounded-b-lg' : ''}
                              ${selectedShippingRate === rate.id 
                                ? 'z-10 border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }
                              border focus:z-10 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600
                            `}
                          >
                            <div className="flex items-center">
                              <div className={`
                                flex h-5 w-5 items-center justify-center rounded-full border
                                ${selectedShippingRate === rate.id 
                                  ? 'border-indigo-600' 
                                  : 'border-gray-300'
                                }
                              `}>
                                {selectedShippingRate === rate.id && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                )}
                              </div>
                              <div className="ml-3 text-left">
                                <span className={`block ${selectedShippingRate === rate.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  {rate.service}
                                </span>
                                <span className={`block text-xs ${selectedShippingRate === rate.id ? 'text-indigo-700' : 'text-gray-500'}`}>
                                  {rate.deliveryDays ? `${rate.deliveryDays} business days` : 'Standard delivery'}
                                </span>
                              </div>
                            </div>
                            <span className={`ml-4 flex-shrink-0 font-semibold ${selectedShippingRate === rate.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                              ${rate.amount.toFixed(2)}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Getting shipping options...</p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      disabled={!selectedShippingRate}
                      className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment
                  </h2>

                  <div className="mt-6">
                    <PayPalScriptProvider options={paypalOptions}>
                      <PayPalFieldsProvider
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                          console.error('payment error:', err)
                          toast.error('Payment failed. Please try again.')
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">number
                            </label>
                            <PayPalNumberField />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiration date
                              </label>
                              <PayPalExpiryField />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Security code
                              </label>
                              <PayPalCVVField />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Lock className="h-4 w-4" />
                            <span>Secure payment processing</span>
                          </div>
                          <div className="flex gap-2 opacity-50">
                            <CreditCard className="h-6 w-9 text-gray-600" />
                            <span className="text-xs text-gray-500">Visa, MC, Amex</span>
                          </div>
                        </div>
                        
                        <FieldsSubmit isProcessing={isProcessing}
                          disabled={!selectedShippingRate}
                          total={total}
                          billingName={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                        />
                      </PayPalFieldsProvider>
                    </PayPalScriptProvider>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="mt-6 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                  >
                    Back to Shipping Options
                  </button>
                </div>
              )}
            </form>

            <div className="mt-10 divide-y divide-gray-200 border-t border-b border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`w-full py-6 text-left text-lg font-medium transition-colors hover:text-indigo-600 cursor-pointer ${currentStep === 1 ? 'text-indigo-600' : currentStep > 1 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Contact information
              </button>
              <button
                type="button"
                onClick={() => email && setCurrentStep(2)}
                disabled={!email}
                className={`w-full py-6 text-left text-lg font-medium transition-colors ${email ? 'hover:text-indigo-600 cursor-pointer' : 'cursor-not-allowed'} ${currentStep === 2 ? 'text-indigo-600' : currentStep > 2 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Shipping address
              </button>
              <button
                type="button"
                onClick={() => {
                  if (shippingAddress.firstName && shippingAddress.lastName && shippingAddress.address && shippingAddress.city && shippingAddress.state && shippingAddress.zipCode) {
                    setCurrentStep(3)
                  }
                }}
                disabled={!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode}
                className={`w-full py-6 text-left text-lg font-medium transition-colors ${shippingAddress.firstName && shippingAddress.lastName && shippingAddress.address && shippingAddress.city && shippingAddress.state && shippingAddress.zipCode ? 'hover:text-indigo-600 cursor-pointer' : 'cursor-not-allowed'} ${currentStep === 3 ? 'text-indigo-600' : currentStep > 3 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Shipping rate
              </button>
              <button
                type="button"
                onClick={() => selectedShippingRate && setCurrentStep(4)}
                disabled={!selectedShippingRate}
                className={`w-full py-6 text-left text-lg font-medium transition-colors ${selectedShippingRate ? 'hover:text-indigo-600 cursor-pointer' : 'cursor-not-allowed'} ${currentStep === 4 ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
