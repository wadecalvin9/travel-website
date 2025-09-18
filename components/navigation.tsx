"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Phone, Mail, Menu, X } from "lucide-react"

function Navigation() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    // Fetch settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings || {})
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  const siteName = settings.site_name || "Travel Connect Expeditions"

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-luxury text-white py-2 text-sm">
        <div className="container-premium flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-4 sm:gap-6">
            {settings.contact_phone_primary && (
              <a
                href={`tel:${settings.contact_phone_primary}`}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{settings.contact_phone_primary}</span>
              </a>
            )}
            {settings.contact_email_primary && (
              <a
                href={`mailto:${settings.contact_email_primary}`}
                className="flex items-center gap-2 hover:text-amber-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">{settings.contact_email_primary}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-200 text-xs sm:text-sm">🏆 Award-Winning Safari Experiences</span>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200"
                >
                  <Icons.facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200"
                >
                  <Icons.instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200"
                >
                  <Icons.twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container-premium">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              {settings.site_logo ? (
                <img
                  src={settings.site_logo || "/placeholder.svg"}
                  alt={siteName}
                  className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-luxury rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-lg sm:text-xl font-bold text-white font-display">{siteName.charAt(0)}</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-display font-bold text-xl text-gray-900">{siteName}</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {settings.site_tagline || "Premium Safari Experiences"}
                    </div>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {siteConfig.mainNav?.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`relative font-medium transition-colors hover:text-orange-600 ${
                    pathname === item.href ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {item.title}
                  {pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-luxury rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* User Menu - WORKING VERSION */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 h-auto px-3 py-2 rounded-full hover:bg-gray-50 border border-gray-200 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-luxury flex items-center justify-center shadow-md">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden lg:block font-medium text-gray-700">
                      {user.name || user.email?.split("@")[0] || "User"}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="block px-4 py-2 text-orange-600 hover:bg-gray-100">
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Button variant="ghost" size="sm" asChild className="font-medium">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-luxury text-white rounded-xl px-6 font-medium">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="lg:hidden p-2">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="p-6 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{siteName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-display font-bold text-lg">{siteName}</div>
                          <div className="text-xs text-gray-500">Premium Safari Experiences</div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6">
                      <nav className="space-y-2 px-6">
                        {siteConfig.mainNav?.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block py-3 px-4 rounded-xl font-medium transition-colors ${
                              pathname === item.href ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </nav>

                      {/* Mobile Auth */}
                      {!user && (
                        <div className="px-6 mt-8 space-y-3">
                          <Button asChild className="w-full bg-gradient-luxury text-white rounded-xl">
                            <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                              Get Started
                            </Link>
                          </Button>
                          <Button variant="outline" asChild className="w-full rounded-xl">
                            <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                              Sign In
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Contact */}
                    <div className="p-6 border-t bg-gray-50">
                      <div className="space-y-3">
                        {settings.contact_phone_primary && (
                          <a
                            href={`tel:${settings.contact_phone_primary}`}
                            className="flex items-center gap-3 text-sm text-gray-600"
                          >
                            <Phone className="w-4 h-4" />
                            {settings.contact_phone_primary}
                          </a>
                        )}
                        {settings.contact_email_primary && (
                          <a
                            href={`mailto:${settings.contact_email_primary}`}
                            className="flex items-center gap-3 text-sm text-gray-600"
                          >
                            <Mail className="w-4 h-4" />
                            {settings.contact_email_primary}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navigation
export { Navigation }
