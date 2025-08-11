import { Client, Environment } from '@paypal/paypal-server-sdk'

let paypalClient: Client | null = null

export function getPayPalClient(): Client {
  if (!paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured')
    }
    
    paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret
      },
      environment: process.env.PAYPAL_SANDBOX === 'true' 
        ? Environment.Sandbox 
        : Environment.Production,
      logging: {
        logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
        logRequest: { logBody: true },
        logResponse: { logHeaders: true }
      }
    })
  }
  
  return paypalClient
}