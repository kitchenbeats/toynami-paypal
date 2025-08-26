import { createClient } from '@/lib/supabase/server'
import { EmailService } from './service'

interface RaffleEmailData {
  raffleId: number
  userId: string
  entryNumber?: number
  winnerPosition?: number
  purchaseDeadline?: Date
}

interface RaffleDetails {
  name: string
  description?: string
  draw_date: string
  product: {
    name: string
    base_price_cents: number
  }
}

interface UserDetails {
  email: string
  full_name?: string
}

export class RaffleEmailService {
  private emailService: EmailService
  
  constructor() {
    this.emailService = new EmailService()
  }
  
  /**
   * Send entry confirmation email
   */
  async sendEntryConfirmation(data: RaffleEmailData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get raffle details
      const { data: raffle } = await supabase
        .from('raffles')
        .select(`
          name,
          description,
          draw_date,
          product:products!product_id (
            name,
            base_price_cents
          )
        `)
        .eq('id', data.raffleId)
        .single()
      
      if (!raffle) throw new Error('Raffle not found')
      
      // Get user details
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', data.userId)
        .single()
      
      if (!user) throw new Error('User not found')
      
      // Prepare email data
      const emailData = {
        to: user.email,
        subject: `Entry Confirmed - ${raffle.name}`,
        template: 'raffle_entry_confirmation',
        data: {
          customer_name: user.full_name || 'Valued Customer',
          raffle_name: raffle.name,
          product_name: raffle.product.name,
          entry_number: data.entryNumber?.toString() || 'N/A',
          draw_date: new Date(raffle.draw_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }),
          raffle_url: `${process.env.NEXT_PUBLIC_SITE_URL}/contests/raffles/${data.raffleId}`
        }
      }
      
      await this.emailService.sendEmail(emailData)
      
