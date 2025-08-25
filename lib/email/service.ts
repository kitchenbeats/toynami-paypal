/**
 * Unified Email Service
 * Handles both marketing (via Mailchimp Marketing) and transactional emails (via Mailchimp Transactional)
 * Using latest Mailchimp Transactional API (v1.0.59)
 */

import { mailchimpClient } from '@/lib/mailchimp/client'
import { createClient } from '@/lib/supabase/server'

// Mailchimp Transactional types
interface MailchimpMessage {
  html?: string
  text?: string
  subject: string
  from_email: string
  from_name: string
  to: Array<{
    email: string
    name?: string
    type: 'to' | 'cc' | 'bcc'
  }>
  headers?: Record<string, string>
  important?: boolean
  track_opens?: boolean
  track_clicks?: boolean
  auto_text?: boolean
  auto_html?: boolean
  inline_css?: boolean
  url_strip_qs?: boolean
  preserve_recipients?: boolean
  view_content_link?: boolean
  tracking_domain?: string
  signing_domain?: string
  return_path_domain?: string
  merge?: boolean
  merge_language?: 'mailchimp' | 'handlebars'
  global_merge_vars?: Array<{
    name: string
    content: string
  }>
  merge_vars?: Array<{
    rcpt: string
    vars: Array<{
      name: string
      content: string
    }>
  }>
  tags?: string[]
  subaccount?: string
  google_analytics_domains?: string[]
  google_analytics_campaign?: string
  metadata?: Record<string, any>
  recipient_metadata?: Array<{
    rcpt: string
    values: Record<string, any>
  }>
  attachments?: Array<{
    type: string
    name: string
    content: string
  }>
  images?: Array<{
    type: string
    name: string
    content: string
  }>
}

interface MailchimpResponse {
  email: string
  status: 'sent' | 'queued' | 'rejected' | 'invalid'
  reject_reason?: string
  _id: string
  queued_reason?: string
}

// Types for email templates
export type EmailTemplate = 
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'password_reset'
  | 'welcome'
  | 'abandoned_cart'
  | 'back_in_stock'
  | 'price_drop'
  | 'review_request'

interface EmailData {
  to: string
  subject?: string
  template: EmailTemplate
  data: Record<string, any>
  tags?: string[]
  metadata?: Record<string, any>
}

interface TransactionalConfig {
  apiKey: string
  fromEmail: string
  fromName: string
  replyTo?: string
}

class EmailService {
  private transactionalConfig: TransactionalConfig | null = null
  private initialized = false
  private mandrillClient: any = null

  /**
   * Initialize the email service with Mailchimp Transactional (Mandrill)
   */
  async initialize(): Promise<boolean> {
    try {
      const supabase = await createClient()
      
      // Get transactional email settings
      const { data: settings } = await supabase
        .from('email_settings')
        .select('*')
        .eq('provider', 'mailchimp_transactional')
        .eq('is_active', true)
        .single()

      if (!settings) {
        console.log('Mailchimp Transactional not configured')
        return false
      }

      this.transactionalConfig = {
        apiKey: settings.api_key,
        fromEmail: settings.from_email || 'noreply@toynamishop.com',
        fromName: settings.from_name || 'Toynami',
        replyTo: settings.reply_to
      }

      // Initialize Mailchimp Transactional client (latest pattern)
      this.mandrillClient = require('@mailchimp/mailchimp_transactional')(this.transactionalConfig.apiKey)

      this.initialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      return false
    }
  }

