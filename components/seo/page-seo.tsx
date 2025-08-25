import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata, SEOData } from '@/lib/seo/utils'
import { StructuredData } from './structured-data'

interface PageSEOProps {
  seoData: SEOData
  structuredDataType?: 'product' | 'blog' | 'category' | 'brand' | 'breadcrumb'
  structuredData?: Record<string, unknown>
  children?: React.ReactNode
}

export function PageSEO({ 
  seoData, 
  structuredDataType, 
  structuredData, 
  children 
}: PageSEOProps) {
  return (
    <>
      {structuredDataType && (
        <StructuredData 
          type={structuredDataType} 
          data={structuredData} 
          url={seoData.url} 
        />
      )}
      {children}
    </>
  )
}

// Server-side metadata generation helper
export function generatePageMetadata(seoData: SEOData): Metadata {
  return generateSEOMetadata(seoData)
}

// Breadcrumb component for SEO
export function SEOBreadcrumbs({ 
  items 
}: { 
  items: Array<{ name: string; url?: string }> 
}) {
  const breadcrumbData = {
    breadcrumbs: items.map((item) => ({
      name: item.name,
      url: item.url || '#'
    }))
  }

  return (
    <>
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center">
              {idx > 0 && <span className="mx-2">/</span>}
              {item.url ? (
                <a href={item.url} className="hover:text-foreground transition-colors">
                  {item.name}
                </a>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}