import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mailchimpClient } from '@/lib/mailchimp/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // Check admin auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all customers
    const { data: customers, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', false)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({ success: true, count: 0 })
    }

    // Prepare customer data for Mailchimp
    const customerData = customers.map(customer => ({
      id: customer.id,
      email: customer.email,
      firstName: customer.full_name?.split(' ')[0],
      lastName: customer.full_name?.split(' ').slice(1).join(' '),
      phone: customer.phone,
      tags: customer.customer_group_id ? [`group_${customer.customer_group_id}`] : [],
      address: customer.shipping_address ? {
        address1: customer.shipping_address.address1,
        city: customer.shipping_address.city,
        province: customer.shipping_address.state,
        postal_code: customer.shipping_address.postal_code,
        country: customer.shipping_address.country || 'US'
      } : undefined
    }))

    // Batch sync to Mailchimp
    const result = await mailchimpClient.batchSyncCustomers(customerData)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Update sync status in database
    const syncUpdates = customers.map(customer => ({
      user_id: customer.id,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString()
    }))

    await supabase
      .from('mailchimp_sync_status')
      .upsert(syncUpdates, { onConflict: 'user_id' })

    // Update settings with last sync time
    await supabase
      .from('mailchimp_settings')
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: 'success'
      })
      .eq('is_active', true)

    return NextResponse.json({
      success: true,
      count: customers.length
    })
  } catch (error) {
    console.error('Customer sync error:', error)
    return NextResponse.json({ 
      error: (error as Error).message || 'Failed to sync customers' 
    }, { status: 500 })
  }
}