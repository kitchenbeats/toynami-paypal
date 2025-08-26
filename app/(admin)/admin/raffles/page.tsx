import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import RaffleManager from './raffle-manager'

export const metadata: Metadata = {
  title: 'Raffle Management | Admin',
  description: 'Manage raffles and drawings'
}

interface Raffle {
  id: number
  slug: string
  name: string
  description: string
  status: string
  total_winners: number
  registration_starts_at: string
  registration_ends_at: string
  draw_date: string
  product_id: number
  product?: {
    id: number
    name: string
  }
  _count?: {
    entries: number
    winners: number
  }
}

async function getRaffles(): Promise<Raffle[]> {
  const supabase = await createClient()
  
  const { data: raffles } = await supabase
    .from('raffles')
    .select(`
      *,
      product:products!product_id (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })
  
  if (!raffles) return []
  
  // Get counts for each raffle
  for (const raffle of raffles) {
    const { count: entryCount } = await supabase
      .from('raffle_entries')
      .select('*', { count: 'exact', head: true })
      .eq('raffle_id', raffle.id)
      .eq('status', 'confirmed')
    
    const { count: winnerCount } = await supabase
      .from('raffle_winners')
      .select('*', { count: 'exact', head: true })
      .eq('raffle_id', raffle.id)
    
    raffle._count = {
      entries: entryCount || 0,
      winners: winnerCount || 0
    }
  }
  
  return raffles as Raffle[]
}

export default async function AdminRafflesPage() {
  const raffles = await getRaffles()
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Raffle Management</h1>
        <p className="text-gray-600">Create and manage product raffles</p>
      </div>
      
      <RaffleManager initialRaffles={raffles} />
    </div>
  )
}