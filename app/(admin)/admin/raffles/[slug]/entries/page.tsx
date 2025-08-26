import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { format } from 'date-fns'
import { User, Calendar, Hash, CheckCircle, XCircle } from 'lucide-react'

interface EntriesPageProps {
  params: Promise<{ slug: string }>
}

interface Entry {
  id: string
  user_id: string
  entry_number: number
  status: string
  created_at: string
  ip_address?: string
  user_agent?: string
  user: {
    id: string
    email: string
    full_name?: string
    created_at: string
  }
}

interface RaffleData {
  id: number
  slug: string
  name: string
  status: string
  total_winners: number
  registration_ends_at: string
}

async function getRaffle(slug: string): Promise<RaffleData | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffles')
    .select('id, slug, name, status, total_winners, registration_ends_at')
    .eq('slug', slug)
    .single()
  
  return data
}

async function getEntries(raffleId: number): Promise<Entry[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffle_entries')
    .select(`
      id,
      user_id,
      entry_number,
      status,
      created_at,
      ip_address,
      user_agent,
      user:users!user_id (
        id,
        email,
        full_name,
        created_at
      )
    `)
    .eq('raffle_id', raffleId)
    .order('entry_number')
  
  return data || []
}

export async function generateMetadata({ params }: EntriesPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  return {
    title: raffle ? `Entries - ${raffle.name}` : 'Raffle Entries',
    description: 'View raffle entries'
  }
}

export default async function RaffleEntriesPage({ params }: EntriesPageProps) {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    notFound()
  }
  
  const entries = await getEntries(raffle.id)
  const confirmedEntries = entries.filter(e => e.status === 'confirmed')
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{raffle.name} - Entries</h1>
        <p className="text-gray-600">View and manage raffle entries</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedEntries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(confirmedEntries.map(e => e.user_id)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Winners Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raffle.total_winners}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Win Chance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {confirmedEntries.length > 0 
                ? `${((raffle.total_winners / confirmedEntries.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Entries ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No entries yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry #</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entered At</TableHead>
                  <TableHead>Account Age</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const accountAge = Math.floor(
                    (new Date().getTime() - new Date(entry.user.created_at).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="font-mono">{entry.entry_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          {entry.user.full_name || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.user.email}
                      </TableCell>
                      <TableCell>
                        {entry.status === 'confirmed' ? (
                          <Badge variant="success">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            {entry.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {accountAge} days
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-gray-500">
                          {entry.ip_address || 'N/A'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}