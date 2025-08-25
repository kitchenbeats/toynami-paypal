import { createClient } from '@/lib/supabase/server'
import CheckoutForm from '@/components/checkout-form'

export default async function CheckoutPage() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
  }

  // You can add any server-side data fetching here
  // For example, getting cart items, user preferences, etc.
  
  return (
    <CheckoutForm user={user} />
  )
}