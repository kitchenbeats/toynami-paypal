'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export function AuthUI() {
  const supabase = createClient()
  
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--primary))',
              brandAccent: 'hsl(var(--primary))',
            },
          },
        },
        className: {
          container: 'w-full',
          button: 'w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
          input: 'w-full px-3 py-2 border border-input bg-background rounded-md',
        },
      }}
      providers={[]}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`}
    />
  )
}