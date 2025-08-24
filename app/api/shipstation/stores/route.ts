import { NextRequest, NextResponse } from 'next/server'
import { getShipStationV1Client } from '@/lib/shipstation/v1-client'
import { createClient } from '@/lib/supabase/server'

/**
 * Get all ShipStation stores to identify the correct one
 * GET /api/shipstation/stores
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
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

    // Get ShipStation client
    const client = getShipStationV1Client()
    
    // Fetch stores from ShipStation
    const response = await client.makeRequest('/stores')
    
    if (!response.success) {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to fetch stores',
        rateLimitRemaining: response.rateLimitRemaining
      }, { status: 500 })
    }

    // Format store data for display
    const stores = response.data?.map((store: any) => ({
      storeId: store.storeId,
      storeName: store.storeName,
      marketplaceId: store.marketplaceId,
      marketplaceName: store.marketplaceName,
      accountName: store.accountName,
      email: store.email,
      integrationUrl: store.integrationUrl,
      active: store.active,
      companyName: store.companyName,
      phone: store.phone,
      publicEmail: store.publicEmail,
      website: store.website,
      createDate: store.createDate,
      modifyDate: store.modifyDate,
      autoRefresh: store.autoRefresh
    })) || []

    // Get current store ID from environment or database
    const currentStoreId = process.env.SHIPSTATION_STORE_ID || null

    return NextResponse.json({
      success: true,
      stores,
      currentStoreId,
      totalStores: stores.length,
      message: currentStoreId 
        ? `Currently using store ID: ${currentStoreId}` 
        : 'No store ID configured - orders will be created in the default store',
      rateLimitRemaining: response.rateLimitRemaining
    })

  } catch (error) {
    console.error('ShipStation stores error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}