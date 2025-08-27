'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Trophy, 
  Users, 
  Sparkles, 
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

interface Entry {
  id: string
  user_id: string
  entry_number: number
  user: {
    id: string
    full_name?: string
    email: string
  }
}

interface Raffle {
  id: number
  slug: string
  name: string
  status: string
  total_winners: number
  product: {
    id: number
    name: string
  }
  entries: Entry[]
}

interface Winner {
  position: number
  entry: Entry
  revealedAt?: Date
}

interface DrawingControllerProps {
  raffle: Raffle
}

export default function DrawingController({ raffle }: DrawingControllerProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'ready' | 'started' | 'drawing' | 'revealing' | 'completed'>('ready')
  const [winners, setWinners] = useState<Winner[]>([])
  const [currentReveal, setCurrentReveal] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // Start the drawing process
  const startDrawing = async () => {
    setStatus('started')
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Update raffle status to drawing
      await supabase
        .from('raffles')
        .update({ status: 'drawing' })
        .eq('id', raffle.id)
      
      // Stream event: drawing started
      await supabase
        .from('raffle_drawing_stream')
        .insert({
          raffle_id: raffle.id,
          event_type: 'started',
          event_data: {
            total_winners: raffle.total_winners,
            total_entries: raffle.entries.length,
            message: 'Drawing has begun!'
          }
        })
      
      // Wait a moment for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('drawing')
      
      // Randomly select winners
      const shuffled = shuffleArray(raffle.entries)
      const selectedWinners = shuffled.slice(0, raffle.total_winners).map((entry, index) => ({
        position: index + 1,
        entry
      }))
      
      setWinners(selectedWinners)
      
      // Wait before starting reveal
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatus('revealing')
    } catch (err) {
      console.error('Error starting drawing:', err)
      setError('Failed to start drawing')
      setStatus('ready')
    }
  }
  
  // Reveal next winner
  const revealNextWinner = async () => {
    if (currentReveal >= winners.length) return
    
    setIsAnimating(true)
    const winner = winners[currentReveal]
    
    try {
      const supabase = createClient()
      
      // Save winner to database
      const purchaseDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000)
      await supabase
        .from('raffle_winners')
        .insert({
          raffle_id: raffle.id,
          user_id: winner.entry.user_id,
          entry_number: winner.entry.entry_number,
          winner_position: winner.position,
          purchase_deadline: purchaseDeadline.toISOString()
        })
      
      // Send winner notification email
      try {
        await fetch('/api/raffles/winner-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raffleId: raffle.id,
            userId: winner.entry.user_id,
            winnerPosition: winner.position,
            purchaseDeadline
          })
        })
      } catch (emailError) {
        console.error('Failed to send winner notification:', emailError)
      }
      
      // Stream the winner reveal
      await supabase
        .from('raffle_drawing_stream')
        .insert({
          raffle_id: raffle.id,
          event_type: 'winner_revealed',
          event_data: {
            position: winner.position,
            entry_number: winner.entry.entry_number,
            winner_name: winner.entry.user.full_name || 'Anonymous',
            message: `Winner #${winner.position} revealed!`
          }
        })
      
      // Update local state
      setWinners(prev => prev.map((w, i) => 
        i === currentReveal ? { ...w, revealedAt: new Date() } : w
      ))
      
      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      setCurrentReveal(prev => prev + 1)
      
      // Check if all winners revealed
      if (currentReveal + 1 >= winners.length) {
        await completeDrawing()
      }
    } catch (err) {
      console.error('Error revealing winner:', err)
      setError('Failed to reveal winner')
    } finally {
      setIsAnimating(false)
    }
  }
  
  // Complete the drawing
  const completeDrawing = async () => {
    try {
      const supabase = createClient()
      
      // Update raffle status
      await supabase
        .from('raffles')
        .update({ status: 'drawn' })
        .eq('id', raffle.id)
      
      // Stream completion event
      await supabase
        .from('raffle_drawing_stream')
        .insert({
          raffle_id: raffle.id,
          event_type: 'completed',
          event_data: {
            message: 'Drawing complete! All winners have been selected.',
            total_winners: raffle.total_winners
          }
        })
      
      setStatus('completed')
      
      // Epic confetti finale
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }
      
      const interval: NodeJS.Timer = setInterval(() => {
        const timeLeft = animationEnd - Date.now()
        
        if (timeLeft <= 0) {
          return clearInterval(interval)
        }
        
        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
      
      toast.success('Drawing complete! All winners have been selected.')
    } catch (err) {
      console.error('Error completing drawing:', err)
      setError('Failed to complete drawing')
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <Badge variant="destructive" className="mb-4 text-lg px-4 py-2 animate-pulse">
            <span className="mr-2">●</span> LIVE DRAWING
          </Badge>
          <h1 className="text-5xl font-bold mb-2">{raffle.name}</h1>
          <p className="text-xl opacity-90">
            {raffle.product.name} • {raffle.entries.length} Entries • {raffle.total_winners} Winners
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Control Panel */}
        <div className="max-w-4xl mx-auto">
          {status === 'ready' && (
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-24 w-24 mx-auto mb-6 text-yellow-400 animate-pulse" />
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Draw Winners?</h2>
                <p className="text-gray-300 mb-8">
                  {raffle.entries.length} people have entered. {raffle.total_winners} will win!
                </p>
                <Button
                  size="lg"
                  variant="destructive"
                  className="text-3xl py-8 px-16 font-bold animate-pulse hover:animate-none"
                  onClick={startDrawing}
                >
                  <Play className="mr-4 h-8 w-8" />
                  GO!
                </Button>
              </CardContent>
            </Card>
          )}
          
          {status === 'started' && (
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-24 w-24 mx-auto mb-6 text-yellow-400 animate-spin" />
                <h2 className="text-3xl font-bold text-white mb-4">Initializing Drawing...</h2>
                <p className="text-gray-300">
                  Preparing to select {raffle.total_winners} winners from {raffle.entries.length} entries
                </p>
              </CardContent>
            </Card>
          )}
          
          {status === 'drawing' && (
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur">
              <CardContent className="p-12 text-center">
                <Zap className="h-24 w-24 mx-auto mb-6 text-yellow-400 animate-bounce" />
                <h2 className="text-3xl font-bold text-white mb-4">Selecting Winners...</h2>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {(status === 'revealing' || status === 'completed') && (
            <div className="space-y-6">
              {/* Reveal Control */}
              {status === 'revealing' && currentReveal < winners.length && (
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Ready to Reveal Winner #{currentReveal + 1}
                    </h2>
                    <Button
                      size="lg"
                      variant="default"
                      className="text-xl py-6 px-12 font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      onClick={revealNextWinner}
                      disabled={isAnimating}
                    >
                      {isAnimating ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Revealing...
                        </>
                      ) : (
                        <>
                          <Trophy className="mr-2 h-6 w-6" />
                          Reveal Winner #{currentReveal + 1}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Winners Display */}
              <div className="grid md:grid-cols-2 gap-4">
                {winners.map((winner, index) => (
                  <Card
                    key={index}
                    className={`transition-all duration-500 ${
                      winner.revealedAt
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-50 border-yellow-400 animate-pulse'
                        : 'bg-gray-800/50 border-gray-700'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Trophy className={`h-10 w-10 ${
                            winner.revealedAt ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                          <div>
                            <div className={`text-lg font-bold ${
                              winner.revealedAt ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              Winner #{winner.position}
                            </div>
                            {winner.revealedAt ? (
                              <>
                                <div className="text-2xl font-bold">
                                  {winner.entry.user.full_name || 'Anonymous'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Entry #{winner.entry.entry_number}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-gray-500">Waiting to reveal...</div>
                            )}
                          </div>
                        </div>
                        {winner.revealedAt && (
                          <Badge variant="success" className="text-lg px-3 py-1">
                            WINNER!
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Completion Message */}
              {status === 'completed' && (
                <Card className="bg-green-900/90 border-green-700 backdrop-blur">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">Drawing Complete!</h2>
                    <p className="text-green-200 mb-4">
                      All {raffle.total_winners} winners have been selected and notified.
                    </p>
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white/10"
                      onClick={() => router.push('/admin/raffles')}
                    >
                      Back to Raffles
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Live Stats */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{raffle.entries.length}</div>
              <div className="text-sm text-gray-400">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">
                {currentReveal}/{raffle.total_winners}
              </div>
              <div className="text-sm text-gray-400">Winners Revealed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">
                {raffle.total_winners > 0 
                  ? `${((raffle.total_winners / raffle.entries.length) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}