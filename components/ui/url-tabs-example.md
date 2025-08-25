# URL-Aware Tabs Component

A reusable tabs component that syncs tab state with the URL query parameters, providing bookmarkable URLs and browser history support.

## Features

- **URL Synchronization**: Tab state is reflected in the URL via query parameters
- **Bookmarkable**: Users can bookmark specific tabs and share them
- **Browser History**: Supports back/forward navigation through tabs
- **Default Tab Support**: Can specify a default tab that doesn't appear in the URL
- **Custom Parameter**: Configurable URL parameter name (defaults to 'tab')
- **Built on Radix**: Uses the same Radix UI primitives as the standard shadcn tabs

## Usage

### Basic Example

```tsx
import { UrlTabs, UrlTabsList, UrlTabsTrigger, UrlTabsContent } from '@/components/ui/url-tabs'

function MyComponent() {
  return (
    <UrlTabs defaultTab="overview">
      <UrlTabsList>
        <UrlTabsTrigger value="overview">Overview</UrlTabsTrigger>
        <UrlTabsTrigger value="details">Details</UrlTabsTrigger>
        <UrlTabsTrigger value="settings">Settings</UrlTabsTrigger>
      </UrlTabsList>
      
      <UrlTabsContent value="overview">
        <div>Overview content...</div>
      </UrlTabsContent>
      
      <UrlTabsContent value="details">
        <div>Details content...</div>
      </UrlTabsContent>
      
      <UrlTabsContent value="settings">
        <div>Settings content...</div>
      </UrlTabsContent>
    </UrlTabs>
  )
}
```

### Advanced Example with Custom Parameter

```tsx
<UrlTabs defaultTab="basic" tabParam="section">
  <UrlTabsList className="grid w-full grid-cols-3">
    <UrlTabsTrigger value="basic">
      <Package className="h-4 w-4 mr-2" />
      Basic Info
    </UrlTabsTrigger>
    <UrlTabsTrigger value="advanced">
      <Settings className="h-4 w-4 mr-2" />
      Advanced
    </UrlTabsTrigger>
    <UrlTabsTrigger value="reports">
      <BarChart className="h-4 w-4 mr-2" />
      Reports
    </UrlTabsTrigger>
  </UrlTabsList>
  
  {/* Tab content... */}
</UrlTabs>
```

This would create URLs like:
- `/page` (default tab, no query param)
- `/page?section=advanced`
- `/page?section=reports`

### Using the Hook

You can access the current tab state from within the component tree:

```tsx
import { useUrlTabs } from '@/components/ui/url-tabs'

function TabAwareComponent() {
  const { activeTab, setActiveTab } = useUrlTabs()
  
  return (
    <div>
      Current tab: {activeTab}
      <button onClick={() => setActiveTab('settings')}>
        Go to Settings
      </button>
    </div>
  )
}
```

## Props

### UrlTabs

- `defaultTab?: string` - The default tab to show when no URL parameter is present
- `tabParam?: string` - The URL parameter name to use (defaults to 'tab')
- All other props from Radix Tabs Root component

### UrlTabsTrigger

- `value: string` - The tab value (required)
- All other props from Radix Tabs Trigger component

### UrlTabsContent

- `value: string` - The tab value (required)
- All other props from Radix Tabs Content component

## URL Behavior

- When the default tab is active, no query parameter is added to the URL
- When any other tab is active, the `tabParam` query parameter is added
- The component preserves other existing query parameters
- Navigation is done with `router.push()` with `scroll: false` to maintain position

## Migration from Standard Tabs

To migrate from the standard shadcn Tabs component:

1. Replace imports:
   ```tsx
   // Before
   import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
   
   // After
   import { UrlTabs, UrlTabsList, UrlTabsTrigger, UrlTabsContent } from '@/components/ui/url-tabs'
   ```

2. Replace component names and remove value/onValueChange props:
   ```tsx
   // Before
   <Tabs value={activeTab} onValueChange={setActiveTab}>
   
   // After
   <UrlTabs defaultTab="first-tab">
   ```

3. Add `value` prop to triggers and content:
   ```tsx
   // Before
   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
   <TabsContent value="tab1">Content</TabsContent>
   
   // After (same, but required)
   <UrlTabsTrigger value="tab1">Tab 1</UrlTabsTrigger>
   <UrlTabsContent value="tab1">Content</UrlTabsContent>
   ```