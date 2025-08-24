import mailchimp from '@mailchimp/mailchimp_marketing'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

interface MailchimpConfig {
  apiKey: string
  server: string
  listId: string
  storeId?: string
}

interface CustomerData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
  totalSpent?: number
  orderCount?: number
  address?: {
    address1?: string
    city?: string
    province?: string
    postal_code?: string
    country?: string
  }
}

interface OrderData {
  id: string
  customerId: string
  customerEmail: string
  totalCents: number
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    priceCents: number
  }>
  createdAt: string
  campaignId?: string
}

class MailchimpClient {
  private config: MailchimpConfig | null = null
  private initialized = false

  /**
   * Initialize the Mailchimp client with settings from database
   */
  async initialize(): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      // Get settings from database
      const { data: settings } = await supabase
        .from('mailchimp_settings')
        .select('*')
        .eq('is_active', true)
        .single()

      if (!settings || !settings.api_key || !settings.server_prefix || !settings.list_id) {
        console.log('Mailchimp not configured or inactive')
        return false
      }

      this.config = {
        apiKey: settings.api_key,
        server: settings.server_prefix,
        listId: settings.list_id,
        storeId: settings.store_id || 'toynami-store'
      }

      // Configure the Mailchimp client
      mailchimp.setConfig({
        apiKey: this.config.apiKey,
        server: this.config.server
      })

