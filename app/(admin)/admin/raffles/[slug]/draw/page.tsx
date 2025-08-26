import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DrawingController from './drawing-controller'

interface DrawPageProps {
  params: Promise<{ slug: string }>
}

interface RaffleData {
  id: number
  slug: string
  name: string
  status: string
  total_winners: number
  product: {
    id: number
    name: string
  }
  entries: Array<{
    id: string
    user_id: string
    entry_number: number
    user: {
      id: string
      full_name?: string
      email: string
    }
  }>
}

async function getRaffle(slug: string): Promise<RaffleData | null> {
  const supabase = await createClient()
  
  const { data: raffle } = await supabase
    .from('raffles')
    .select(`
      id,
      slug,
      name,
      status,
      total_winners,
      product:products!product_id (
        id,
        name
      )
    `)
    .eq('slug', slug)
    .single()
  
  if (!raffle) return null
  
  // Get all confirmed entries
  const { data: entries } = await supabase
    .from('raffle_entries')
    .select(`
      id,
      user_id,
      entry_number,
      user:users!user_id (
        id,
        full_name,
        email
      )
    `)
    .eq('raffle_id', raffle.id)
    .eq('status', 'confirmed')
    .order('entry_number')
  
  return {
    ...raffle,
    entries: entries || []
  } as RaffleData
}

export async function generateMetadata({ params }: DrawPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  return {
    title: raffle ? `Draw Winners - ${raffle.name}` : 'Draw Winners',
    description: 'Live raffle drawing interface'
  }
}

export default async function RaffleDrawPage({ params }: DrawPageProps) {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    notFound()
  }
  
  if (!['closed', 'drawing'].includes(raffle.status)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Raffle Not Ready</h1>
          <p className="text-gray-400">
            This raffle must be closed before you can draw winners.
          </p>
        </div>
      </div>
    )
  }
  
  return <DrawingController raffle={raffle} />
}