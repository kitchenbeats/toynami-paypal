import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Trophy, Calendar } from 'lucide-react'
import { formatDistanceToNow, format, isPast } from 'date-fns'
import { getImageSrc } from '@/lib/utils/image-utils'

export const metadata: Metadata = {
  title: 'Raffles | Toynami',
  description: 'Enter raffles for the chance to purchase limited edition collectibles and exclusive items.',
  openGraph: {
    title: 'Toynami Raffles - Limited Edition Collectibles',
    description: 'Win the opportunity to purchase exclusive limited edition items.',
    type: 'website',
  },
}

interface Raffle {
  id: number
  slug: string
  name: string
  description: string
  status: string
  total_winners: number
  registration_ends_at: string
  draw_date: string
  hero_image_url?: string
  thumbnail_url?: string
  product: {
    id: number
    name: string
    base_price_cents: number
    images?: any[]
  }
  _count: {
    entries: number
  }
}

async function getRaffles() {
  const supabase = await createClient()
  
  const { data: raffles } = await supabase
    .from('raffles')
    .select(`
      id,
      slug,
      name,
      description,
      status,
      total_winners,
      registration_starts_at,
      registration_ends_at,
      draw_date,
      hero_image_url,
      thumbnail_url,
      product:products!product_id (
        id,
        name,
        base_price_cents
      )
    `)
    .in('status', ['upcoming', 'open', 'closed', 'drawing', 'drawn'])
    .order('registration_ends_at', { ascending: true })
  
  // Get entry counts for each raffle
  if (raffles) {
    for (const raffle of raffles) {
      const { count } = await supabase
        .from('raffle_entries')
        .select('*', { count: 'exact', head: true })
        .eq('raffle_id', raffle.id)
        .eq('status', 'confirmed')
      
      raffle._count = { entries: count || 0 }
      
      // Get product images
      if (raffle.product) {
        const { data: mediaData } = await supabase
          .from('media_usage')
          .select(`
            media:media_library (
              file_url,
              alt_text
            )
          `)
          .eq('entity_type', 'product')
          .eq('entity_id', raffle.product.id.toString())
          .eq('field_name', 'primary_image')
          .single()
        
        if (mediaData?.media) {
          raffle.product.images = [{
            image_filename: mediaData.media.file_url,
            alt_text: mediaData.media.alt_text,
            is_primary: true
          }]
        }
      }
    }
  }
  
  return raffles as Raffle[]
}

function getRaffleStatus(raffle: Raffle) {
  const now = new Date()
  const endDate = new Date(raffle.registration_ends_at)
  const drawDate = new Date(raffle.draw_date)
  
  if (raffle.status === 'upcoming') {
    return { label: 'Coming Soon', color: 'secondary' }
  }
  if (raffle.status === 'open') {
    return { label: 'Open', color: 'success' }
  }
  if (raffle.status === 'closed') {
    return { label: 'Closed', color: 'destructive' }
  }
  if (raffle.status === 'drawing') {
    return { label: 'Drawing Live!', color: 'warning' }
  }
  if (raffle.status === 'drawn') {
    return { label: 'Winners Selected', color: 'default' }
  }
  
  return { label: 'Unknown', color: 'default' }
}

function getTimeRemaining(endDate: string) {
  const end = new Date(endDate)
  const now = new Date()
  
  if (isPast(end)) {
    return 'Ended'
  }
  
  return formatDistanceToNow(end, { addSuffix: true })
}

export default async function RafflesPage() {
  const raffles = await getRaffles()
  
  const activeRaffles = raffles.filter(r => r.status === 'open')
  const upcomingRaffles = raffles.filter(r => r.status === 'upcoming')
  const pastRaffles = raffles.filter(r => ['closed', 'drawing', 'drawn'].includes(r.status))
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative py-24">
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Exclusive Raffles</h1>
            <p className="text-xl opacity-90">
              Enter for a chance to purchase limited edition collectibles
            </p>
          </div>
        </div>
      </section>

      {/* Active Raffles */}
      {activeRaffles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Active Raffles</h2>
              <Badge variant="success" className="text-lg px-4 py-2">
                {activeRaffles.length} Open Now
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRaffles.map(raffle => {
                const status = getRaffleStatus(raffle)
                const imageUrl = raffle.thumbnail_url || raffle.hero_image_url || 
                               raffle.product?.images?.[0]?.image_filename
                
                return (
                  <Card key={raffle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/contests/raffles/${raffle.slug}`}>
                      <div className="aspect-video relative bg-gray-100">
                        {imageUrl ? (
                          <Image
                            src={getImageSrc(imageUrl)}
                            alt={raffle.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Trophy className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <Badge 
                          variant={status.color as any}
                          className="absolute top-2 right-2"
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </Link>
                    
                    <CardHeader>
                      <h3 className="text-xl font-bold line-clamp-2">{raffle.name}</h3>
                      {raffle.product && (
                        <p className="text-sm text-gray-600">
                          For: {raffle.product.name}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {raffle.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            Ends {getTimeRemaining(raffle.registration_ends_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Users className="h-4 w-4" />
                            {raffle._count.entries} entered
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Trophy className="h-4 w-4" />
                            {raffle.total_winners} winner{raffle.total_winners !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Link href={`/contests/raffles/${raffle.slug}`} className="w-full">
                        <Button className="w-full">
                          Enter Raffle
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Upcoming Raffles */}
      {upcomingRaffles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaffles.map(raffle => {
                const imageUrl = raffle.thumbnail_url || raffle.hero_image_url || 
                               raffle.product?.images?.[0]?.image_filename
                
                return (
                  <Card key={raffle.id} className="overflow-hidden opacity-75">
                    <div className="aspect-video relative bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={getImageSrc(imageUrl)}
                          alt={raffle.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Trophy className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        Coming Soon
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <h3 className="text-xl font-bold line-clamp-2">{raffle.name}</h3>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Opens {format(new Date(raffle.registration_starts_at), 'MMM d, yyyy')}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Past Raffles */}
      {pastRaffles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Past Raffles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastRaffles.map(raffle => {
                const status = getRaffleStatus(raffle)
                const imageUrl = raffle.thumbnail_url || raffle.hero_image_url || 
                               raffle.product?.images?.[0]?.image_filename
                
                return (
                  <Card key={raffle.id} className="overflow-hidden opacity-60">
                    <Link href={`/contests/raffles/${raffle.slug}`}>
                      <div className="aspect-video relative bg-gray-100">
                        {imageUrl ? (
                          <Image
                            src={getImageSrc(imageUrl)}
                            alt={raffle.name}
                            fill
                            className="object-cover grayscale"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Trophy className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <Badge 
                          variant={status.color as any}
                          className="absolute top-2 right-2"
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </Link>
                    
                    <CardHeader>
                      <h3 className="text-xl font-bold line-clamp-2">{raffle.name}</h3>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600">
                        {raffle._count.entries} entries • {raffle.total_winners} winner{raffle.total_winners !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* No Raffles */}
      {raffles.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Active Raffles</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Check back soon for upcoming raffles and your chance to win exclusive items!
            </p>
          </div>
        </section>
      )}
    </div>
  )
}