'use client'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

interface PayPalProviderProps {
  children: React.ReactNode
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  )
}