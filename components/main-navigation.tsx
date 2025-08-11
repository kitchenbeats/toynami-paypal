"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  sort_order: number;
}

export function MainNavigation() {
  const [navigationItems, setNavigationItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      const supabase = createClient();
      
      // Get the header menu
      const { data: menu } = await supabase
        .from('menus')
        .select('id')
        .eq('location', 'header')
        .eq('is_active', true)
        .single();
      
      if (menu) {
        // Get menu items
        const { data: items } = await supabase
          .from('menu_items')
          .select('id, title, url, sort_order')
          .eq('menu_id', menu.id)
          .eq('is_active', true)
          .is('parent_id', null)
          .order('sort_order');
        
        if (items) {
          setNavigationItems(items);
        }
      }
      
      setLoading(false);
    }
    
    loadMenu();
  }, []);

  // Fallback navigation if database is empty
  const fallbackItems = [
    { id: '1', title: "ALL PRODUCTS", url: "/products", sort_order: 1 },
    { id: '2', title: "BRANDS", url: "/brands", sort_order: 2 },
    { id: '3', title: "ON SALE", url: "/on-sale", sort_order: 3 },
    { id: '4', title: "CONVENTION EXCLUSIVES", url: "/convention-exclusives", sort_order: 4 },
    { id: '5', title: "NEW PRODUCTS", url: "/new-products", sort_order: 5 },
    { id: '6', title: "THE ARCHIVE", url: "/the-archive", sort_order: 6 },
    { id: '7', title: "ANNOUNCEMENTS", url: "/announcements", sort_order: 7 },
  ];

  const items = navigationItems.length > 0 ? navigationItems : fallbackItems;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="main-nav-wrapper">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block text-white" style={{ backgroundColor: 'var(--toynami-dark)' }}>
        <div className="max-w-7xl mx-auto">
          <ul className="flex items-center justify-center space-x-8 py-3">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-sm font-medium hover:text-blue-400 transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Menu Button */}
        <div className="text-white py-3" style={{ backgroundColor: 'var(--toynami-dark)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-sm font-medium"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>MENU</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <nav
            id="mobile-menu"
            className="text-white border-t border-gray-700"
            style={{ backgroundColor: 'var(--toynami-dark)' }}
          >
            <div className="max-w-7xl mx-auto py-4">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className="block px-4 py-2 text-sm font-medium hover:bg-black/20 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}