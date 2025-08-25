'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard,
  Package,
  ShoppingCart, 
  Users,
  FileText, 
  Settings,
  TrendingUp, 
  Menu,
  X,
  ChevronDown,
  BookOpen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/new' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Brands', href: '/admin/brands' },
      { name: 'Global Options', href: '/admin/options' },
    ]
  },
  {
    name: 'Orders & Shipping',
    icon: ShoppingCart,
    children: [
      { name: 'Shop Orders', href: '/admin/orders' },
      { name: 'ShipStation Shipments', href: '/admin/shipments' },
      { name: 'Tax Settings', href: '/admin/tax-settings' },
    ]
  },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Media Library', href: '/admin/media' },
      { name: 'Banners', href: '/admin/banners' },
      { name: 'Blog & Announcements', href: '/admin/blog' },
      { name: 'Carousel Slides', href: '/admin/carousel' },
      { name: 'Pages', href: '/admin/pages' },
    ]
  },
  {
    name: 'Customers',
    icon: Users,
    children: [
      { name: 'All Customers', href: '/admin/customers' },
      { name: 'Customer Groups', href: '/admin/customer-groups' },
    ]
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    children: [
      { name: 'Promotions', href: '/admin/promotions' },
      { name: 'Coupons', href: '/admin/coupons' },
      { name: 'Email Campaigns', href: '/admin/email' },
    ]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Documentation',
    href: '/admin/docs',
    icon: BookOpen,
  }
]

export function AdminNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (name: string) => {
    setExpandedSections(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const isSectionActive = (children: Array<{ href: string }>) => {
    return children.some(child => isActive(child.href))
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo/Title */}
          <div className="flex h-16 items-center px-6 border-b">
            <h2 className="text-xl font-bold">Toynami Admin</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const hasChildren = !!item.children
              const isExpanded = expandedSections.includes(item.name)
              const sectionActive = hasChildren && isSectionActive(item.children)

              if (hasChildren) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={cn(
                        "w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        sectionActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition-colors",
                              isActive(child.href)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href!, item.exact)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}