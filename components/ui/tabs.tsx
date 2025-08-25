"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface TabsProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, 'value' | 'onValueChange'> {
  defaultValue?: string
  urlSync?: boolean // Enable URL synchronization
  paramName?: string // URL parameter name (default: 'tab')
  variant?: 'default' | 'pills' | 'underline' | 'buttons'
  children: React.ReactNode
}

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
  urlSync: boolean
  paramName: string
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

function Tabs({ 
  defaultValue = '', 
  urlSync = true,
  paramName = 'tab',
  variant = 'buttons',
  className, 
  children,
  ...props 
}: TabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get the active tab from URL or use default
  const urlTab = urlSync ? searchParams.get(paramName) : null
  const [localTab, setLocalTab] = React.useState(defaultValue)
  const activeTab = urlTab || localTab || defaultValue
  
  const setActiveTab = React.useCallback((value: string) => {
    if (urlSync) {
      const params = new URLSearchParams(searchParams)
      
      if (value === defaultValue) {
        // If switching to default tab, remove the param
        params.delete(paramName)
      } else {
        params.set(paramName, value)
      }
      
      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname
      
      router.push(url, { scroll: false })
    } else {
      setLocalTab(value)
    }
  }, [router, pathname, searchParams, paramName, defaultValue, urlSync])
  
  const contextValue = React.useMemo(() => ({
    activeTab,
    setActiveTab,
    urlSync,
    paramName
  }), [activeTab, setActiveTab, urlSync, paramName])
  
  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        data-variant={variant}
        className={cn("w-full", className)}
        value={activeTab}
        onValueChange={setActiveTab}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  variant = 'buttons',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: 'default' | 'pills' | 'underline' | 'buttons'
}) {
  const variantStyles = {
    default: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
    pills: "inline-flex h-10 items-center gap-1",
    underline: "inline-flex h-10 items-center justify-start border-b",
    buttons: "inline-flex h-10 items-center justify-center p-0 bg-muted/30 rounded-lg w-full"
  }
  
  return (
    <TabsPrimitive.List
      data-variant={variant}
      className={cn(variantStyles[variant], className)}
      {...props}
    />
  )
}

interface TabsTriggerProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, 'value'> {
  value: string
  variant?: 'default' | 'pills' | 'underline' | 'buttons'
}

function TabsTrigger({
  className,
  value,
  variant = 'buttons',
  ...props
}: TabsTriggerProps) {
  const variantStyles = {
    default: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    ),
    pills: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
    ),
    underline: cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground"
    ),
    buttons: cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
      "first:rounded-l-lg last:rounded-r-lg border-r last:border-r-0 border-muted-foreground/20",
      "hover:bg-muted/50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-r-transparent"
    )
  }
  
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(variantStyles[variant], className)}
      {...props}
    />
  )
}

interface TabsContentProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Content>, 'value'> {
  value: string
}

function TabsContent({
  className,
  value,
  ...props
}: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

// Hook to access the tabs context
function useTabs() {
  const context = React.useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a Tabs component')
  }
  return context
}

export { Tabs, TabsList, TabsTrigger, TabsContent, useTabs }