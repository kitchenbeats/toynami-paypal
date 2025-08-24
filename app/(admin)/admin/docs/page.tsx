import { Metadata } from 'next'
import { DocsViewer } from './docs-viewer'

export const metadata: Metadata = {
  title: 'Documentation - Admin',
  description: 'Admin documentation and help'
}

export default function AdminDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Everything you need to know about managing your store
        </p>
      </div>
      
      <DocsViewer />
    </div>
  )
}