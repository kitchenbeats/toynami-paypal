'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Sparkles } from 'lucide-react'

interface StreamViewerProps {
  raffleId: number
}

interface StreamEvent {
  id: string
  event_type: 'started' | 'winner_revealed' | 'completed'
  event_data: {
    winner_name?: string
    entry_number?: number
    position?: number
    total_winners?: number
    message?: string
  }
  created_at: string
}

interface Winner {
  position: number
  name: string
  entry_number: number
  revealed_at: string
}

export default function RaffleStreamViewer({ raffleId }: StreamViewerProps) {
  const [winners, setWinners] = useState<Winner[]>([])
  const [isLive, setIsLive] = useState(true)
  const [totalWinners, setTotalWinners] = useState(0)
  const [status, setStatus] = useState('Waiting for stream to start...')
  
  useEffect(() => {
    const supabase = createClient()
    
    // Load existing revealed winners
    const loadWinners = async () => {
      const { data } = await supabase
        .from('raffle_drawing_stream')
        .select('*')
        .eq('raffle_id', raffleId)
        .eq('event_type', 'winner_revealed')
        .order('created_at', { ascending: true })
      
      if (data) {
        const loadedWinners = data.map((event: StreamEvent) => ({
          position: event.event_data.position!,
          name: event.event_data.winner_name || 'Anonymous',
          entry_number: event.event_data.entry_number!,
          revealed_at: event.created_at
        }))
        setWinners(loadedWinners)
      }
    }
    
    loadWinners()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`raffle-${raffleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'raffle_drawing_stream',
          filter: `raffle_id=eq.${raffleId}`
        },
        (payload) => {
          const event = payload.new as StreamEvent
          
          if (event.event_type === 'started') {
            setStatus('Drawing has started!')
            setTotalWinners(event.event_data.total_winners || 0)
          } else if (event.event_type === 'winner_revealed') {
            const newWinner: Winner = {
              position: event.event_data.position!,
              name: event.event_data.winner_name || 'Anonymous',
              entry_number: event.event_data.entry_number!,
              revealed_at: event.created_at
            }
            
            setWinners(prev => [...prev, newWinner])
            setStatus(`Winner #${newWinner.position} revealed!`)
            
            // Animate the new winner
            setTimeout(() => {
              const element = document.getElementById(`winner-${newWinner.position}`)
              element?.classList.add('animate-pulse')
            }, 100)
          } else if (event.event_type === 'completed') {
            setStatus('Drawing complete!')
            setIsLive(false)
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [raffleId])
  
  return (
    <div className="space-y-6">
      {/* Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isLive && (
            <Badge variant="destructive" className="animate-pulse">
              <span className="mr-2">●</span> LIVE
            </Badge>
          )}
          <h2 className="text-2xl font-bold text-white">Raffle Drawing</h2>
        </div>
        <div className="text-white">
          <Users className="inline-block mr-2 h-5 w-5" />
          {winners.length} / {totalWinners || '?'} Winners Revealed
        </div>
      </div>
      
      {/* Status Message */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-white">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-400 animate-pulse" />
            <p className="text-lg">{status}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Winners Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: totalWinners || 4 }, (_, i) => {
          const winner = winners.find(w => w.position === i + 1)
          return (
            <Card
              key={i}
              id={`winner-${i + 1}`}
              className={`transition-all duration-500 ${
                winner ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400' : 'bg-gray-800 border-gray-700'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className={`h-8 w-8 ${
                      winner ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                    <div>
                      <div className={`text-lg font-bold ${
                        winner ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        Winner #{i + 1}
                      </div>
                      {winner ? (
                        <>
                          <div className="text-xl font-bold">{winner.name}</div>
                          <div className="text-sm text-gray-600">Entry #{winner.entry_number}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Waiting...</div>
                      )}
                    </div>
                  </div>
                  {winner && (
                    <Badge variant="success" className="animate-bounce">
                      WINNER!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Viewer Count (mock for now) */}
      <div className="text-center text-gray-400 text-sm">
        <Users className="inline-block mr-2 h-4 w-4" />
        {Math.floor(Math.random() * 500) + 100} viewers watching
      </div>
    </div>
  )
}