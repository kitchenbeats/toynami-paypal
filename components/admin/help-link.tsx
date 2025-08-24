'use client'

import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getDocByPagePath } from '@/lib/docs/admin-docs'

export function HelpLink() {
  const pathname = usePathname()
  const doc = getDocByPagePath(pathname)
  
  if (!doc) return null
  
  return (
    <Link
      href={`/admin/docs?category=${doc.id}`}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      title="View documentation"
    >
      <HelpCircle className="h-3 w-3" />
      <span className="sr-only">Help</span>
    </Link>
  )
}