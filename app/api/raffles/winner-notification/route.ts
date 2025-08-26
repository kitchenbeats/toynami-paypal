import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { RaffleEmailService } from '@/lib/email/raffle-emails'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    const body = await request.json()
    const { raffleId, userId, winnerPosition, purchaseDeadline } = body
    
    // Send winner notification email
    const emailService = new RaffleEmailService()
    await emailService.sendWinnerNotification({
      raffleId,
      userId,
      winnerPosition,
      purchaseDeadline: new Date(purchaseDeadline)
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending winner notification:', error)
    return NextResponse.json(
      { error: 'Failed to send winner notification' },
      { status: 500 }
    )
  }
}