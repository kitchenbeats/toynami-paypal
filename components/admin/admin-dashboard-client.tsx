'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { HelpLink } from '@/components/admin/help-link'

export function AdminDashboardClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const handleRefresh = () => {
    startTransition(() => {
      setLastRefresh(new Date())
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <HelpLink />
        <span className="text-xs text-muted-foreground">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      {children}
    </div>
  )
}