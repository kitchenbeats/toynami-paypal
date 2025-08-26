'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface RaffleEntryFormProps {
  raffleId: number
  maxEntries: number
}

export default function RaffleEntryForm({ raffleId, maxEntries }: RaffleEntryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreed) {
      setError('You must agree to the terms to enter')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('You must be signed in to enter')
      }
      
      // Check if already entered
      const { data: existingEntry } = await supabase
        .from('raffle_entries')
        .select('id')
        .eq('raffle_id', raffleId)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .single()
      
      if (existingEntry) {
        throw new Error('You have already entered this raffle')
      }
      
      // Get next entry number
      const { count } = await supabase
        .from('raffle_entries')
        .select('*', { count: 'exact', head: true })
        .eq('raffle_id', raffleId)
      
      const entryNumber = (count || 0) + 1
      
      // Create entry
      const { error: entryError } = await supabase
        .from('raffle_entries')
        .insert({
          raffle_id: raffleId,
          user_id: user.id,
          entry_number: entryNumber,
          status: 'confirmed',
          ip_address: null, // Would be set server-side
          user_agent: navigator.userAgent
        })
      
      if (entryError) {
        throw new Error('Failed to create entry')
      }
      
      // Send confirmation email
      try {
        await fetch('/api/raffles/entry-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raffleId,
            userId: user.id,
            entryNumber
          })
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the entry if email fails
      }
      
      toast.success(`You're entered! Your entry number is #${entryNumber}`)
      router.refresh()
    } catch (err) {
      console.error('Entry error:', err)
      setError(err instanceof Error ? err.message : 'Failed to enter raffle')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
            I understand that this is a raffle for the opportunity to purchase this item.
            Winners will be selected randomly and notified via email. I agree to the raffle
            rules and terms.
          </Label>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !agreed}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entering...
          </>
        ) : (
          'Enter Raffle'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        Maximum {maxEntries} {maxEntries === 1 ? 'entry' : 'entries'} per person
      </p>
    </form>
  )
}