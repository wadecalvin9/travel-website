"use client"

import React from "react"

// Simple settings management with fallbacks
export interface SiteSettings {
  // Branding
  site_name: string
  site_tagline: string
  site_logo: string
  favicon: string

  // Theme Colors
  primary_color: string
  secondary_color: string
  accent_color: string

  // Hero Section
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_background_image: string
  hero_video_url: string

  // Contact Information
  contact_phone_primary: string
  contact_email_primary: string
  contact_address: string
  whatsapp_number: string

  // Social Media
  social_facebook: string
  social_instagram: string
  social_twitter: string

  // Map Settings
  map_embed_url: string

  // Footer Content
  footer_description: string
  footer_copyright: string

  // Feature Toggles - Default to enabled
  chat_widget_enabled?: string
  newsletter_enabled?: string
  reviews_enabled?: string
  testimonials_show_count?: string
  testimonials_auto_approve?: string
  booking_calendar_enabled?: string
  dark_mode_enabled?: string
}

// Default settings that always work
export const DEFAULT_SETTINGS: SiteSettings = {
  // Branding
  site_name: "Travel Connect Expeditions",
  site_tagline: "African Safari Adventures",
  site_logo: "/placeholder.svg?height=60&width=200",
  favicon: "/favicon.ico",

  // Theme Colors
  primary_color: "#16a34a",
  secondary_color: "#059669",
  accent_color: "#f59e0b",

  // Hero Section
  hero_title: "Discover Africa's Wild Heart",
  hero_subtitle: "Embark on unforgettable safari adventures across East and Southern Africa",
  hero_cta_text: "Explore Packages",
  hero_background_image:
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
  hero_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Default video URL

  // Contact Information
  contact_phone_primary: "+254 700 123 456",
  contact_email_primary: "info@travelconnectexpeditions.com",
  contact_address: "Safari Center, 2nd Floor\nNairobi, Kenya\nP.O. Box 12345-00100",
  whatsapp_number: "+254700123456",

  // Social Media
  social_facebook: "https://facebook.com/travelconnectexpeditions",
  social_instagram: "https://instagram.com/travelconnectexpeditions",
  social_twitter: "https://twitter.com/travelconnectexp",

  // Map Settings
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8197!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OSczMS4wIkU!5e0!3m2!1sen!2ske!4v1234567890",

  // Footer Content
  footer_description: "Creating unforgettable safari experiences across Africa since 2010.",
  footer_copyright: "© 2024 Travel Connect Expeditions. All rights reserved.",

  // Feature Toggles - Default to enabled
  chat_widget_enabled: "true",
  newsletter_enabled: "true",
  reviews_enabled: "true",
  testimonials_show_count: "6",
  testimonials_auto_approve: "false",
  booking_calendar_enabled: "true",
  dark_mode_enabled: "true",
}

// Simple function to get settings with fallback
export async function getSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch("/api/admin/settings")
    if (response.ok) {
      const settings = await response.json()
      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_SETTINGS, ...settings }
    }
  } catch (error) {
    console.warn("Failed to load settings, using defaults:", error)
  }

  return DEFAULT_SETTINGS
}

// Client-side settings hook
export function useSettings() {
  const [settings, setSettings] = React.useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
