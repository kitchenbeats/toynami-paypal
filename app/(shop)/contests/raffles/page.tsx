import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy, Zap, Timer, Star, Flame } from 'lucide-react'
import { formatDistanceToNow, format, differenceInHours } from 'date-fns'
import { getImageSrc } from '@/lib/utils/image-utils'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Exclusive Raffles | Toynami',
  description: 'Enter exclusive raffles for the chance to purchase limited edition collectibles and rare items.',
  openGraph: {
    title: 'Toynami Raffles - Win Exclusive Purchase Rights',
    description: 'Enter for a chance to purchase limited edition collectibles.',
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
  registration_starts_at: string
  draw_date: string
  hero_image_url?: string
  thumbnail_url?: string
  product: {
    id: number
    name: string
    base_price_cents: number
    images?: Array<{
      id?: string
      image_filename: string
      alt_text: string
      is_primary: boolean
    }>
  }
  _count: {
    entries: number
  }
}

async function getRaffles() {
  const supabase = await createClient()
  
  const { data: raffles, error } = await supabase
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
      product_id,
      product:products (
        id,
        name,
        base_price_cents
      )
    `)
    .in('status', ['upcoming', 'open', 'closed', 'drawing', 'drawn'])
    .order('registration_ends_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching raffles:', error)
  }
  
  // Get entry counts and images for each raffle
  if (raffles) {
    for (const raffle of raffles) {
      const { count } = await supabase
        .from('raffle_entries')
        .select('*', { count: 'exact', head: true })
        .eq('raffle_id', raffle.id)
        .eq('status', 'confirmed')
      
      raffle._count = { entries: count || 0 }
      
      // Get product images
      if (raffle.product && raffle.product.id) {
        const { data: mediaData, error: mediaError } = await supabase
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
        
        if (mediaError) {
          // Try to get any image for this product
          const { data: galleryData } = await supabase
            .from('media_usage')
            .select(`
              media:media_library (
                file_url,
                alt_text
              )
            `)
            .eq('entity_type', 'product')
            .eq('entity_id', raffle.product.id.toString())
            .limit(1)
            .single()
          
          if (galleryData?.media) {
            raffle.product.images = [{
              image_filename: galleryData.media.file_url,
              alt_text: galleryData.media.alt_text,
              is_primary: true
            }]
          }
        } else if (mediaData?.media) {
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

export default async function RafflesPage() {
  const raffles = await getRaffles()
  
  const activeRaffles = raffles.filter(r => r.status === 'open')
  const upcomingRaffles = raffles.filter(r => r.status === 'upcoming')
  const recentWinners = raffles.filter(r => r.status === 'drawn').slice(0, 3)
  
  // Get the most urgent raffle (ending soonest)
  const urgentRaffle = activeRaffles.sort((a, b) => 
    new Date(a.registration_ends_at).getTime() - new Date(b.registration_ends_at).getTime()
  )[0]
  
  const hoursRemaining = urgentRaffle 
    ? differenceInHours(new Date(urgentRaffle.registration_ends_at), new Date())
    : 0
  
  return (
    <div className="min-h-screen bg-black">
      {/* EPIC HERO - Full Screen Impact */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(255, 119, 0, 0.2) 0%, transparent 50%),
                              radial-gradient(circle at 40% 20%, rgba(255, 0, 184, 0.2) 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {urgentRaffle && hoursRemaining <= 48 && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-full mb-8 animate-pulse">
              <Flame className="h-5 w-5 text-red-500" />
              <span className="text-red-400 font-bold uppercase tracking-wider">
                {hoursRemaining <= 24 ? 'FINAL HOURS' : 'ENDING SOON'}
              </span>
            </div>
          )}
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter">
            RAFFLES
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-400 mb-12 font-light">
            Your gateway to the impossible
          </p>
          
          {activeRaffles.length > 0 && (
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    {activeRaffles.length}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-gray-500 mt-2">Live Now</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {activeRaffles.reduce((sum, r) => sum + r._count.entries, 0)}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-gray-500 mt-2">Total Entries</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {activeRaffles.reduce((sum, r) => sum + r.total_winners, 0)}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-gray-500 mt-2">Winners Today</div>
                </div>
              </div>
              
              <a href="#live-raffles">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-12 py-6 text-lg">
                  ENTER NOW
                </Button>
              </a>
            </div>
          )}
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* URGENT/FEATURED RAFFLE - Spotlight Treatment */}
      {urgentRaffle && (
        <section id="live-raffles" className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="relative">
              {/* Section Header */}
              <div className="text-center mb-16">
                {hoursRemaining <= 24 && (
                  <Badge className="bg-red-500 text-white text-sm px-4 py-2 mb-4">
                    <Timer className="h-4 w-4 mr-2" />
                    ENDING IN {hoursRemaining} HOURS
                  </Badge>
                )}
                <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                  {hoursRemaining <= 24 ? 'LAST CHANCE' : 'FEATURED RAFFLE'}
                </h2>
              </div>
              
              {/* Featured Raffle - Cinematic Layout */}
              <Link href={`/contests/raffles/${urgentRaffle.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Side */}
                    <div className="relative h-[400px] lg:h-[500px]">
                      {urgentRaffle.hero_image_url || urgentRaffle.thumbnail_url || urgentRaffle.product?.images?.[0]?.image_filename ? (
                        <Image
                          src={getImageSrc(urgentRaffle.hero_image_url || urgentRaffle.thumbnail_url || urgentRaffle.product?.images?.[0]?.image_filename)}
                          alt={urgentRaffle.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <Trophy className="h-32 w-32 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
                    </div>
                    
                    {/* Content Side */}
                    <div className="relative p-12 flex flex-col justify-center">
                      <div className="space-y-6">
                        <h3 className="text-4xl lg:text-5xl font-black text-white">
                          {urgentRaffle.name}
                        </h3>
                        
                        <p className="text-xl text-gray-300">
                          {urgentRaffle.description}
                        </p>
                        
                        {urgentRaffle.product && (
                          <div className="pt-6 border-t border-white/10">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Prize Value</div>
                            <div className="text-3xl font-bold text-white">
                              ${(urgentRaffle.product.base_price_cents / 100).toFixed(2)}
                            </div>
                          </div>
                        )}
                        
                        {/* Live Stats */}
                        <div className="grid grid-cols-2 gap-6 pt-6">
                          <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Users className="h-4 w-4" />
                              <span className="text-sm uppercase tracking-wider">Entries</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                              {urgentRaffle._count.entries}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Trophy className="h-4 w-4" />
                              <span className="text-sm uppercase tracking-wider">Winners</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                              {urgentRaffle.total_winners}
                            </div>
                          </div>
                        </div>
                        
                        {/* CTA */}
                        <div className="pt-6">
                          <span className="inline-flex items-center gap-3 text-white font-bold text-lg group-hover:gap-5 transition-all">
                            ENTER THIS RAFFLE
                            <Zap className="h-6 w-6" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Bar */}
                  {hoursRemaining <= 48 && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        style={{ width: `${Math.max(5, (hoursRemaining / 48) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* ALL ACTIVE RAFFLES - Dynamic Grid */}
      {activeRaffles.length > 1 && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                ALL LIVE RAFFLES
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeRaffles.filter(r => r.id !== urgentRaffle?.id).map((raffle) => {
                const imageUrl = raffle.hero_image_url || raffle.thumbnail_url || 
                               raffle.product?.images?.[0]?.image_filename
                const timeLeft = formatDistanceToNow(new Date(raffle.registration_ends_at))
                
                return (
                  <Link key={raffle.id} href={`/contests/raffles/${raffle.slug}`}>
                    <div className={cn(
                      "group relative h-[400px] rounded-xl overflow-hidden cursor-pointer",
                      "transform transition-all duration-500 hover:scale-105 hover:z-10"
                    )}>
                      {/* Background Image */}
                      {imageUrl ? (
                        <Image
                          src={getImageSrc(imageUrl)}
                          alt={raffle.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600" />
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <Badge className="bg-green-500/90 text-white mb-4">
                          LIVE • {timeLeft} left
                        </Badge>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {raffle.name}
                        </h3>
                        
                        <p className="text-gray-300 line-clamp-2 mb-4">
                          {raffle.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/70">
                              <Users className="h-4 w-4 inline mr-1" />
                              {raffle._count.entries}
                            </span>
                            <span className="text-white/70">
                              <Trophy className="h-4 w-4 inline mr-1" />
                              {raffle.total_winners} winner{raffle.total_winners !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            ENTER →
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* HOW IT WORKS - Quick explainer */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">How Toynami Raffles Work</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Enter for Free</h3>
                <p className="text-gray-400 text-sm">Sign up during the open registration period. No purchase necessary.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Fair Selection</h3>
                <p className="text-gray-400 text-sm">Winners randomly selected when registration closes. One entry per person.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Exclusive Access</h3>
                <p className="text-gray-400 text-sm">Winners get exclusive access to purchase limited items not available to the public.</p>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-300">
                <span className="text-white font-semibold">Why raffles?</span> Many of our items are extremely limited. 
                Raffles ensure everyone has a fair chance at these exclusive collectibles, preventing bots and resellers from taking everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING RAFFLES - Full Width Cards */}
      {upcomingRaffles.length > 0 && (
        <section className="py-24 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                UPCOMING DROPS
              </h2>
              <p className="text-xl text-gray-400">Get ready for what&apos;s next</p>
            </div>
            
            <div className="space-y-6 max-w-6xl mx-auto">
              {upcomingRaffles.map((raffle) => {
                const imageUrl = raffle.hero_image_url || raffle.thumbnail_url || 
                               raffle.product?.images?.[0]?.image_filename
                
                const hoursUntil = Math.ceil(
                  (new Date(raffle.registration_starts_at).getTime() - Date.now()) / (1000 * 60 * 60)
                )
                const daysUntil = Math.ceil(hoursUntil / 24)
                
                // Determine the right badge text
                let badgeText = ''
                if (hoursUntil <= 0) {
                  badgeText = 'OPENING NOW'
                } else if (hoursUntil <= 24) {
                  badgeText = `OPENS IN ${hoursUntil} ${hoursUntil === 1 ? 'HOUR' : 'HOURS'}`
                } else {
                  badgeText = `OPENS IN ${daysUntil} ${daysUntil === 1 ? 'DAY' : 'DAYS'}`
                }
                
                return (
                  <div key={raffle.id} className="group relative rounded-2xl overflow-hidden bg-gray-900 hover:bg-gray-850 transition-all duration-300">
                    <div className="flex h-[350px]">
                      {/* Image Section - FULL IMAGE VISIBLE */}
                      <div className="relative w-[400px] h-full flex-shrink-0 bg-gray-800">
                        {imageUrl ? (
                          <>
                            <Image
                              src={getImageSrc(imageUrl)}
                              alt={raffle.name}
                              fill
                              className="object-contain bg-gray-900"
                              sizes="400px"
                              priority
                            />
                            {/* Gradient to blend with content */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                            <Trophy className="h-24 w-24 text-white/40" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="relative p-8 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Badge */}
                          <Badge className={cn(
                            "text-white border-0 mb-4",
                            hoursUntil <= 0 ? "bg-green-600 animate-pulse" : 
                            hoursUntil <= 24 ? "bg-orange-600" : 
                            "bg-purple-600"
                          )}>
                            {badgeText}
                          </Badge>
                          
                          {/* Title & Description */}
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {raffle.name}
                          </h3>
                          
                          {/* WHAT'S BEING RAFFLED */}
                          {raffle.product && (
                            <div className="bg-gray-800 rounded-lg p-4 mb-4">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Exclusive Item</p>
                              <p className="text-lg font-semibold text-white">{raffle.product.name}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Limited to {raffle.total_winners} {raffle.total_winners === 1 ? 'person' : 'lucky winners'} • One per customer • Fair raffle selection
                              </p>
                            </div>
                          )}
                          
                          <p className="text-gray-400 line-clamp-2 text-base">
                            {raffle.description}
                          </p>
                        </div>
                        
                        {/* Bottom Info */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Opens</span>
                              <span className="text-white font-semibold">
                                {format(new Date(raffle.registration_starts_at), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Winners Selected</span>
                              <span className="text-white font-semibold">
                                {raffle.total_winners} {raffle.total_winners === 1 ? 'Winner' : 'Winners'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Limit</span>
                              <span className="text-white font-semibold">
                                One Per Person
                              </span>
                            </div>
                          </div>
                          
                          {/* Hover indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-purple-400 font-semibold">
                              Coming Soon →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* RECENT WINNERS - Celebration */}
      {recentWinners.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-500 font-semibold uppercase tracking-wider">
                  Recent Winners
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Congratulations to Our Winners!
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {recentWinners.map(raffle => (
                <div key={raffle.id} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{raffle.name}</h3>
                  <p className="text-sm text-gray-400">
                    {raffle._count.entries} participants • {raffle.total_winners} winner{raffle.total_winners !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* NO RAFFLES STATE */}
      {raffles.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <Trophy className="h-32 w-32 text-gray-800 mx-auto mb-8" />
              <h2 className="text-5xl font-black text-white mb-6">
                COMING SOON
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Epic raffles are on the horizon. Be the first to know when they drop.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-8">
                NOTIFY ME
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}