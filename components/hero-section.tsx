"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Play, Star, Users, Award, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSettings {
  hero_title?: string
  hero_subtitle?: string
  hero_cta_text?: string
  hero_cta_url?: string
  hero_background_image?: string
  hero_video_url?: string
  hero_overlay_opacity?: string
  hero_text_alignment?: string
}

export function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings || {})
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleVideoClick = () => {
    if (settings.hero_video_url) {
      // Open video in new tab/window
      window.open(settings.hero_video_url, "_blank", "noopener,noreferrer")
    }
  }

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="loading-shimmer w-full h-full absolute inset-0" />
        <div className="relative z-10 text-center">
          <div className="loading-shimmer h-16 w-96 rounded-xl mx-auto mb-6" />
          <div className="loading-shimmer h-8 w-128 rounded-lg mx-auto mb-8" />
          <div className="loading-shimmer h-14 w-48 rounded-xl mx-auto" />
        </div>
      </section>
    )
  }

  const backgroundImage =
    settings.hero_background_image ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"

  const overlayOpacity = Number.parseFloat(settings.hero_overlay_opacity || "0.4")

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[20s] hover:scale-110"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-black via-black/50 to-transparent"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-amber-400/20 rounded-full blur-lg animate-pulse delay-500" />

      {/* Hero Content */}
      <div className="relative z-10 container-premium text-center px-4">
        {/* Premium Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <Badge className="glass-effect text-white border-white/30 px-6 py-2 text-sm font-medium rounded-full">
            <Award className="w-4 h-4 mr-2" />
            Award-Winning Safari Experiences
          </Badge>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 sm:mb-8 animate-fade-in font-display leading-tight">
          {settings.hero_title || (
            <>
              <span className="block">Discover Africa's</span>
              <span className="block text-gradient bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Wild Heart
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-4xl mx-auto animate-fade-in leading-relaxed px-4">
          {settings.hero_subtitle ||
            "Embark on extraordinary safari adventures across East and Southern Africa with expert guides, luxury accommodations, and unforgettable wildlife encounters."}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 animate-fade-in px-4">
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm text-gray-300">Happy Travelers</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-gray-300">Destinations</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in px-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-gradient-luxury hover:shadow-luxury text-white border-0 px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 focus-ring"
          >
            <Link href={settings.hero_cta_url || "/packages"}>
              {settings.hero_cta_text || "Explore Safari Packages"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {settings.hero_video_url && (
            <Button
              onClick={handleVideoClick}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto glass-effect text-white border-white/30 hover:bg-white/20 px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 focus-ring cursor-pointer"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in">
          <p className="text-gray-300 text-sm mb-6">Trusted by travelers worldwide</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60">
            <div className="text-white font-semibold text-sm">TripAdvisor Excellence</div>
            <div className="hidden sm:block w-px h-6 bg-white/30" />
            <div className="text-white font-semibold text-sm">Safari Awards 2024</div>
            <div className="hidden sm:block w-px h-6 bg-white/30" />
            <div className="text-white font-semibold text-sm">Eco-Certified</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