      // Log email sent
      await supabase
        .from('email_log')
        .insert({
          template: 'raffle_entry_confirmation',
          recipient: user.email,
          subject: emailData.subject,
          status: 'sent',
          user_id: data.userId
        })
    } catch (error) {
      console.error('Error sending entry confirmation:', error)
      throw error
    }
  }
  
  /**
   * Send winner notification email
   */
  async sendWinnerNotification(data: RaffleEmailData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get raffle details
      const { data: raffle } = await supabase
        .from('raffles')
        .select(`
          name,
          slug,
          product:products!product_id (
            name,
            base_price_cents
          )
        `)
        .eq('id', data.raffleId)
        .single()
      
      if (!raffle) throw new Error('Raffle not found')
      
      // Get user details
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', data.userId)
        .single()
      
      if (!user) throw new Error('User not found')
      
      const productPrice = (raffle.product.base_price_cents / 100).toFixed(2)
      const purchaseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/contests/raffles/${raffle.slug}/claim`
      
      // Prepare email data
      const emailData = {
        to: user.email,
        subject: `🎉 You Won! - ${raffle.name}`,
        template: 'raffle_winner',
        data: {
          customer_name: user.full_name || 'Winner',
          raffle_name: raffle.name,
          product_name: raffle.product.name,
          product_price: `$${productPrice}`,
          winner_position: data.winnerPosition?.toString() || '1',
          purchase_deadline: data.purchaseDeadline ? 
            data.purchaseDeadline.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }) : 'N/A',
          purchase_url: purchaseUrl,
          hours_to_purchase: '48'
        }
      }
      
      await this.emailService.sendEmail(emailData)
      
      // Update winner record with notification time
      await supabase
        .from('raffle_winners')
        .update({ notified_at: new Date().toISOString() })
        .eq('raffle_id', data.raffleId)
        .eq('user_id', data.userId)
      
      // Log email sent
      await supabase
        .from('email_log')
        .insert({
          template: 'raffle_winner',
          recipient: user.email,
          subject: emailData.subject,
          status: 'sent',
          user_id: data.userId
        })
    } catch (error) {
      console.error('Error sending winner notification:', error)
      throw error
    }
  }
  
  /**
   * Send purchase reminder email (24 hours before deadline)
   */
  async sendPurchaseReminder(data: RaffleEmailData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get raffle and winner details
      const { data: winner } = await supabase
        .from('raffle_winners')
        .select(`
          purchase_deadline,
          has_purchased,
          raffle:raffles!raffle_id (
            name,
            slug,
            product:products!product_id (
              name,
              base_price_cents
            )
          ),
          user:users!user_id (
            email,
            full_name
          )
        `)
        .eq('raffle_id', data.raffleId)
        .eq('user_id', data.userId)
        .single()
      
      if (!winner || winner.has_purchased) return
      
      const hoursRemaining = Math.floor(
        (new Date(winner.purchase_deadline).getTime() - Date.now()) / (1000 * 60 * 60)
      )
      
      // Only send if 24 hours or less remaining
      if (hoursRemaining > 24) return
      
      const purchaseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/contests/raffles/${winner.raffle.slug}/claim`
      const productPrice = (winner.raffle.product.base_price_cents / 100).toFixed(2)
      
      const emailData = {
        to: winner.user.email,
        subject: `⏰ ${hoursRemaining} Hours Left - Complete Your Purchase`,
        template: 'raffle_purchase_reminder',
        data: {
          customer_name: winner.user.full_name || 'Winner',
          raffle_name: winner.raffle.name,
          product_name: winner.raffle.product.name,
          product_price: `$${productPrice}`,
          hours_remaining: hoursRemaining.toString(),
          purchase_url: purchaseUrl
        }
      }
      
      await this.emailService.sendEmail(emailData)
      
      // Log email sent
      await supabase
        .from('email_log')
        .insert({
          template: 'raffle_purchase_reminder',
          recipient: winner.user.email,
          subject: emailData.subject,
          status: 'sent',
          user_id: data.userId
        })
    } catch (error) {
      console.error('Error sending purchase reminder:', error)
      throw error
    }
  }
  
  /**
   * Send notification when winner fails to purchase
   */
  async sendExpiredNotification(data: RaffleEmailData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get user and raffle details
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', data.userId)
        .single()
      
      const { data: raffle } = await supabase
        .from('raffles')
        .select('name, product:products!product_id (name)')
        .eq('id', data.raffleId)
        .single()
      
      if (!user || !raffle) return
      
      const emailData = {
        to: user.email,
        subject: `Purchase Window Expired - ${raffle.name}`,
        template: 'raffle_expired',
        data: {
          customer_name: user.full_name || 'Customer',
          raffle_name: raffle.name,
          product_name: raffle.product.name
        }
      }
      
      await this.emailService.sendEmail(emailData)
      
      // Log email sent
      await supabase
        .from('email_log')
        .insert({
          template: 'raffle_expired',
          recipient: user.email,
          subject: emailData.subject,
          status: 'sent',
          user_id: data.userId
        })
    } catch (error) {
      console.error('Error sending expired notification:', error)
    }
  }
  
  /**
   * Send notification to alternate winner
   */
  async sendAlternateWinnerNotification(data: RaffleEmailData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get raffle details
      const { data: raffle } = await supabase
        .from('raffles')
        .select(`
          name,
          slug,
          product:products!product_id (
            name,
            base_price_cents
          )
        `)
        .eq('id', data.raffleId)
        .single()
      
      if (!raffle) throw new Error('Raffle not found')
      
      // Get user details
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', data.userId)
        .single()
      
      if (!user) throw new Error('User not found')
      
      const productPrice = (raffle.product.base_price_cents / 100).toFixed(2)
      const purchaseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/contests/raffles/${raffle.slug}/claim`
      
      const emailData = {
        to: user.email,
        subject: `🎊 You're Now a Winner! - ${raffle.name}`,
        template: 'raffle_alternate_winner',
        data: {
          customer_name: user.full_name || 'Winner',
          raffle_name: raffle.name,
          product_name: raffle.product.name,
          product_price: `$${productPrice}`,
          purchase_deadline: data.purchaseDeadline ? 
            data.purchaseDeadline.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }) : 'N/A',
          purchase_url: purchaseUrl,
          hours_to_purchase: '48'
        }
      }
      
      await this.emailService.sendEmail(emailData)
      
      // Log email sent
      await supabase
        .from('email_log')
        .insert({
          template: 'raffle_alternate_winner',
          recipient: user.email,
          subject: emailData.subject,
          status: 'sent',
          user_id: data.userId
        })
    } catch (error) {
      console.error('Error sending alternate winner notification:', error)
      throw error
    }
  }
}