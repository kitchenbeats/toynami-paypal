"use client"

import { UrlTabs, UrlTabsList, UrlTabsTrigger, UrlTabsContent, useUrlTabs } from './url-tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Settings, User, Mail } from 'lucide-react'

// Component that uses the useUrlTabs hook
function TabInfo() {
  const { activeTab, setActiveTab } = useUrlTabs()
  
  return (
    <div className="mb-4 p-3 bg-muted rounded">
      <p className="text-sm">Current tab: <strong>{activeTab}</strong></p>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={() => setActiveTab('profile')}>
          Go to Profile
        </Button>
        <Button size="sm" variant="outline" onClick={() => setActiveTab('settings')}>
          Go to Settings
        </Button>
      </div>
    </div>
  )
}

// Test component for the URL Tabs
export function UrlTabsTest() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">URL Tabs Test Component</h1>
      
      <UrlTabs defaultTab="profile" tabParam="section">
        <TabInfo />
        
        <UrlTabsList className="grid w-full grid-cols-3 mb-6">
          <UrlTabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </UrlTabsTrigger>
          <UrlTabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </UrlTabsTrigger>
          <UrlTabsTrigger value="notifications">
            <Mail className="h-4 w-4 mr-2" />
            Notifications
          </UrlTabsTrigger>
        </UrlTabsList>
        
        <UrlTabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the profile tab content. When this tab is active, no query parameter should appear in the URL since it&apos;s the default tab.</p>
            </CardContent>
          </Card>
        </UrlTabsContent>
        
        <UrlTabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure your application preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the settings tab content. When this tab is active, the URL should show ?section=settings</p>
            </CardContent>
          </Card>
        </UrlTabsContent>
        
        <UrlTabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the notifications tab content. When this tab is active, the URL should show ?section=notifications</p>
            </CardContent>
          </Card>
        </UrlTabsContent>
      </UrlTabs>
      
      <div className="mt-8 p-4 bg-muted rounded">
        <h2 className="font-semibold mb-2">Test Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click between tabs and observe the URL changes</li>
          <li>The Profile tab (default) should not add query parameters</li>
          <li>Settings and Notifications tabs should add ?section=tabname</li>
          <li>Use browser back/forward buttons to navigate through tabs</li>
          <li>Refresh the page to see that the tab state persists</li>
          <li>Try the &quot;Go to&quot; buttons above the tabs</li>
        </ol>
      </div>
    </div>
  )
}