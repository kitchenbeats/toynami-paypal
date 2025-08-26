'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Play, 
  Trophy,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

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

interface RaffleManagerProps {
  initialRaffles: Raffle[]
}

export default function RaffleManager({ initialRaffles }: RaffleManagerProps) {
  const router = useRouter()
  const [raffles, setRaffles] = useState(initialRaffles)
  const [updating, setUpdating] = useState<number | null>(null)
  
  const updateRaffleStatus = async (raffleId: number, newStatus: string) => {
    setUpdating(raffleId)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('raffles')
        .update({ status: newStatus })
        .eq('id', raffleId)
      
      if (error) throw error
      
      setRaffles(prev => prev.map(r => 
        r.id === raffleId ? { ...r, status: newStatus } : r
      ))
      
      toast.success(`Raffle status updated to ${newStatus}`)
      
      if (newStatus === 'closed') {
        // Redirect to drawing page
        const raffle = raffles.find(r => r.id === raffleId)
        if (raffle) {
          router.push(`/admin/raffles/${raffle.slug}/draw`)
        }
      }
    } catch (error) {
      console.error('Error updating raffle:', error)
      toast.error('Failed to update raffle status')
    } finally {
      setUpdating(null)
    }
  }
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      upcoming: 'secondary',
      open: 'success',
      closed: 'destructive',
      drawing: 'warning',
      drawn: 'default'
    }
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Raffles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raffles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Raffles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {raffles.filter(r => r.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {raffles.reduce((sum, r) => sum + (r._count?.entries || 0), 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Winners Selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {raffles.reduce((sum, r) => sum + (r._count?.winners || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Raffles Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Raffles</CardTitle>
            <Link href="/admin/raffles/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Raffle
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Entries</TableHead>
                <TableHead>Winners</TableHead>
                <TableHead>Draw Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.map((raffle) => (
                <TableRow key={raffle.id}>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/contests/raffles/${raffle.slug}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      {raffle.name}
                    </Link>
                  </TableCell>
                  <TableCell>{raffle.product?.name || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(raffle.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {raffle._count?.entries || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-gray-400" />
                      {raffle._count?.winners || 0}/{raffle.total_winners}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {format(new Date(raffle.draw_date), 'MMM d, h:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={updating === raffle.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <Link href={`/admin/raffles/${raffle.slug}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                        </Link>
                        
                        {raffle.status === 'upcoming' && (
                          <DropdownMenuItem
                            onClick={() => updateRaffleStatus(raffle.id, 'open')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Open Registration
                          </DropdownMenuItem>
                        )}
                        
                        {raffle.status === 'open' && (
                          <DropdownMenuItem
                            onClick={() => updateRaffleStatus(raffle.id, 'closed')}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Close Registration
                          </DropdownMenuItem>
                        )}
                        
                        {raffle.status === 'closed' && (
                          <Link href={`/admin/raffles/${raffle.slug}/draw`}>
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4 text-yellow-600" />
                              Start Drawing
                            </DropdownMenuItem>
                          </Link>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <Link href={`/admin/raffles/${raffle.slug}/entries`}>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Entries
                          </DropdownMenuItem>
                        </Link>
                        
                        {raffle.status === 'drawn' && (
                          <Link href={`/admin/raffles/${raffle.slug}/winners`}>
                            <DropdownMenuItem>
                              <Trophy className="mr-2 h-4 w-4" />
                              View Winners
                            </DropdownMenuItem>
                          </Link>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}