  /**
   * Send a transactional email using a database template
   */
  async sendTransactionalEmail(emailData: EmailData): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) {
        return { success: false, error: 'Email service not configured' }
      }
    }

    try {
      // Get template content
      const template = await this.getTemplate(emailData.template)
      if (!template) {
        return { success: false, error: 'Template not found' }
      }

      // Merge template with data
      const html = await this.renderTemplate(template.html, emailData.data)
      const text = template.text ? await this.renderTemplate(template.text, emailData.data) : undefined

      // Prepare message with proper typing
      const message: MailchimpMessage = {
        html,
        text,
        subject: emailData.subject || template.subject,
        from_email: this.transactionalConfig!.fromEmail,
        from_name: this.transactionalConfig!.fromName,
        to: [{
          email: emailData.to,
          type: 'to'
        }],
        headers: {
          'Reply-To': this.transactionalConfig!.replyTo || this.transactionalConfig!.fromEmail
        },
        important: emailData.template === 'password_reset',
        track_opens: true,
        track_clicks: true,
        auto_text: !text,
        auto_html: false,
        inline_css: true,
        preserve_recipients: false,
        view_content_link: false,
        tags: emailData.tags || [emailData.template],
        metadata: emailData.metadata || {},
        merge_language: 'handlebars' // Use Handlebars for template merging
      }

      // Send via Mailchimp Transactional
      const response = await this.mandrillClient.messages.send({ 
        message,
        async: false, // Send immediately, not queued
        ip_pool: 'Main Pool' // Use default IP pool
      })

      if (response && response[0] && (response[0].status === 'sent' || response[0].status === 'queued')) {
        // Log success
        await this.logEmail({
          template: emailData.template,
          recipient: emailData.to,
          status: 'sent',
          message_id: response[0]._id,
          provider_response: response[0]
        })

        return { 
          success: true, 
          messageId: response[0]._id 
        }
      } else {
        throw new Error(response[0]?.reject_reason || 'Failed to send')
      }
    } catch (error) {
      console.error('Failed to send transactional email:', error)
      
      // Log failure
      await this.logEmail({
        template: emailData.template,
        recipient: emailData.to,
        status: 'failed',
        error: (error as Error).message
      })

      return { 
        success: false, 
        error: (error as Error).message 
      }
    }
  }

  /**
   * Send email using Mailchimp template (stored in Mailchimp)
   */
  async sendWithMailchimpTemplate(data: {
    to: string
    templateName: string
    templateContent?: Array<{ name: string; content: string }>
    mergeVars?: Array<{ name: string; content: string }>
    subject?: string
    tags?: string[]
  }): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) {
        return { success: false, error: 'Email service not configured' }
      }
    }

    try {
      const response = await this.mandrillClient.messages.sendTemplate({
        template_name: data.templateName,
        template_content: data.templateContent || [],
        message: {
          subject: data.subject,
          from_email: this.transactionalConfig!.fromEmail,
          from_name: this.transactionalConfig!.fromName,
          to: [{
            email: data.to,
            type: 'to'
          }],
          headers: {
            'Reply-To': this.transactionalConfig!.replyTo || this.transactionalConfig!.fromEmail
          },
          global_merge_vars: data.mergeVars,
          merge: true,
          merge_language: 'handlebars',
          track_opens: true,
          track_clicks: true,
          tags: data.tags || ['mailchimp_template']
        },
        async: false
      })

      if (response && response[0] && (response[0].status === 'sent' || response[0].status === 'queued')) {
        return { 
          success: true, 
          messageId: response[0]._id 
        }
      } else {
        throw new Error(response[0]?.reject_reason || 'Failed to send')
      }
    } catch (error) {
      console.error('Failed to send email with Mailchimp template:', error)
      return { 
        success: false, 
        error: (error as Error).message 
      }
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order: {
    id: string
    email: string
    customerName: string
    items: Array<{
      name: string
      quantity: number
      price: number
      image?: string
    }>
    subtotal: number
    shipping: number
    tax: number
    total: number
    shippingAddress: {
      line1: string
      line2?: string
      city: string
      state: string
      postal: string
      country: string
    }
    estimatedDelivery?: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendTransactionalEmail({
      to: order.email,
      template: 'order_confirmation',
      subject: `Order Confirmation #${order.id}`,
      data: {
        order_id: order.id,
        customer_name: order.customerName,
        items: order.items,
        subtotal: this.formatCurrency(order.subtotal),
        shipping: this.formatCurrency(order.shipping),
        tax: this.formatCurrency(order.tax),
        total: this.formatCurrency(order.total),
        shipping_address: this.formatAddress(order.shippingAddress),
        estimated_delivery: order.estimatedDelivery || 'Within 5-7 business days',
        order_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}`
      },
      tags: ['order_confirmation', 'transactional']
    })
  }

  /**
   * Send shipping notification
   */
  async sendShippingNotification(shipment: {
    orderId: string
    email: string
    customerName: string
    trackingNumber: string
    carrier: string
    trackingUrl: string
    items: Array<{
      name: string
      quantity: number
    }>
    estimatedDelivery?: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendTransactionalEmail({
      to: shipment.email,
      template: 'order_shipped',
      subject: `Your Order #${shipment.orderId} Has Shipped!`,
      data: {
        order_id: shipment.orderId,
        customer_name: shipment.customerName,
        tracking_number: shipment.trackingNumber,
        carrier: shipment.carrier,
        tracking_url: shipment.trackingUrl,
        items: shipment.items,
        estimated_delivery: shipment.estimatedDelivery || 'Track your package for updates',
        order_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${shipment.orderId}`
      },
      tags: ['order_shipped', 'transactional']
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(data: {
    email: string
    name: string
    resetUrl: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendTransactionalEmail({
      to: data.email,
      template: 'password_reset',
      subject: 'Reset Your Password',
      data: {
        customer_name: data.name,
        reset_url: data.resetUrl,
        expires_in: '1 hour'
      },
      tags: ['password_reset', 'transactional', 'security']
    })
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user: {
    email: string
    name: string
    discountCode?: string
  }): Promise<{ success: boolean; error?: string }> {
    // Also sync to marketing list
    await mailchimpClient.syncCustomer({
      id: user.email, // Use email as ID for now
      email: user.email,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      tags: ['new_customer', 'welcome_sent']
    })

    return this.sendTransactionalEmail({
      to: user.email,
      template: 'welcome',
      subject: 'Welcome to Toynami!',
      data: {
        customer_name: user.name,
        discount_code: user.discountCode || 'WELCOME10',
        shop_url: process.env.NEXT_PUBLIC_SITE_URL,
        account_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
      },
      tags: ['welcome', 'transactional', 'onboarding']
    })
  }

  /**
   * Send abandoned cart reminder
   */
  async sendAbandonedCartReminder(cart: {
    email: string
    customerName: string
    items: Array<{
      name: string
      price: number
      quantity: number
      image?: string
    }>
    total: number
    cartUrl: string
    discountCode?: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendTransactionalEmail({
      to: cart.email,
      template: 'abandoned_cart',
      subject: `${cart.customerName}, you left something behind!`,
      data: {
        customer_name: cart.customerName,
        items: cart.items,
        total: this.formatCurrency(cart.total),
        cart_url: cart.cartUrl,
        discount_code: cart.discountCode,
        discount_amount: cart.discountCode ? '10%' : undefined
      },
      tags: ['abandoned_cart', 'marketing', 'recovery']
    })
  }

  /**
   * Get email template from database
   */
  private async getTemplate(templateName: EmailTemplate): Promise<{ html: string; text?: string; subject: string } | null> {
    try {
      const supabase = await createClient()
      const { data: template } = await supabase
        .from('email_templates')
        .select('html_content, text_content, subject')
        .eq('name', templateName)
        .eq('is_active', true)
        .single()

      if (!template) {
        // Return default template
        return this.getDefaultTemplate(templateName)
      }

      return {
        html: template.html_content,
        text: template.text_content,
        subject: template.subject
      }
    } catch (error) {
      console.error('Failed to get template:', error)
      return this.getDefaultTemplate(templateName)
    }
  }

  /**
   * Get default template (fallback)
   */
  private getDefaultTemplate(templateName: EmailTemplate): { html: string; text?: string; subject: string } {
    // This would contain default templates for each type
    // For brevity, showing just order confirmation
    const templates: Record<EmailTemplate, { html: string; subject: string }> = {
      order_confirmation: {
        subject: 'Order Confirmation #{{order_id}}',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .order-items { background: white; padding: 15px; margin: 20px 0; }
              .item { border-bottom: 1px solid #eee; padding: 10px 0; }
              .total { font-size: 18px; font-weight: bold; text-align: right; padding-top: 10px; }
              .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Order!</h1>
              </div>
              <div class="content">
                <p>Hi {{customer_name}},</p>
                <p>We've received your order and it's being processed. Your order details are below:</p>
                
                <div class="order-items">
                  <h3>Order #{{order_id}}</h3>
                  {{#items}}
                  <div class="item">
                    <strong>{{name}}</strong><br>
                    Quantity: {{quantity}} - Price: ${{price}}
                  </div>
                  {{/items}}
                  
                  <div class="total">
                    <p>Subtotal: {{subtotal}}</p>
                    <p>Shipping: {{shipping}}</p>
                    <p>Tax: {{tax}}</p>
                    <p><strong>Total: {{total}}</strong></p>
                  </div>
                </div>
                
                <h3>Shipping Address</h3>
                <p>{{shipping_address}}</p>
                
                <h3>Estimated Delivery</h3>
                <p>{{estimated_delivery}}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{order_url}}" class="button">View Order</a>
                </div>
              </div>
              <div class="footer">
                <p>Thank you for shopping with Toynami!</p>
                <p>© 2024 Toynami. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      },
      // Add other templates here...
      order_shipped: { subject: '', html: '' },
      order_delivered: { subject: '', html: '' },
      order_cancelled: { subject: '', html: '' },
      password_reset: { subject: '', html: '' },
      welcome: { subject: '', html: '' },
      abandoned_cart: { subject: '', html: '' },
      back_in_stock: { subject: '', html: '' },
      price_drop: { subject: '', html: '' },
      review_request: { subject: '', html: '' }
    }

    return {
      ...templates[templateName],
      text: undefined
    }
  }

  /**
   * Render template with data (simple mustache-style replacement)
   */
  private async renderTemplate(template: string, data: Record<string, any>): Promise<string> {
    let rendered = template

    // Simple variable replacement
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      rendered = rendered.replace(regex, data[key])
    })

    // Handle arrays (simple loop)
    const arrayMatches = rendered.match(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g)
    if (arrayMatches) {
      arrayMatches.forEach(match => {
        const arrayName = match.match(/{{#(\w+)}}/)?.[1]
        if (arrayName && Array.isArray(data[arrayName])) {
          const itemTemplate = match.replace(/{{#\w+}}|{{\/\w+}}/g, '')
          const items = data[arrayName].map((item: any) => {
            let itemHtml = itemTemplate
            Object.keys(item).forEach(key => {
              itemHtml = itemHtml.replace(new RegExp(`{{${key}}}`, 'g'), item[key])
            })
            return itemHtml
          }).join('')
          rendered = rendered.replace(match, items)
        }
      })
    }

    return rendered
  }

  /**
   * Format currency
   */
  private formatCurrency(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`
  }

  /**
   * Format address
   */
  private formatAddress(address: {
    line1: string
    line2?: string
    city: string
    state: string
    postal: string
    country: string
  }): string {
    const lines = [
      address.line1,
      address.line2,
      `${address.city}, ${address.state} ${address.postal}`,
      address.country
    ].filter(Boolean)
    
    return lines.join('<br>')
  }

  /**
   * Log email event
   */
  private async logEmail(data: {
    template: EmailTemplate
    recipient: string
    status: 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked'
    message_id?: string
    error?: string
    provider_response?: any
  }): Promise<void> {
    try {
      const supabase = await createClient()
      await supabase.from('email_log').insert({
        template: data.template,
        recipient: data.recipient,
        status: data.status,
        message_id: data.message_id,
        error_message: data.error,
        provider_response: data.provider_response,
        sent_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to log email:', error)
    }
  }

  /**
   * Handle webhook from Mailchimp Transactional
   */
  async handleWebhook(events: Array<{
    event: string
    msg: {
      _id: string
      email: string
      state: string
      bounce_description?: string
    }
  }>): Promise<void> {
    for (const event of events) {
      const status = this.mapWebhookEventToStatus(event.event)
      if (status) {
        await this.logEmail({
          template: 'unknown' as EmailTemplate,
          recipient: event.msg.email,
          status,
          message_id: event.msg._id,
          error: event.msg.bounce_description
        })
      }
    }
  }

  /**
   * Map webhook event to status
   */
  private mapWebhookEventToStatus(event: string): 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked' | null {
    const mapping: Record<string, 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked'> = {
      'send': 'sent',
      'hard_bounce': 'bounced',
      'soft_bounce': 'bounced',
      'open': 'opened',
      'click': 'clicked',
      'reject': 'failed'
    }
    return mapping[event] || null
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export types
export type { EmailData, EmailTemplate }