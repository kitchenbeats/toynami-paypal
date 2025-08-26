import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trophy, Clock, Users, Calendar, AlertCircle, CheckCircle, ShieldCheck, Award } from 'lucide-react'
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'
import { getImageSrc } from '@/lib/utils/image-utils'
import RaffleEntryForm from '@/components/raffles/entry-form'
import RaffleCountdown from '@/components/raffles/countdown'
import RaffleStreamViewer from '@/components/raffles/stream-viewer'

interface RafflePageProps {
  params: Promise<{ slug: string }>
}

interface RaffleDetails {
  id: number
  slug: string
  name: string
  description: string
  rules_text: string
  status: 'upcoming' | 'open' | 'closed' | 'drawing' | 'drawn'
  total_winners: number
  max_entries_per_user: number
  registration_starts_at: string
  registration_ends_at: string
  draw_date: string
  hero_image_url?: string
  thumbnail_url?: string
  require_email_verification: boolean
  require_previous_purchase: boolean
  min_account_age_days: number
  purchase_window_hours: number
  product: {
    id: number
    name: string
    description?: string
    base_price_cents: number
    images?: Array<{
      image_filename: string
      alt_text?: string
      is_primary: boolean
    }>
  }
  _count: {
    entries: number
  }
  winners?: Array<{
    user: {
      id: string
      full_name?: string
    }
    entry_number: number
    winner_position: number
    purchase_deadline?: string
    has_purchased: boolean
  }>
}

interface UserEntry {
  id: string
  entry_number: number
  created_at: string
  status: string
}

async function getRaffle(slug: string): Promise<RaffleDetails | null> {
  const supabase = await createClient()
  
  const { data: raffle } = await supabase
    .from('raffles')
    .select(`
      id,
      slug,
      name,
      description,
      rules_text,
      status,
      total_winners,
      max_entries_per_user,
      registration_starts_at,
      registration_ends_at,
      draw_date,
      hero_image_url,
      thumbnail_url,
      require_email_verification,
      require_previous_purchase,
      min_account_age_days,
      purchase_window_hours,
      product:products!product_id (
        id,
        name,
        description,
        base_price_cents
      )
    `)
    .eq('slug', slug)
    .single()
  
  if (!raffle) return null
  
  // Get entry count
  const { count } = await supabase
    .from('raffle_entries')
    .select('*', { count: 'exact', head: true })
    .eq('raffle_id', raffle.id)
    .eq('status', 'confirmed')
  
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
      .in('field_name', ['primary_image', 'gallery_images'])
    
    if (mediaData && mediaData.length > 0) {
      raffle.product.images = mediaData.map((item: any, index: number) => ({
        image_filename: item.media.file_url,
        alt_text: item.media.alt_text,
        is_primary: index === 0
      }))
    }
  }
  
  // Get winners if drawn
  if (raffle.status === 'drawn') {
    const { data: winners } = await supabase
      .from('raffle_winners')
      .select(`
        user:users!user_id (
          id,
          full_name
        ),
        entry_number,
        winner_position,
        purchase_deadline,
        has_purchased
      `)
      .eq('raffle_id', raffle.id)
      .order('winner_position')
    
    raffle.winners = winners || []
  }
  
  return {
    ...raffle,
    _count: { entries: count || 0 }
  } as RaffleDetails
}

async function getUserEntry(raffleId: number, userId: string): Promise<UserEntry | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffle_entries')
    .select('id, entry_number, created_at, status')
    .eq('raffle_id', raffleId)
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .single()
  
  return data as UserEntry | null
}

