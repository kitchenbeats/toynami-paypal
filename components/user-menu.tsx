"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, ChevronDown, LogOut, Shield, Settings, Heart, Package } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

interface UserMenuProps {
  user: any;
  profile: { is_admin?: boolean } | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-primary transition-colors relative"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <User className={`h-5 w-5 ${user ? 'text-blue-500' : ''}`} />
          {user && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full border border-white"></span>
          )}
        </div>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border-2 border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
          {user ? (
            // Logged in menu
            <div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                <p className="text-white/80 text-xs">Signed in as</p>
                <p className="text-white font-semibold text-sm truncate">{user.email}</p>
              </div>
              
              <div className="py-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">My Account</span>
                </Link>
              
                <Link
                  href="/account?tab=orders"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">My Orders</span>
                </Link>
              
                <Link
                  href="/account?tab=wishlist"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">Wishlist</span>
                </Link>

                {profile?.is_admin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-4 w-4 text-purple-500 group-hover:text-purple-600" />
                    <span className="font-medium text-purple-600 group-hover:text-purple-700">Admin Panel</span>
                  </Link>
                )}
              </div>

              <div className="border-t-2 border-gray-100 p-2">
                <LogoutButton className="w-full" />
              </div>
            </div>
          ) : (
            // Not logged in menu
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">Welcome! Please sign in to access your account.</p>
              <Link
                href="/auth/login"
                className="block w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors text-center mb-2"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/sign-up"
                className="block w-full px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}