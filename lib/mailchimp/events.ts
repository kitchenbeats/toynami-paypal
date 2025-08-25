/**
 * Mailchimp Event Triggers
 * 
 * These functions should be called from existing API routes
 * to sync data to Mailchimp in real-time. No cron jobs needed!
 */

import { mailchimpClient } from './client'
import { createClient } from '@/lib/supabase/server'

/**
 * Call this when a new user signs up
 * Add to: /api/auth/signup route
 */
export async function onUserSignup(user: {
  id: string
  email: string
  full_name?: string
  phone?: string
}) {
  try {
    // Check if Mailchimp is enabled
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('mailchimp_settings')
      .select('is_active, sync_customers')
      .single()
    
    if (!settings?.is_active || !settings.sync_customers) return

    // Sync to Mailchimp
    await mailchimpClient.syncCustomer({
      id: user.id,
      email: user.email,
      firstName: user.full_name?.split(' ')[0],
      lastName: user.full_name?.split(' ').slice(1).join(' '),
      phone: user.phone,
      tags: ['new_customer']
    })

    // Update sync status
    await supabase.from('mailchimp_sync_status').upsert({
      user_id: user.id,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Mailchimp signup sync error:', error)
    // Don't throw - we don't want to break signup if Mailchimp fails
  }
}

/**
 * Call this when an order is completed
 * Add to: /api/checkout/complete or /api/paypal/capture-order
 */
export async function onOrderCompleted(order: {
  id: string
  user_id: string
  email: string
  total_cents: number
  items: Array<{
    product_id: string
    name: string
    quantity: number
    price_cents: number
  }>
  cart_id?: string
}) {
  try {
    // Check if Mailchimp is enabled
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('mailchimp_settings')
      .select('is_active, sync_orders, store_id')
      .single()
    
    if (!settings?.is_active || !settings.sync_orders || !settings.store_id) return

    // Record order in Mailchimp
    await mailchimpClient.recordOrder({
      id: order.id,
      customerId: order.user_id,
      customerEmail: order.email,
      totalCents: order.total_cents,
      items: order.items.map((item, index) => ({
        id: `${order.id}_${index}`,
        productId: item.product_id.toString(),
        productName: item.name,
        quantity: item.quantity,
        priceCents: item.price_cents
      })),
      createdAt: new Date().toISOString()
    })

    // Delete cart if it exists (order completed)
    if (order.cart_id) {
      await mailchimpClient.deleteCart(order.cart_id)
    }

    // Tag customer as purchaser
    await mailchimpClient.updateCustomerTags(order.email, ['purchaser', 'active'])
  } catch (error) {
    console.error('Mailchimp order sync error:', error)
    // Don't throw - we don't want to break order completion
  }
}

/**
 * Call this when cart is updated (for abandoned cart tracking)
 * Add to: /api/cart/update
 */
export async function onCartUpdated(cart: {
  id: string
  user_id: string
  email: string
  total_cents: number
  items: Array<{
    product_id: string
    name: string
    quantity: number
    price_cents: number
  }>
  updated_at: string
}) {
  try {
    // Check if Mailchimp is enabled
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('mailchimp_settings')
      .select('is_active, sync_carts, store_id')
      .single()
    
    if (!settings?.is_active || !settings.sync_carts || !settings.store_id) return

    // Check if cart is abandoned (not updated for 30 minutes)
    const lastUpdate = new Date(cart.updated_at)
    const now = new Date()
    const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
    
    if (minutesSinceUpdate < 30) {
      // Cart is still active, just sync it
      await mailchimpClient.syncCart({
        id: cart.id,
        customerId: cart.user_id,
        customerEmail: cart.email,
        totalCents: cart.total_cents,
        items: cart.items.map((item, index) => ({
          id: `${cart.id}_${index}`,
          productId: item.product_id.toString(),
          productName: item.name,
          quantity: item.quantity,
          priceCents: item.price_cents
        }))
      })
    } else {
      // Cart is abandoned, tag the customer
      await mailchimpClient.updateCustomerTags(cart.email, ['abandoned_cart'])
    }
  } catch (error) {
    console.error('Mailchimp cart sync error:', error)
    // Don't throw - cart updates shouldn't fail
  }
}

/**
 * Call this when customer profile is updated
 * Add to: /api/profile/update
 */
export async function onCustomerUpdated(customer: {
  id: string
  email: string
  full_name?: string
  phone?: string
  shipping_address?: {
    address_line_1?: string
    address_line_2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
}) {
  try {
    // Check if Mailchimp is enabled
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('mailchimp_settings')
      .select('is_active, sync_customers')
      .single()
    
    if (!settings?.is_active || !settings.sync_customers) return

    // Sync updated customer data
    await mailchimpClient.syncCustomer({
      id: customer.id,
      email: customer.email,
      firstName: customer.full_name?.split(' ')[0],
      lastName: customer.full_name?.split(' ').slice(1).join(' '),
      phone: customer.phone,
      address: customer.shipping_address ? {
        address1: customer.shipping_address.address1,
        city: customer.shipping_address.city,
        province: customer.shipping_address.state,
        postal_code: customer.shipping_address.postal_code,
        country: customer.shipping_address.country || 'US'
      } : undefined
    })
  } catch (error) {
    console.error('Mailchimp customer update error:', error)
  }
}

/**
 * Call this when customer unsubscribes
 * Add to: /api/unsubscribe
 */
export async function onCustomerUnsubscribed(email: string) {
  try {
    // Check if Mailchimp is enabled
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('mailchimp_settings')
      .select('is_active')
      .single()
    
    if (!settings?.is_active) return

    // Tag as unsubscribed (don't remove from list)
    await mailchimpClient.updateCustomerTags(email, ['unsubscribed'], false)
    
    // Update local sync status
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (user) {
      await supabase
        .from('mailchimp_sync_status')
        .update({ 
          sync_status: 'unsubscribed',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
    }
  } catch (error) {
    console.error('Mailchimp unsubscribe error:', error)
  }
}