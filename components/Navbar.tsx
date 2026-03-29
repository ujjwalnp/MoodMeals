"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, User } from "lucide-react"

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface MenuItem {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
}

interface OfferItem {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  discount?: number;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [previewMenu, setPreviewMenu] = useState<MenuItem[]>([])
  const [previewOffers, setPreviewOffers] = useState<OfferItem[]>([])
  const [isOffersOpen, setIsOffersOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Basic session check + load offers, menu preview on mount
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" })
        if (!res.ok) {
          // If session check fails (e.g., not logged in), just treat as no user
          return
        }
        const data = await res.json()
        if (data.user) setUser(data.user as User)
      } catch {
        // Silently ignore session check failures in the navbar
      }
    }

    const loadPreviewOffers = async () => {
      try {
        const res = await fetch("/api/offers")
        if (!res.ok) return
        const data = await res.json()
        setPreviewOffers(Array.isArray(data) ? data.slice(0, 10) : [])
      } catch (err) {
        console.error("[moodmeals] Failed to load offers preview")
      }
    }

    const loadPreviewMenu = async () => {
      try {
        const res = await fetch("/api/menu")
        if (!res.ok) return
        const data = await res.json()
        setPreviewMenu(Array.isArray(data) ? data.slice(0, 10) : [])
      } catch (err) {
        console.error("[moodmeals] Failed to load menu preview")
      }
    }

    checkSession()
    loadPreviewOffers()
    loadPreviewMenu()
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center gap-2">

          {/* Logo and site name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/logo.png" 
              alt="moodmeals logo" 
              width={120} 
              height={40} 
              className="h-8 sm:h-10 md:h-12 w-auto"
              priority 
            />
            <span className="text-xs sm:text-sm md:text-base font-bold text-stone-900 tracking-tight leading-tight">
              <span className="text-amber-600">MOOD</span>
              <span className="text-green-600">MEALS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">

            {/* Desktop-specific Home link */}
            <Link href="/" className="text-stone-600 hover:text-amber-600 font-medium transition-colors">
              Home
            </Link>

            {/* Desktop-specific About link */}
            <Link href="/about" className="text-stone-600 hover:text-amber-600 font-medium transition-colors">
              About
            </Link>
    
            {/* Desktop-specific offers dropdown with preview */}
            <div className="relative group">

              {/* Desktop dropdown trigger */}
              <Link
                href="/offers"
                className="flex items-center text-stone-600 group-hover:text-amber-600 font-medium transition-colors"
              >
                Offers <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {/* Desktop dropdown with featured offers items preview */}
              <div className="absolute top-full left-0 mt-2 w-[420px] bg-white border border-stone-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-3 border-b border-stone-100 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Featured Offers
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-4 py-3 max-h-80 overflow-y-auto">
                  {previewOffers.length === 0 ? (
                    <span className="col-span-2 text-xs text-stone-400">No offers available yet.</span>
                  ) : (
                    previewOffers.map((item: OfferItem) => (
                      <Link
                        key={item.id}
                        href={`/offers/${item.slug || item.id}`}
                        className="text-sm text-stone-600 hover:text-amber-600 py-1 truncate"
                      >
                        {item.title}
                      </Link>
                    ))
                  )}
                </div>
                <div className="px-4 py-3 border-t border-stone-100">
                  <Link
                    href="/offers"
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    View all offers →
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop-specific menu dropdown with preview */}
            <div className="relative group">

              {/* Desktop dropdown trigger */}
              <Link
                href="/menu"
                className="flex items-center text-stone-600 group-hover:text-amber-600 font-medium transition-colors"
              >
                Menu <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {/* Desktop dropdown with featured menu items preview */}
              <div className="absolute top-full left-0 mt-2 w-[420px] bg-white border border-stone-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-3 border-b border-stone-100 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Featured Menu Items
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-4 py-3 max-h-80 overflow-y-auto">
                  {previewMenu.length === 0 ? (
                    <span className="col-span-2 text-xs text-stone-400">No menu items available yet.</span>
                  ) : (
                    previewMenu.map((item: MenuItem) => (
                      <Link
                        key={item.id}
                        href={`/menu/${item.slug || item.id}`}
                        className="text-sm text-stone-600 hover:text-amber-600 py-1 truncate"
                      >
                        {item.title}
                      </Link>
                    ))
                  )}
                </div>
                <div className="px-4 py-3 border-t border-stone-100">
                  <Link
                    href="/menu"
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    View all menu items →
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact link */}
            <Link href="/contact" className="text-stone-600 hover:text-amber-600 font-medium transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Desktop user auth links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={user.role === "admin" ? "/admin" : "/profile"}
                  className="flex items-center space-x-2 text-stone-700 font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST" })
                      window.location.href = "/login"
                    } catch (err) {
                      console.error("Logout failed:", err)
                    }
                  }}
                  className="text-stone-500 hover:text-stone-900 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-orange-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center shrink-0">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-900 p-1.5 touch-manipulation">
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 py-4 px-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* Mobile-specific Home link */}
          <Link 
            href="/" 
            className="block text-stone-900 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Mobile-specific About link */}
          <Link 
            href="/about" 
            className="block text-stone-900 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {/* Mobile-specific offers dropdown */}
          <div className="space-y-2">
            <button
              onClick={() => setIsOffersOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-stone-900 font-medium py-2"
            >
              <span>Offers</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOffersOpen ? "rotate-180" : ""}`} />
            </button>
            {isOffersOpen && (
              <div className="space-y-1 bg-stone-50 rounded-xl border border-stone-100 p-2 max-h-60 overflow-y-auto">
                {previewOffers.length === 0 ? (
                  <span className="block text-xs text-stone-400 px-2 py-2">No offers available yet.</span>
                ) : (
                  previewOffers.map((item: OfferItem) => (
                    <Link
                      key={item.id}
                      href={`/offers/${item.slug || item.id}`}
                      className="block px-3 py-2 text-sm text-stone-700 hover:text-amber-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))
                )}
                <Link
                  href="/offers"
                  className="block px-3 py-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
                  onClick={() => setIsOpen(false)}
                >
                  View all offers →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile-specific menu dropdown */}
          <div className="space-y-2">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-stone-900 font-medium py-2"
            >
              <span>Menu</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isMenuOpen && (
              <div className="space-y-1 bg-stone-50 rounded-xl border border-stone-100 p-2 max-h-60 overflow-y-auto">
                {previewMenu.length === 0 ? (
                  <span className="block text-xs text-stone-400 px-2 py-2">No menu items available yet.</span>
                ) : (
                  previewMenu.map((item: MenuItem) => (
                    <Link
                      key={item.id}
                      href={`/menu/${item.slug || item.id}`}
                      className="block px-3 py-2 text-sm text-stone-700 hover:text-amber-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))
                )}
                <Link
                  href="/menu"
                  className="block px-3 py-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
                  onClick={() => setIsOpen(false)}
                >
                  View all menu items →
                </Link>
              </div>
            )}
          </div>

          {/* Contact link */}
          <Link 
            href="/contact" 
            className="block text-stone-900 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

           {/* User auth links */}
          <div className="pt-4 border-t border-stone-100">
            {user ? (
              <>
                <Link 
                  href={user.role === "admin" ? "/admin" : "/profile"}
                  className="block text-amber-600 font-bold py-2"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST" })
                      window.location.href = "/login"
                    } catch (err) {
                      console.error("Logout failed:", err)
                    }
                  }}
                  className="block w-full text-left text-stone-500 hover:text-stone-900 font-medium py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="group relative block text-center bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-orange-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}