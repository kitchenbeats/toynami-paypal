import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Youtube } from "lucide-react";

async function getFooterData() {
  const supabase = await createClient();
  
  // Get settings
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('category', ['social', 'general'])
    .eq('is_public', true);
  
  // Convert settings array to object
  const settingsObj: Record<string, string> = {};
  settings?.forEach(setting => {
    if (setting.value) {
      settingsObj[setting.key] = setting.value;
    }
  });
  
  // Get footer menu
  const { data: menu } = await supabase
    .from('menus')
    .select('id')
    .eq('location', 'footer')
    .eq('is_active', true)
    .single();
  
  let menuItems = [];
  if (menu) {
    // Get menu items
    const { data: items } = await supabase
      .from('menu_items')
      .select('id, title, url, sort_order')
      .eq('menu_id', menu.id)
      .eq('is_active', true)
      .is('parent_id', null)
      .order('sort_order');
    
    menuItems = items || [];
  }
  
  return { settings: settingsObj, menuItems };
}

export async function SiteFooterNew() {
  const { settings } = await getFooterData();
  
  return (
    <footer className="footer relative mt-12" style={{ backgroundColor: 'var(--toynami-dark)', marginTop: '46px' }}>
      {/* Footer Arch Background */}
      <div className="footer-arch absolute top-0 left-0 w-full overflow-hidden pointer-events-none" style={{ height: '163px' }}>
        {/* Copyright positioned in the arch */}
        <div className="footer-copyright absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm z-10">
          {settings.footer_copyright || '© 2025 Toynami Inc'}
        </div>
        <svg
          className="footer-arch-svg absolute left-1/2 transform -translate-x-1/2"
          width="468"
          height="163"
          viewBox="0 0 468 163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M234 0C105.217 0 0 36.4365 0 81.5C0 126.563 105.217 163 234 163C362.783 163 468 126.563 468 81.5C468 36.4365 362.783 0 234 0Z"
            fill="var(--toynami-primary-blue)"
            opacity="0.1"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content relative z-10 text-white" style={{ paddingTop: '100px' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
            
            {/* Mobile Logo (visible on mobile, hidden on desktop) */}
            <div className="lg:hidden mb-8 text-center">
              <Image
                src="/images/toynami-logo.webp"
                alt="Toynami Inc"
                width={190}
                height={46}
                className="mx-auto mb-4"
              />
              {/* Social icons under mobile logo */}
              <div className="flex justify-center gap-4">
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.social_linkedin && (
                  <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* LEFT: Navigation Links */}
            <div className="footer-col footer-col--navigation">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Series Section */}
                <div className="footer-nav-section">
                  <h5 className="font-semibold mb-3 text-blue-400">Series</h5>
                  <div className="space-y-2">
                    <Link href="/convention-exclusives" className="block text-sm hover:text-blue-400 transition-colors">
                      Convention Exclusives
                    </Link>
                    <Link href="/new-products" className="block text-sm hover:text-blue-400 transition-colors">
                      New Products
                    </Link>
                    <Link href="/on-sale" className="block text-sm hover:text-blue-400 transition-colors">
                      On Sale
                    </Link>
                  </div>
                </div>

                {/* Company Section */}
                <div className="footer-nav-section">
                  <h5 className="font-semibold mb-3 text-blue-400">Company</h5>
                  <div className="space-y-2">
                    <Link href="/privacy" className="block text-sm hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </Link>
                    <Link href="/shipping" className="block text-sm hover:text-blue-400 transition-colors">
                      Shipping & Returns
                    </Link>
                    <Link href="/about" className="block text-sm hover:text-blue-400 transition-colors">
                      About Us
                    </Link>
                    <Link href="/faq" className="block text-sm hover:text-blue-400 transition-colors">
                      FAQ
                    </Link>
                    <Link href="/contact" className="block text-sm hover:text-blue-400 transition-colors">
                      Contact Us
                    </Link>
                    <Link href="/wholesale" className="block text-sm hover:text-blue-400 transition-colors">
                      Wholesale
                    </Link>
                  </div>
                </div>

                {/* Account Section */}
                <div className="footer-nav-section">
                  <h5 className="font-semibold mb-3 text-blue-400">Account</h5>
                  <div className="space-y-2">
                    <Link href="/auth/login" className="block text-sm hover:text-blue-400 transition-colors">
                      Login
                    </Link>
                    <Link href="/auth/sign-up" className="block text-sm hover:text-blue-400 transition-colors">
                      Sign Up
                    </Link>
                    <Link href="/pre-orders" className="block text-sm hover:text-blue-400 transition-colors">
                      Pre-Orders
                    </Link>
                    <Link href="/vip" className="block text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-semibold">
                      VIP Only
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE: Logo and Social (hidden on mobile, visible on desktop) */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              <Image
                src="/images/toynami-logo.webp"
                alt="Toynami Inc"
                width={190}
                height={46}
                className="mb-6"
              />
              
              {/* Social icons under desktop logo */}
              <div className="flex gap-4">
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.social_linkedin && (
                  <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT: Newsletter Signup */}
            <div className="footer-col footer-col--newsletter">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h5 className="font-semibold mb-2 text-blue-400">
                  {settings.footer_newsletter_title || 'Sign Up For Our Mailing List'}
                </h5>
                <p className="text-sm mb-4 text-gray-300">
                  {settings.footer_newsletter_text || 'Stay up to date with the latest news and product releases.'}
                </p>
                
                <form className="space-y-3" action="/api/newsletter" method="POST">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="px-3 py-2 bg-gray-700 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="px-3 py-2 bg-gray-700 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 bg-gray-700 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
            <p>{settings.footer_copyright || '© 2025 Toynami Inc. All rights reserved.'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}