async function getUserEligibility(raffleId: number, userId: string) {
  const supabase = await createClient()
  
  // Get raffle requirements
  const { data: raffle } = await supabase
    .from('raffles')
    .select('require_email_verification, require_previous_purchase, min_account_age_days')
    .eq('id', raffleId)
    .single()
  
  if (!raffle) return { eligible: false, reasons: ['Raffle not found'] }
  
  // Get user details
  const { data: user } = await supabase
    .from('users')
    .select('created_at, email_verified')
    .eq('id', userId)
    .single()
  
  if (!user) return { eligible: false, reasons: ['User not found'] }
  
  const reasons: string[] = []
  
  // Check email verification
  if (raffle.require_email_verification && !user.email_verified) {
    reasons.push('Email verification required')
  }
  
  // Check account age
  if (raffle.min_account_age_days > 0) {
    const accountAgeDays = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (accountAgeDays < raffle.min_account_age_days) {
      reasons.push(`Account must be at least ${raffle.min_account_age_days} days old`)
    }
  }
  
  // Check previous purchase
  if (raffle.require_previous_purchase) {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed')
    
    if (!count || count === 0) {
      reasons.push('Previous purchase required')
    }
  }
  
  return { eligible: reasons.length === 0, reasons }
}

export async function generateMetadata({ params }: RafflePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    return {
      title: 'Raffle Not Found | Toynami'
    }
  }
  
  return {
    title: `${raffle.name} | Toynami Raffles`,
    description: raffle.description,
    openGraph: {
      title: raffle.name,
      description: raffle.description,
      type: 'website',
      images: raffle.hero_image_url ? [raffle.hero_image_url] : undefined
    }
  }
}

function getRaffleStatus(raffle: RaffleDetails) {
  const now = new Date()
  const startDate = new Date(raffle.registration_starts_at)
  const endDate = new Date(raffle.registration_ends_at)
  const drawDate = new Date(raffle.draw_date)
  
  if (raffle.status === 'upcoming' || isFuture(startDate)) {
    return { label: 'Coming Soon', color: 'secondary' as const }
  }
  if (raffle.status === 'open' && !isPast(endDate)) {
    return { label: 'Open', color: 'success' as const }
  }
  if (raffle.status === 'closed' || (isPast(endDate) && isFuture(drawDate))) {
    return { label: 'Closed', color: 'destructive' as const }
  }
  if (raffle.status === 'drawing') {
    return { label: 'Drawing Live!', color: 'warning' as const }
  }
  if (raffle.status === 'drawn') {
    return { label: 'Winners Selected', color: 'default' as const }
  }
  
  return { label: 'Unknown', color: 'default' as const }
}

