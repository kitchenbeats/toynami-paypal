"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface UrlTabsProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, 'value' | 'onValueChange'> {
  defaultTab?: string
  tabParam?: string
  children: React.ReactNode
}

interface UrlTabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
  tabParam: string
}

const UrlTabsContext = React.createContext<UrlTabsContextType | undefined>(undefined)

function UrlTabs({ 
  defaultTab, 
  tabParam = 'tab', 
  className, 
  children,
  ...props 
}: UrlTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get the active tab from URL or use default
  const urlTab = searchParams.get(tabParam)
  const activeTab = urlTab || defaultTab || ''
  
  const setActiveTab = React.useCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value === defaultTab) {
      // If switching to default tab, remove the param
      params.delete(tabParam)
    } else {
      params.set(tabParam, value)
    }
    
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(url, { scroll: false })
  }, [router, pathname, searchParams, tabParam, defaultTab])
  
  const contextValue = React.useMemo(() => ({
    activeTab,
    setActiveTab,
    tabParam
  }), [activeTab, setActiveTab, tabParam])
  
  return (
    <UrlTabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        data-slot="url-tabs"
        className={cn("flex flex-col gap-2", className)}
        value={activeTab}
        onValueChange={setActiveTab}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </UrlTabsContext.Provider>
  )
}

function UrlTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="url-tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

interface UrlTabsTriggerProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, 'value'> {
  value: string
}

function UrlTabsTrigger({
  className,
  value,
  ...props
}: UrlTabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="url-tabs-trigger"
      value={value}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

interface UrlTabsContentProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Content>, 'value'> {
  value: string
}

function UrlTabsContent({
  className,
  value,
  ...props
}: UrlTabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="url-tabs-content"
      value={value}
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

// Hook to access the tabs context
function useUrlTabs() {
  const context = React.useContext(UrlTabsContext)
  if (context === undefined) {
    throw new Error('useUrlTabs must be used within a UrlTabs component')
  }
  return context
}

export { UrlTabs, UrlTabsList, UrlTabsTrigger, UrlTabsContent, useUrlTabs }