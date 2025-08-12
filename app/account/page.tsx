import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountDashboard } from '@/components/account/account-dashboard'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  const { data: user } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen">
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold mt-4">My Account</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 pb-8">
        <AccountDashboard user={user.user} />
      </div>
    </main>
  )
}