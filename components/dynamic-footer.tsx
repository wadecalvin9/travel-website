"use client"

import React from "react"
import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface SiteSettings {
  site_name?: string
  footer_description?: string
  footer_copyright?: string
  contact_phone_primary?: string
  contact_email_primary?: string
  contact_address?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
}

export function DynamicFooter(): ReactElement {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      console.log("Footer: Fetching settings…")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 s timeout

      const res = await fetch("/api/admin/settings", {
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "application/json" },
      })

      clearTimeout(timeoutId)

      // ---- Guard: must be JSON & 2xx -----------------------------
      const isJSON = res.headers.get("content-type")?.includes("application/json") ?? false

      if (!res.ok || !isJSON) {
        throw new Error(`Unexpected response – status ${res.status}, content-type: ${res.headers.get("content-type")}`)
      }

      const { settings: loaded } = await res.json()
      console.log("Footer: Settings loaded:", loaded)

      if (loaded && typeof loaded === "object") {
        setSettings(loaded)
      }
    } catch (err) {
      console.warn("Footer: Failed to fetch settings – using defaults.", err)
      // Set fallback defaults
      setSettings({
        site_name: "Travel Connect Expeditions",
        footer_description:
          "Creating extraordinary safari experiences across East and Southern Africa with expert guides and carefully crafted itineraries.",
        footer_copyright: "© 2024 Travel Connect Expeditions. All rights reserved.",
        contact_phone_primary: "+254 700 123 456",
        contact_email_primary: "info@travelconnectexpeditions.com",
        contact_address: "Safari Center, 2nd Floor\nNairobi, Kenya\nP.O. Box 12345-00100",
        social_facebook: "https://facebook.com/travelconnectexpeditions",
        social_instagram: "https://instagram.com/travelconnectexpeditions",
        social_twitter: "https://twitter.com/travelconnectexp",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-amber-900/20 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="h-6 bg-gray-700 rounded mb-4 w-64"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-700 rounded mb-6 w-3/4"></div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                  <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                  <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                </div>
              </div>
              <div>
                <div className="h-5 bg-gray-700 rounded mb-4 w-32"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-40"></div>
                  <div className="h-4 bg-gray-700 rounded w-48"></div>
                  <div className="h-4 bg-gray-700 rounded w-36"></div>
                </div>
              </div>
              <div>
                <div className="h-5 bg-gray-700 rounded mb-4 w-28"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-28"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const siteName = settings.site_name || "Travel Connect Expeditions"

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-amber-900/20 to-gray-900" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">{siteName.charAt(0)}</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {siteName}
              </h3>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              {settings.footer_description ||
                "Creating extraordinary safari experiences across East and Southern Africa with expert guides and carefully crafted itineraries."}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Contact Info
            </h4>
            <div className="space-y-4 text-gray-300">
              {settings.contact_phone_primary && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <a href={`tel:${settings.contact_phone_primary}`} className="hover:text-orange-400 transition-colors">
                    {settings.contact_phone_primary}
                  </a>
                </div>
              )}
              {settings.contact_email_primary && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <a
                    href={`mailto:${settings.contact_email_primary}`}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {settings.contact_email_primary}
                  </a>
                </div>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="leading-relaxed">
                    {settings.contact_address.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < settings.contact_address!.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <div className="space-y-3">
              <Link
                href="/packages"
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-300"
              >
                Safari Packages
              </Link>
              <Link
                href="/destinations"
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-300"
              >
                Destinations
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-orange-400 transition-colors duration-300">
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-300"
              >
                Contact
              </Link>
              <Link
                href="/testimonials"
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-300"
              >
                Testimonials
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            {settings.footer_copyright || "© 2024 Travel Connect Expeditions. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