      this.initialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize Mailchimp:', error)
      return false
    }
  }

  /**
   * Get MD5 hash of email (required for Mailchimp API)
   */
  private getEmailHash(email: string): string {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
  }

  /**
   * Add or update a customer in Mailchimp
   */
  async syncCustomer(customer: CustomerData): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    try {
      const emailHash = this.getEmailHash(customer.email)
      
      // Add/update list member
      const memberData: any = {
        email_address: customer.email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: customer.firstName || '',
          LNAME: customer.lastName || '',
          PHONE: customer.phone || ''
        }
      }

      if (customer.tags && customer.tags.length > 0) {
        memberData.tags = customer.tags
      }

      // Update or create member
      await mailchimp.lists.setListMember(
        this.config!.listId,
        emailHash,
        memberData
      )

      // If we have e-commerce data, sync that too
      if (this.config!.storeId) {
        try {
          // Add/update customer in store
          const customerData: any = {
            id: customer.id,
            email_address: customer.email,
            opt_in_status: true,
            company: '',
            first_name: customer.firstName || '',
            last_name: customer.lastName || '',
            orders_count: customer.orderCount || 0,
            total_spent: customer.totalSpent || 0
          }

          if (customer.address) {
            customerData.address = {
              address1: customer.address.address1 || '',
              city: customer.address.city || '',
              province: customer.address.province || '',
              postal_code: customer.address.postal_code || '',
              country: customer.address.country || 'US'
            }
          }

          await mailchimp.ecommerce.addStoreCustomer(
            this.config!.storeId,
            customerData
          )
        } catch (ecomError: any) {
          // Try updating if add fails
          if (ecomError.status === 400) {
            await mailchimp.ecommerce.updateStoreCustomer(
              this.config!.storeId,
              customer.id,
              {
                email_address: customer.email,
                opt_in_status: true,
                first_name: customer.firstName || '',
                last_name: customer.lastName || ''
              }
            )
          }
        }
      }

      // Log success
      await this.logSync('customer_synced', 'customer', customer.id, true)

      return { success: true }
    } catch (error: any) {
      console.error('Mailchimp sync error:', error)
      await this.logSync('customer_synced', 'customer', customer.id, false, error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Record an order/purchase in Mailchimp
   */
  async recordOrder(order: OrderData): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    if (!this.config!.storeId) {
      return { success: false, error: 'E-commerce store not configured' }
    }

    try {
      // Prepare order lines
      const lines = order.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        product_variant_id: item.productId,
        quantity: item.quantity,
        price: item.priceCents / 100
      }))

      const orderData = {
        id: order.id,
        customer: {
          id: order.customerId,
          email_address: order.customerEmail
        },
        currency_code: 'USD',
        order_total: order.totalCents / 100,
        lines,
        campaign_id: order.campaignId,
        processed_at_foreign: order.createdAt,
        updated_at_foreign: order.createdAt
      }

      await mailchimp.ecommerce.addOrder(this.config!.storeId, orderData)

      await this.logSync('order_recorded', 'order', order.id, true)
      return { success: true }
    } catch (error: any) {
      console.error('Mailchimp order sync error:', error)
      await this.logSync('order_recorded', 'order', order.id, false, error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Add/update cart for abandoned cart tracking
   */
  async syncCart(cartData: {
    id: string
    customerId: string
    customerEmail: string
    totalCents: number
    items: Array<{
      id: string
      productId: string
      productName: string
      quantity: number
      priceCents: number
    }>
  }): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    if (!this.config!.storeId) {
      return { success: false, error: 'E-commerce store not configured' }
    }

    try {
      const lines = cartData.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        product_variant_id: item.productId,
        quantity: item.quantity,
        price: item.priceCents / 100
      }))

      const cart = {
        id: cartData.id,
        customer: {
          id: cartData.customerId,
          email_address: cartData.customerEmail
        },
        currency_code: 'USD',
        order_total: cartData.totalCents / 100,
        lines
      }

      // Try to update first, create if doesn't exist
      try {
        await mailchimp.ecommerce.updateCart(this.config!.storeId, cartData.id, cart)
      } catch (updateError: any) {
        if (updateError.status === 404) {
          await mailchimp.ecommerce.addCart(this.config!.storeId, cart)
        } else {
          throw updateError
        }
      }

      await this.logSync('cart_synced', 'cart', cartData.id, true)
      return { success: true }
    } catch (error: any) {
      console.error('Mailchimp cart sync error:', error)
      await this.logSync('cart_synced', 'cart', cartData.id, false, error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete cart (when order is completed)
   */
  async deleteCart(cartId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    if (!this.config!.storeId) {
      return { success: false, error: 'E-commerce store not configured' }
    }

    try {
      await mailchimp.ecommerce.deleteCart(this.config!.storeId, cartId)
      return { success: true }
    } catch (error: any) {
      // Ignore 404 errors (cart already deleted)
      if (error.status === 404) {
        return { success: true }
      }
      console.error('Mailchimp cart delete error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update customer tags
   */
  async updateCustomerTags(email: string, tags: string[], remove: boolean = false): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    try {
      const emailHash = this.getEmailHash(email)
      
      const tagData = tags.map(tag => ({
        name: tag,
        status: remove ? 'inactive' : 'active'
      }))

      await mailchimp.lists.updateListMemberTags(
        this.config!.listId,
        emailHash,
        { tags: tagData }
      )

      return { success: true }
    } catch (error: any) {
      console.error('Mailchimp tag update error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Batch sync multiple customers
   */
  async batchSyncCustomers(customers: CustomerData[]): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    try {
      const operations = customers.map(customer => ({
        method: 'PUT',
        path: `/lists/${this.config!.listId}/members/${this.getEmailHash(customer.email)}`,
        body: JSON.stringify({
          email_address: customer.email,
          status_if_new: 'subscribed',
          merge_fields: {
            FNAME: customer.firstName || '',
            LNAME: customer.lastName || ''
          }
        })
      }))

      const response = await mailchimp.batches.start({
        operations
      })

      await this.logSync('batch_customers_synced', 'batch', response.id, true)
      return { success: true }
    } catch (error: any) {
      console.error('Mailchimp batch sync error:', error)
      await this.logSync('batch_customers_synced', 'batch', '', false, error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Test connection to Mailchimp
   */
  async testConnection(): Promise<{ success: boolean; error?: string; data?: any }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) return { success: false, error: 'Mailchimp not configured' }
    }

    try {
      const response = await mailchimp.ping.get()
      
      // Also try to get list info
      const listInfo = await mailchimp.lists.getList(this.config!.listId)
      
      return { 
        success: true, 
        data: {
          health: response.health_status,
          listName: listInfo.name,
          memberCount: listInfo.stats.member_count
        }
      }
    } catch (error: any) {
      console.error('Mailchimp connection test failed:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Log sync events for debugging
   */
  private async logSync(
    eventType: string,
    entityType: string,
    entityId: string,
    success: boolean,
    error?: string
  ): Promise<void> {
    try {
      const supabase = await createClient()
      await supabase.from('mailchimp_sync_log').insert({
        event_type: eventType,
        entity_type: entityType,
        entity_id: entityId,
        success,
        error_message: error
      })
    } catch (logError) {
      console.error('Failed to log sync event:', logError)
    }
  }
}

// Export singleton instance
export const mailchimpClient = new MailchimpClient()

// Export types
export type { CustomerData, OrderData }