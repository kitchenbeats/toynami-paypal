import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import mailchimp from '@mailchimp/mailchimp_marketing'

export async function POST(request: NextRequest) {
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

    const settings = await request.json()
    
    // Validate required fields
    if (!settings.api_key || !settings.server_prefix || !settings.list_id) {
      return NextResponse.json({ 
        error: 'Missing required fields: API key, server prefix, and list ID' 
      }, { status: 400 })
    }

    // Configure Mailchimp client
    mailchimp.setConfig({
      apiKey: settings.api_key,
      server: settings.server_prefix
    })

    // Test connection
    const pingResponse = await mailchimp.ping.get()
    
    if (pingResponse.health_status !== 'Everything\'s Chimpy!') {
      return NextResponse.json({ 
        error: 'Failed to connect to Mailchimp' 
      }, { status: 500 })
    }

    // Get list info
    const listInfo = await mailchimp.lists.getList(settings.list_id)
    
    return NextResponse.json({
      success: true,
      data: {
        health: pingResponse.health_status,
        listName: listInfo.name,
        memberCount: listInfo.stats.member_count
      }
    })
  } catch (error: any) {
    console.error('Mailchimp test error:', error)
    
    // Parse Mailchimp error
    if (error.response) {
      const errorBody = error.response.body
      return NextResponse.json({ 
        error: errorBody.detail || errorBody.title || 'Mailchimp API error' 
      }, { status: error.status || 500 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to test connection' 
    }, { status: 500 })
  }
}