import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { format, isPast } from 'date-fns'
import { Trophy, Mail, Clock, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react'
import Link from 'next/link'

interface WinnersPageProps {
  params: Promise<{ slug: string }>
}

interface Winner {
  id: string
  user_id: string
  entry_number: number
  winner_position: number
  selected_at: string
  notified_at?: string
  purchase_deadline?: string
  has_purchased: boolean
  order_id?: number
  user: {
    id: string
    email: string
    full_name?: string
  }
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
    base_price_cents: number
  }
}

async function getRaffle(slug: string): Promise<RaffleData | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffles')
    .select(`
      id,
      slug,
      name,
      status,
      total_winners,
      product:products!product_id (
        id,
        name,
        base_price_cents
      )
    `)
    .eq('slug', slug)
    .single()
  
  return data
}

async function getWinners(raffleId: number): Promise<Winner[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffle_winners')
    .select(`
      id,
      user_id,
      entry_number,
      winner_position,
      selected_at,
      notified_at,
      purchase_deadline,
      has_purchased,
      order_id,
      user:users!user_id (
        id,
        email,
        full_name
      )
    `)
    .eq('raffle_id', raffleId)
    .order('winner_position')
  
  return data || []
}

export async function generateMetadata({ params }: WinnersPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  return {
    title: raffle ? `Winners - ${raffle.name}` : 'Raffle Winners',
    description: 'View raffle winners and purchase status'
  }
}

export default async function RaffleWinnersPage({ params }: WinnersPageProps) {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    notFound()
  }
  
  if (raffle.status !== 'drawn') {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Winners will be available after the raffle drawing is complete.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  const winners = await getWinners(raffle.id)
  const purchasedCount = winners.filter(w => w.has_purchased).length
  const pendingCount = winners.filter(w => !w.has_purchased && w.purchase_deadline && !isPast(new Date(w.purchase_deadline))).length
  const expiredCount = winners.filter(w => !w.has_purchased && w.purchase_deadline && isPast(new Date(w.purchase_deadline))).length
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{raffle.name} - Winners</h1>
        <p className="text-gray-600">View winners and purchase status</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winners.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{purchasedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Winners Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Winners ({winners.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Resend Notifications
              </Button>
              <Button variant="outline" size="sm">
                Export Winners
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {winners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No winners selected yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purchase Deadline</TableHead>
                  <TableHead>Selected At</TableHead>
                  <TableHead>Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.map((winner) => {
                  const deadlinePassed = winner.purchase_deadline && isPast(new Date(winner.purchase_deadline))
                  
                  return (
                    <TableRow key={winner.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Trophy className={`h-5 w-5 ${
                            winner.winner_position === 1 ? 'text-yellow-500' :
                            winner.winner_position === 2 ? 'text-gray-400' :
                            winner.winner_position === 3 ? 'text-orange-600' :
                            'text-gray-300'
                          }`} />
                          <span className="font-bold">#{winner.winner_position}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {winner.user.full_name || 'Anonymous'}
                      </TableCell>
                      <TableCell>
                        {winner.user.email}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">#{winner.entry_number}</span>
                      </TableCell>
                      <TableCell>
                        {winner.has_purchased ? (
                          <Badge variant="success">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Purchased
                          </Badge>
                        ) : deadlinePassed ? (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {winner.purchase_deadline ? (
                          <div className="text-sm">
                            {format(new Date(winner.purchase_deadline), 'MMM d, h:mm a')}
                            {!deadlinePassed && !winner.has_purchased && (
                              <div className="text-xs text-orange-600">
                                {Math.floor((new Date(winner.purchase_deadline).getTime() - Date.now()) / (1000 * 60 * 60))}h remaining
                              </div>
                            )}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(winner.selected_at), 'MMM d, h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {winner.order_id ? (
                          <Link href={`/admin/orders/${winner.order_id}`}>
                            <Button variant="ghost" size="sm">
                              <Package className="mr-1 h-3 w-3" />
                              #{winner.order_id}
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Product Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prize Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{raffle.product.name}</p>
              <p className="text-sm text-gray-600">
                Price: ${(raffle.product.base_price_cents / 100).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Revenue (if all purchase)</p>
              <p className="text-2xl font-bold">
                ${((raffle.product.base_price_cents / 100) * winners.length).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}