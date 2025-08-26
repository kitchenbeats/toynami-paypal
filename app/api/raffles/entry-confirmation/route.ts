import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { RaffleEmailService } from '@/lib/email/raffle-emails'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { raffleId, userId, entryNumber } = body
    
    // Verify the entry exists and belongs to the user
    const { data: entry } = await supabase
      .from('raffle_entries')
      .select('id')
      .eq('raffle_id', raffleId)
      .eq('user_id', userId)
      .eq('entry_number', entryNumber)
      .single()
    
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }
    
    // Send confirmation email
    const emailService = new RaffleEmailService()
    await emailService.sendEntryConfirmation({
      raffleId,
      userId,
      entryNumber
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending entry confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}