export default async function RafflePage({ params }: RafflePageProps) {
  const resolvedParams = await params
  const raffle = await getRaffle(resolvedParams.slug)
  
  if (!raffle) {
    notFound()
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userEntry: UserEntry | null = null
  let eligibility = { eligible: true, reasons: [] as string[] }
  
  if (user) {
    userEntry = await getUserEntry(raffle.id, user.id)
    if (!userEntry) {
      eligibility = await getUserEligibility(raffle.id, user.id)
    }
  }
  
  const status = getRaffleStatus(raffle)
  const isOpen = raffle.status === 'open' && !isPast(new Date(raffle.registration_ends_at))
  const canEnter = isOpen && user && !userEntry && eligibility.eligible
  const imageUrl = raffle.hero_image_url || raffle.thumbnail_url || 
                  raffle.product?.images?.[0]?.image_filename
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        {imageUrl ? (
          <Image
            src={getImageSrc(imageUrl)}
            alt={raffle.name}
            fill
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="h-32 w-32 text-gray-600" />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <Badge variant={status.color} className="mb-4 text-lg px-4 py-2">
              {status.label}
            </Badge>
            <h1 className="text-5xl font-bold mb-4">{raffle.name}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {raffle.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Live Drawing Stream */}
      {raffle.status === 'drawing' && (
        <section className="py-8 bg-black">
          <div className="container mx-auto px-4">
            <RaffleStreamViewer raffleId={raffle.id} />
          </div>
        </section>
      )}
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Product & Rules */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Prize Details</h2>
                  
                  {raffle.product && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        {raffle.product.images && raffle.product.images[0] && (
                          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={getImageSrc(raffle.product.images[0].image_filename)}
                              alt={raffle.product.images[0].alt_text || raffle.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{raffle.product.name}</h3>
                        {raffle.product.description && (
                          <p className="text-gray-600 mb-4">{raffle.product.description}</p>
                        )}
                        <div className="text-lg font-semibold">
                          Retail Price: ${(raffle.product.base_price_cents / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Rules */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Raffle Rules</h2>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {raffle.rules_text.split('\n').map((rule, index) => (
                      <p key={index}>{rule}</p>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-2">Eligibility Requirements:</h3>
                    {raffle.require_email_verification && (
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span>Verified email address required</span>
                      </div>
                    )}
                    {raffle.require_previous_purchase && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Previous purchase required</span>
                      </div>
                    )}
                    {raffle.min_account_age_days > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span>Account must be at least {raffle.min_account_age_days} days old</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Winners (if drawn) */}
              {raffle.status === 'drawn' && raffle.winners && raffle.winners.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Winners</h2>
                    <div className="space-y-4">
                      {raffle.winners.map((winner, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Award className={`h-6 w-6 ${index === 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <div>
                              <div className="font-semibold">
                                Winner #{winner.winner_position}: {winner.user.full_name || 'Anonymous'}
                              </div>
                              <div className="text-sm text-gray-600">
                                Entry #{winner.entry_number}
                              </div>
                            </div>
                          </div>
                          {winner.has_purchased ? (
                            <Badge variant="success">Purchased</Badge>
                          ) : winner.purchase_deadline && !isPast(new Date(winner.purchase_deadline)) ? (
                            <Badge variant="warning">Purchase Pending</Badge>
                          ) : (
                            <Badge variant="secondary">Expired</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right Column - Entry & Stats */}
            <div className="space-y-6">
              {/* Entry Status/Form */}
              <Card>
                <CardContent className="p-6">
                  {userEntry ? (
                    <div className="text-center space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <h3 className="text-xl font-bold">You're Entered!</h3>
                      <p className="text-gray-600">
                        Your entry number is <span className="font-bold">#{userEntry.entry_number}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Entered {formatDistanceToNow(new Date(userEntry.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ) : canEnter ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Enter Raffle</h3>
                      <RaffleEntryForm raffleId={raffle.id} maxEntries={raffle.max_entries_per_user} />
                    </div>
                  ) : !user ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Sign In to Enter</h3>
                      <p className="text-gray-600 text-sm">
                        You must be signed in to enter this raffle.
                      </p>
                      <Link href={`/auth/login?redirectTo=/contests/raffles/${raffle.slug}`}>
                        <Button className="w-full">Sign In</Button>
                      </Link>
                    </div>
                  ) : !eligibility.eligible ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Not Eligible</h3>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1">
                            {eligibility.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold">Registration {raffle.status === 'upcoming' ? 'Opens Soon' : 'Closed'}</h3>
                      {raffle.status === 'upcoming' && (
                        <p className="text-gray-600">
                          Opens {format(new Date(raffle.registration_starts_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Countdown */}
              {(raffle.status === 'open' || raffle.status === 'upcoming') && (
                <Card>
                  <CardContent className="p-6">
                    <RaffleCountdown 
                      endDate={raffle.status === 'upcoming' ? raffle.registration_starts_at : raffle.registration_ends_at}
                      label={raffle.status === 'upcoming' ? 'Opens In' : 'Closes In'}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Stats */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold">Raffle Stats</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        Total Entries
                      </span>
                      <span className="font-bold">{raffle._count.entries}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Trophy className="h-4 w-4" />
                        Winners
                      </span>
                      <span className="font-bold">{raffle.total_winners}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        Draw Date
                      </span>
                      <span className="font-bold text-sm">
                        {format(new Date(raffle.draw_date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                  
                  {raffle._count.entries > 0 && (
                    <>
                      <Separator />
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {((raffle.total_winners / raffle._count.entries) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Win Chance</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}