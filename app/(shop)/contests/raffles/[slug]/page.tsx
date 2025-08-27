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
import { 
  Trophy, Clock, Users, Calendar, AlertCircle, CheckCircle, 
  ShieldCheck, Zap, ArrowRight, Info, Share2
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'
import { getImageSrc } from '@/lib/utils/image-utils'
import RaffleEntryForm from '@/components/raffles/entry-form'
import CountdownHero from '@/components/raffles/countdown-hero'
import RaffleStreamViewer from '@/components/raffles/stream-viewer'
import { cn } from '@/lib/utils'

interface RafflePageProps {
  params: Promise<{ slug: string }>
}

interface ProductImage {
  image_filename: string
  alt_text?: string
  is_primary: boolean
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
    slug: string
    description?: string
    base_price_cents: number
    images?: ProductImage[]
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
  
  const { data: raffle, error } = await supabase
    .from('raffles')
    .select(`
      *,
      product:product_id (
        id,
        name,
        slug,
        description,
        base_price_cents
      )
    `)
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Raffle fetch error:', error)
    return null
  }
  
  if (!raffle) {
    console.error('No raffle found for slug:', slug)
    return null
  }
  
  // The foreign key join returns a single object when using product_id
  // But let's ensure it's not an array just in case
  if (raffle.product && Array.isArray(raffle.product)) {
    raffle.product = raffle.product[0]
  }
  
  // Get entry count
  const { count } = await supabase
    .from('raffle_entries')
    .select('*', { count: 'exact', head: true })
    .eq('raffle_id', raffle.id)
    .eq('status', 'confirmed')
  
  // Get product images from media library (like the product detail page does)
  if (raffle.product) {
    const { data: mediaUsageData } = await supabase
      .from('media_usage')
      .select(`
        field_name,
        media:media_library (
          id,
          file_url,
          alt_text,
          title
        )
      `)
      .eq('entity_type', 'product')
      .eq('entity_id', raffle.product.id.toString())
      .order('field_name')
    
    // Transform media usage data to images array
    // Note: Complex Supabase relation structure, using type assertion for flexibility
    raffle.product.images = (mediaUsageData || []).map((usage: unknown) => {
      const u = usage as { field_name: string; media?: { id?: string; file_url?: string; alt_text?: string } }
      return {
        id: u.media?.id,
        image_filename: u.media?.file_url || '',
        alt_text: u.media?.alt_text || '',
        is_primary: u.field_name === 'primary_image'
      }
    })
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
  
  const reasons: string[] = []
  
  // Email verification - if you can log in, you're verified!
  // ALL login methods require verification:
  // - OAuth providers (Google, Facebook, etc.) auto-verify emails
  // - Email/password users must verify their email to complete signup
  // So any logged-in user is already verified by definition
  
  // Check account age
  if (raffle.min_account_age_days > 0) {
    const { data: userData } = await supabase
      .from('users')
      .select('created_at')
      .eq('id', userId)
      .single()
    
    if (userData) {
      const accountAgeDays = Math.floor(
        (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (accountAgeDays < raffle.min_account_age_days) {
        reasons.push(`Account must be at least ${raffle.min_account_age_days} days old`)
      }
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
    title: `${raffle.name} | Exclusive Raffle | Toynami`,
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
  const startDate = new Date(raffle.registration_starts_at)
  const endDate = new Date(raffle.registration_ends_at)
  const drawDate = new Date(raffle.draw_date)
  
  if (raffle.status === 'upcoming' || isFuture(startDate)) {
    return { label: '', color: 'secondary' as const, icon: Clock }
  }
  if (raffle.status === 'open' && !isPast(endDate)) {
    return { label: 'LIVE NOW', color: 'default' as const, icon: Zap, isLive: true }
  }
  if (raffle.status === 'closed' || (isPast(endDate) && isFuture(drawDate))) {
    return { label: 'Entries Closed', color: 'destructive' as const, icon: AlertCircle }
  }
  if (raffle.status === 'drawing') {
    return { label: 'Drawing Live', color: 'outline' as const, icon: Trophy }
  }
  if (raffle.status === 'drawn') {
    return { label: 'Winners Announced', color: 'default' as const, icon: Trophy }
  }
  
  return { label: 'Unknown', color: 'default' as const, icon: Info }
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
  const now = new Date()
  const registrationStartDate = new Date(raffle.registration_starts_at)
  const registrationEndDate = new Date(raffle.registration_ends_at)
  
  // Determine actual raffle state
  const isUpcoming = now < registrationStartDate
  const isOpen = now >= registrationStartDate && now < registrationEndDate
  const isClosed = now >= registrationEndDate && raffle.status !== 'drawing' && raffle.status !== 'drawn'
  const isDrawing = raffle.status === 'drawing'
  const isDrawn = raffle.status === 'drawn'
  
  const primaryImage = raffle.product?.images?.find(img => img.is_primary) || raffle.product?.images?.[0]
  const galleryImages = raffle.product?.images || []
  
  console.log('Raffle Status Debug:', {
    status: raffle.status,
    isUpcoming,
    isOpen,
    isClosed,
    isDrawing,
    isDrawn,
    now: now.toISOString(),
    starts: registrationStartDate.toISOString(),
    ends: registrationEndDate.toISOString()
  })
  
  return (
    <div className="min-h-screen bg-black">
      {/* Raffle Banner/Hero Image */}
      {raffle.hero_image_url && (
        <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <Image
            src={getImageSrc(raffle.hero_image_url)}
            alt={raffle.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </section>
      )}
      
      {/* Premium Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden flex items-center bg-gray-950">
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 w-full">
          <div className="text-center mb-8 animate-fade-in">
            {status.label && status.label !== '' && (
              <Badge 
                variant={status.color} 
                className={cn(
                  "text-sm px-4 py-1.5 font-semibold tracking-wider inline-block mb-4",
                  status.isLive && "bg-green-600 text-white border-green-600"
                )}
              >
                {status.label}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {raffle.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {raffle.description}
            </p>
            
            {/* Value Proposition - Sophisticated */}
            <div className="mt-6 flex justify-center items-center gap-8 text-gray-400 text-sm">
              <span>Limited Edition</span>
              <span className="text-gray-600">•</span>
              <span>{raffle.total_winners} Winner{raffle.total_winners > 1 ? 's' : ''}</span>
              <span className="text-gray-600">•</span>
              <span>Exclusive Purchase Rights</span>
            </div>
          </div>
          
          {/* Countdown Timer */}
          {(raffle.status !== 'drawn') && (
            <div className="max-w-2xl mx-auto space-y-8">
              <CountdownHero 
                registrationStartsAt={raffle.registration_starts_at}
                registrationEndsAt={raffle.registration_ends_at}
                drawDate={raffle.draw_date}
                status={raffle.status}
              />
              
              {/* ENTRY BUTTON - only when open and user hasn't entered */}
              {isOpen && !userEntry && (
                <div className="text-center">
                  <a href="#enter-raffle" className="inline-block">
                    <Button 
                      size="lg" 
                      className="bg-black hover:bg-gray-900 text-white font-bold text-lg px-10 py-4 border border-white/20 hover:border-white/40 shadow-2xl transition-all"
                    >
                      ENTER NOW
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Live Drawing Stream */}
          {raffle.status === 'drawing' && (
            <div className="mt-8">
              <RaffleStreamViewer raffleId={raffle.id} />
            </div>
          )}
        </div>
      </section>
      
      {/* Premium Product Showcase */}
      <section className="py-24 relative bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-100">
              Exclusive Prize
            </h2>
            <div className="w-24 h-0.5 bg-gray-800 mx-auto" />
          </div>
          
          {raffle.product && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Product Images Gallery */}
              <div className="space-y-6">
                {primaryImage && (
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image
                      src={getImageSrc(primaryImage.image_filename)}
                      alt={primaryImage.alt_text || raffle.product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <Badge className="absolute top-4 right-4 z-20 bg-red-500 text-white">
                      EXCLUSIVE
                    </Badge>
                  </div>
                )}
                
                {/* Thumbnail Gallery - Show ALL images */}
                {galleryImages.length > 1 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      {galleryImages.slice(1, 5).map((img, index) => (
                        <div 
                          key={index}
                          className="relative aspect-square bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                        >
                          <Image
                            src={getImageSrc(img.image_filename)}
                            alt={img.alt_text || `${raffle.product.name} ${index + 2}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 25vw, 12vw"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Show remaining images if more than 5 total */}
                    {galleryImages.length > 5 && (
                      <div className="grid grid-cols-4 gap-3">
                        {galleryImages.slice(5).map((img, index) => (
                          <div 
                            key={index + 4}
                            className="relative aspect-square bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                          >
                            <Image
                              src={getImageSrc(img.image_filename)}
                              alt={img.alt_text || `${raffle.product.name} ${index + 6}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 25vw, 12vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {raffle.product.name}
                  </h3>
                  <Link 
                    href={`/products/${raffle.product.slug}`}
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View Full Product Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                {raffle.product.description && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {raffle.product.description}
                  </p>
                )}
                
                {/* Value Display */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
                  <div className="text-sm text-yellow-400 font-semibold uppercase tracking-wider mb-2">
                    Winner&apos;s Purchase Price
                  </div>
                  <div className="text-5xl font-black text-white">
                    ${(raffle.product.base_price_cents / 100).toFixed(2)}
                  </div>
                  <div className="text-gray-400 mt-2">
                    Winners get exclusive access to purchase this limited item!
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-black/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {raffle._count.entries}
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">
                            {raffle._count.entries < 10 ? 'EARLY ACCESS' : 
                             raffle._count.entries < 50 ? 'LIMITED AVAILABILITY' :
                             'HIGH DEMAND'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Trophy className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {raffle.total_winners > 1 ? `${raffle.total_winners}X` : '1'}
                          </div>
                          <div className="text-sm font-semibold uppercase tracking-wide">
                            {raffle._count.entries === 0 ? (
                              <span className="text-green-400">FIRST ENTRY ADVANTAGE</span>
                            ) : raffle._count.entries <= raffle.total_winners ? (
                              <span className="text-green-400">EXCEPTIONAL ODDS</span>
                            ) : raffle._count.entries < raffle.total_winners * 10 ? (
                              <span className="text-yellow-400">FAVORABLE ODDS</span>
                            ) : (
                              <span className="text-orange-400">EXCLUSIVE OPPORTUNITY</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Entry Section */}
      <section className="py-24 bg-gray-950" id="enter-raffle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              
              <CardContent className="p-8">
                {userEntry ? (
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                      </div>
                      <CheckCircle className="h-24 w-24 text-green-500 mx-auto relative z-10" />
                    </div>
                    <h3 className="text-4xl font-black text-white">SUCCESSFULLY ENTERED</h3>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                      <p className="text-green-300 mb-2 font-semibold">YOUR LUCKY NUMBER</p>
                      <p className="text-6xl font-black text-green-400">#{userEntry.entry_number}</p>
                    </div>
                    <p className="text-gray-300">
                      Secured {formatDistanceToNow(new Date(userEntry.created_at), { addSuffix: true })}
                    </p>
                    <div className="space-y-4">
                      <Button variant="outline" size="lg" className="gap-2 w-full max-w-sm">
                        <Share2 className="h-5 w-5" />
                        Share & Increase Your Luck!
                      </Button>
                      <p className="text-sm text-gray-400">
                        We&apos;ll email you if you win! Make sure to check your inbox.
                      </p>
                    </div>
                  </div>
                ) : isOpen ? (
                  <div className="space-y-6">
                    {/* OPEN - Show Entry Form */}
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Zap className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-semibold">REGISTRATION OPEN</span>
                      </div>
                      <h3 className="text-4xl font-black text-white">
                        CLAIM YOUR SPOT NOW! 
                      </h3>
                      <p className="text-xl text-gray-300">
                        Enter to win exclusive access to purchase {raffle.product?.name}
                      </p>
                    </div>
                    
                    {/* Show different forms based on login status */}
                    {user ? (
                      <RaffleEntryForm raffleId={raffle.id} maxEntries={raffle.max_entries_per_user} />
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                          <h4 className="text-lg font-bold text-white mb-4">Choose Your Entry Method:</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Quick Entry */}
                            <div className="space-y-4">
                              <div className="text-center">
                                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                                <h5 className="font-bold text-white">Quick Entry</h5>
                                <p className="text-sm text-gray-400">Just name & email</p>
                              </div>
                              <RaffleEntryForm raffleId={raffle.id} maxEntries={1} />
                            </div>
                            
                            {/* Sign In for Better Odds */}
                            <div className="space-y-4">
                              <div className="text-center">
                                <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                                <h5 className="font-bold text-white">Sign In for Benefits</h5>
                                <p className="text-sm text-gray-400">Track entries & get notifications</p>
                              </div>
                              <Link href={`/auth/login?redirectTo=/contests/raffles/${raffle.slug}`}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                  Sign In & Enter
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Trust Badges */}
                    <div className="flex justify-center items-center gap-6 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ShieldCheck className="h-4 w-4" />
                        <span>No Purchase Necessary</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Winners Notified by Email</span>
                      </div>
                    </div>
                  </div>
                ) : isUpcoming ? (
                  <div className="text-center space-y-6">
                    <h3 className="text-4xl font-black text-white">OPENING SOON</h3>
                    <p className="text-xl text-gray-300">
                      Get ready! Registration opens in:
                    </p>
                    <div className="text-3xl font-bold text-yellow-400">
                      {format(new Date(raffle.registration_starts_at), 'MMMM d, yyyy')}
                    </div>
                    <div className="text-2xl text-yellow-400">
                      {format(new Date(raffle.registration_starts_at), 'h:mm a')}
                    </div>
                    <Button variant="outline" size="lg" className="animate-pulse">
                      <Calendar className="h-5 w-5 mr-2" />
                      Set Reminder
                    </Button>
                    <p className="text-sm text-gray-400">
                      Be first in line when registration opens!
                    </p>
                  </div>
                ) : isClosed ? (
                  <div className="text-center space-y-6">
                    <h3 className="text-4xl font-black text-white">ENTRIES CLOSED</h3>
                    <p className="text-xl text-gray-300">
                      Registration has ended. Drawing coming soon!
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                      <p className="text-yellow-400 font-semibold mb-2">DRAWING DATE</p>
                      <p className="text-2xl font-bold text-white">
                        {format(new Date(raffle.draw_date), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
                      Winners will be notified by email
                    </p>
                  </div>
                ) : isDrawing ? (
                  <div className="text-center space-y-6">
                    <h3 className="text-4xl font-black text-white">DRAWING IN PROGRESS</h3>
                    <p className="text-xl text-gray-300">
                      Winners are being selected right now!
                    </p>
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                      <Trophy className="h-16 w-16 text-yellow-400 mx-auto animate-bounce" />
                      <p className="text-white mt-4">Check back soon to see the winners!</p>
                    </div>
                  </div>
                ) : isDrawn ? (
                  <div className="text-center space-y-6">
                    <h3 className="text-4xl font-black text-white">WINNERS ANNOUNCED</h3>
                    <p className="text-xl text-gray-300">
                      The raffle has concluded. Check the winners below!
                    </p>
                    <Button variant="outline" size="lg" onClick={() => document.getElementById('winners')?.scrollIntoView()}>
                      View Winners
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                ) : !eligibility.eligible && user ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center">Requirements Not Met</h3>
                    <Alert className="bg-red-900/20 border-red-500/30">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <AlertDescription className="text-gray-300">
                        <ul className="list-disc list-inside space-y-2 mt-2">
                          {eligibility.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <h3 className="text-3xl font-bold text-white">Something went wrong</h3>
                    <p className="text-gray-400">Please refresh the page</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Rules & Details */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Rules */}
            <Card className="bg-gray-950 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-400" />
                  Official Rules
                </h2>
                <div className="space-y-4 text-gray-300">
                  {raffle.rules_text.split('\n').map((rule, index) => (
                    <p key={index} className="leading-relaxed">{rule}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Requirements */}
            <Card className="bg-gray-950 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-400" />
                  Entry Requirements
                </h2>
                <div className="space-y-4">
                  {raffle.require_email_verification && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Verified Email</div>
                        <div className="text-sm text-gray-400">Your email address must be verified</div>
                      </div>
                    </div>
                  )}
                  {raffle.require_previous_purchase && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Previous Purchase</div>
                        <div className="text-sm text-gray-400">Must have made at least one purchase</div>
                      </div>
                    </div>
                  )}
                  {raffle.min_account_age_days > 0 && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Account Age</div>
                        <div className="text-sm text-gray-400">
                          Account must be at least {raffle.min_account_age_days} days old
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">Important Dates</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registration Opens:</span>
                        <span className="text-white font-medium">
                          {format(new Date(raffle.registration_starts_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registration Closes:</span>
                        <span className="text-white font-medium">
                          {format(new Date(raffle.registration_ends_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Winner Drawing:</span>
                        <span className="text-white font-medium">
                          {format(new Date(raffle.draw_date), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Purchase Window:</span>
                        <span className="text-white font-medium">
                          {raffle.purchase_window_hours} hours after winning
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Winners Section (if drawn) */}
      {raffle.status === 'drawn' && raffle.winners && raffle.winners.length > 0 && (
        <section className="py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4 flex items-center justify-center gap-3">
                <Trophy className="h-10 w-10 text-yellow-400" />
                WINNERS
                <Trophy className="h-10 w-10 text-yellow-400" />
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto" />
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {raffle.winners.map((winner, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "bg-gray-900/50 border-gray-800 overflow-hidden",
                    index === 0 && "border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                          index === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black" :
                          index === 1 ? "bg-gray-300 text-gray-800" :
                          index === 2 ? "bg-orange-600 text-white" :
                          "bg-gray-600 text-white"
                        )}>
                          {winner.winner_position}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">
                            {winner.user.full_name || 'Anonymous Winner'}
                          </div>
                          <div className="text-sm text-gray-400">
                            Entry #{winner.entry_number}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {winner.has_purchased ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Claimed
                          </Badge>
                        ) : winner.purchase_deadline && !isPast(new Date(winner.purchase_deadline)) ? (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}