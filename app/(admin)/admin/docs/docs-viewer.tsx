'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard, ShoppingCart, Package, Truck, Users, 
  Megaphone, Settings, AlertCircle, Search, ChevronRight,
  BookOpen, Home, ArrowLeft
} from 'lucide-react'
import { adminDocs, type DocCategory, type DocSection } from '@/lib/docs/admin-docs'
import ReactMarkdown from 'react-markdown'

const iconMap: Record<string, React.ComponentType> = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Megaphone,
  Settings,
  AlertCircle
}

export function DocsViewer() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<DocCategory | null>(null)
  const [selectedSection, setSelectedSection] = useState<DocSection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{
    category: DocCategory
    section: DocSection
    match: string
  }[]>([])

  useEffect(() => {
    const categoryId = searchParams.get('category')
    const sectionId = searchParams.get('section')
    
    if (categoryId) {
      const category = adminDocs.find(c => c.id === categoryId)
      if (category) {
        setSelectedCategory(category)
        if (sectionId) {
          const section = category.sections.find(s => s.id === sectionId)
          if (section) {
            setSelectedSection(section)
          } else {
            setSelectedSection(category.sections[0])
          }
        } else {
          setSelectedSection(category.sections[0])
        }
      }
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const results: typeof searchResults = []
    const lowerQuery = query.toLowerCase()

    adminDocs.forEach(category => {
      category.sections.forEach(section => {
        if (
          section.title.toLowerCase().includes(lowerQuery) ||
          section.content.toLowerCase().includes(lowerQuery)
        ) {
          const matchIndex = section.content.toLowerCase().indexOf(lowerQuery)
          const start = Math.max(0, matchIndex - 50)
          const end = Math.min(section.content.length, matchIndex + 100)
          const match = section.content.substring(start, end)
          
          results.push({
            category,
            section,
            match: '...' + match + '...'
          })
        }
      })
    })

    setSearchResults(results.slice(0, 10))
  }

  const selectResult = (category: DocCategory, section: DocSection) => {
    setSelectedCategory(category)
    setSelectedSection(section)
    setSearchQuery('')
    setSearchResults([])
  }

  const renderContent = () => {
    if (!selectedSection) {
      return (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a topic</h3>
          <p className="text-muted-foreground">
            Choose a category from the left to view documentation
          </p>
        </div>
      )
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-sm leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-sm">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="px-1 py-0.5 rounded bg-muted text-xs">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="p-3 rounded-lg bg-muted overflow-x-auto mb-4">
                <code className="text-xs">{children}</code>
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 my-4 italic">
                {children}
              </blockquote>
            )
          }}
        >
          {selectedSection.content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow-lg max-h-96 overflow-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectResult(result.category, result.section)}
                      className="w-full text-left p-3 hover:bg-muted border-b last:border-0"
                    >
                      <div className="text-sm font-medium">{result.section.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.category.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result.match}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-1">
                {adminDocs.map((category) => {
                  const Icon = iconMap[category.icon] || BookOpen
                  const isActive = selectedCategory?.id === category.id
                  
                  return (
                    <div key={category.id}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start mb-1"
                        onClick={() => {
                          setSelectedCategory(category)
                          setSelectedSection(category.sections[0])
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{category.title}</span>
                      </Button>
                      
                      {isActive && (
                        <div className="ml-6 space-y-0.5">
                          {category.sections.map((section) => (
                            <Button
                              key={section.id}
                              variant={selectedSection?.id === section.id ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => setSelectedSection(section)}
                            >
                              <ChevronRight className="h-3 w-3 mr-1" />
                              {section.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {selectedCategory && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Home className="h-3 w-3" />
                    <span>/</span>
                    <span>{selectedCategory.title}</span>
                    {selectedSection && (
                      <>
                        <span>/</span>
                        <span>{selectedSection.title}</span>
                      </>
                    )}
                  </div>
                )}
                <CardTitle>
                  {selectedSection?.title || 'Documentation'}
                </CardTitle>
                {selectedCategory && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
              
              {selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedSection(null)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {renderContent()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}