import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Trophy, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { getImageSrc } from '@/lib/utils/image-utils'
import ClaimPurchaseButton from '@/components/raffles/claim-purchase-button'

interface ClaimPageProps {
  params: Promise<{ slug: string }>
}

interface WinnerData {
  id: string
  raffle_id: number
  user_id: string
  entry_number: number
  winner_position: number
  purchase_deadline: string
  has_purchased: boolean
  order_id?: number
  raffle: {
    id: number
    name: string
    slug: string
    status: string
    product: {
      id: number
      name: string
      description?: string
      base_price_cents: number
      stock_quantity: number
      images?: Array<{
        image_filename: string
        alt_text?: string
      }>
    }
  }
}

async function getWinnerData(slug: string, userId: string): Promise<WinnerData | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('raffle_winners')
    .select(`
      id,
      raffle_id,
      user_id,
      entry_number,
      winner_position,
      purchase_deadline,
      has_purchased,
      order_id,
      raffle:raffles!raffle_id (
        id,
        name,
        slug,
        status,
        product:products!product_id (
          id,
          name,
          description,
          base_price_cents,
          stock_quantity
        )
      )
    `)
    .eq('user_id', userId)
    .eq('raffle.slug', slug)
    .single()
  
  if (!data) return null
  
  // Get product images
  if (data.raffle?.product) {
    const { data: mediaData } = await supabase
      .from('media_usage')
      .select(`
        media:media_library (
          file_url,
          alt_text
        )
      `)
      .eq('entity_type', 'product')
      .eq('entity_id', data.raffle.product.id.toString())
      .in('field_name', ['primary_image', 'gallery_images'])
      .limit(4)
    
    if (mediaData && mediaData.length > 0) {
      interface MediaUsageItem {
        media: {
          file_url: string
          alt_text: string | null
        }
      }
      
      data.raffle.product.images = mediaData.map((item: MediaUsageItem) => ({
        image_filename: item.media.file_url,
        alt_text: item.media.alt_text
      }))
    }
  }
  
  return data as WinnerData
}

export async function generateMetadata({ params }: ClaimPageProps): Promise<Metadata> {
  await params
  
  return {
    title: 'Claim Your Prize | Toynami',
    description: 'Complete your raffle prize purchase'
  }
}

export default async function RaffleClaimPage({ params }: ClaimPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect(`/auth/login?redirectTo=/contests/raffles/${resolvedParams.slug}/claim`)
  }
  
  // Get winner data
  const winnerData = await getWinnerData(resolvedParams.slug, user.id)
  
  if (!winnerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Not Eligible</h2>
            <p className="text-gray-600">
              You are not a winner of this raffle or your purchase window has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const { raffle, purchase_deadline, has_purchased, winner_position } = winnerData
  const deadlinePassed = isPast(new Date(purchase_deadline))
  const hoursRemaining = Math.max(0, Math.floor(
    (new Date(purchase_deadline).getTime() - Date.now()) / (1000 * 60 * 60)
  ))
  
  if (has_purchased) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Purchase Complete!</h2>
            <p className="text-gray-600 mb-4">
              You have already completed your purchase for this raffle prize.
            </p>
            {winnerData.order_id && (
              <Button asChild>
                <a href={`/account/orders/${winnerData.order_id}`}>
                  View Order
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (deadlinePassed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Purchase Window Expired</h2>
            <p className="text-gray-600">
              Your purchase window expired on {format(new Date(purchase_deadline), 'MMMM d, yyyy h:mm a')}.
              The opportunity has been passed to an alternate winner.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const product = raffle.product
  const price = (product.base_price_cents / 100).toFixed(2)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Congratulations Header */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold mb-2">Congratulations!</h1>
          <p className="text-xl text-gray-600">
            You&apos;re Winner #{winner_position} of the {raffle.name}
          </p>
        </div>
      </section>
      
      {/* Time Warning */}
      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert className={hoursRemaining <= 24 ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'}>
            <Clock className="h-4 w-4" />
            <AlertTitle>Limited Time to Purchase</AlertTitle>
            <AlertDescription>
              You have <strong>{hoursRemaining} hours</strong> remaining to complete your purchase.
              Deadline: {format(new Date(purchase_deadline), 'MMMM d, yyyy h:mm a')}
            </AlertDescription>
          </Alert>
        </div>
      </section>
      
      {/* Product Details */}
      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                  {product.images && product.images[0] ? (
                    <div className="space-y-4">
                      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={getImageSrc(product.images[0].image_filename)}
                          alt={product.images[0].alt_text || product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {product.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {product.images.slice(1, 4).map((image, index) => (
                            <div key={index} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={getImageSrc(image.image_filename)}
                                alt={image.alt_text || product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <Trophy className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* Product Info & Purchase */}
                <div className="space-y-6">
                  <div>
                    <Badge variant="success" className="mb-2">
                      Winner Exclusive
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                    {product.description && (
                      <p className="text-gray-600">{product.description}</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${price}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Exclusive winner price • Limited to 1 per winner
                    </p>
                    
                    {product.stock_quantity > 0 ? (
                      <ClaimPurchaseButton
                        productId={product.id}
                        raffleWinnerId={winnerData.id}
                        price={price}
                      />
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This product is currently out of stock. Please contact support.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> This is a one-time opportunity. If you do not complete
                      your purchase within the deadline, your spot will be offered to an alternate winner.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}