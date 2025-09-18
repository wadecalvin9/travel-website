"use client"

import { useState, useEffect } from "react"
import { PackageCard } from "./package-card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Package {
  id: number
  title: string
  description: string
  price: number
  duration_days: number
  image_url: string
  destination_name?: string
  country?: string
}

// Helper function to get appropriate safari images
function getPackageImage(title: string, originalUrl?: string) {
  if (originalUrl && !originalUrl.includes("placeholder.svg")) {
    return originalUrl
  }

  const imageMap: Record<string, string> = {
    "Great Migration Safari":
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&crop=center",
    "Big Five Adventure": "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop&crop=center",
    "Kruger Explorer": "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop&crop=center",
    "Okavango Delta Experience":
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop&crop=center",
  }

  const matchingKey = Object.keys(imageMap).find((key) => title.toLowerCase().includes(key.toLowerCase().split(" ")[0]))

  return matchingKey
    ? imageMap[matchingKey]
    : "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&crop=center"
}

export function FeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedPackages() {
      try {
        const response = await fetch("/api/packages?featured=true")
        if (response.ok) {
          const data = await response.json()
          const packagesWithImages = data.slice(0, 3).map((pkg: Package) => ({
            ...pkg,
            image_url: getPackageImage(pkg.title, pkg.image_url),
          }))
          setPackages(packagesWithImages)
        }
      } catch (error) {
        console.error("Error fetching featured packages:", error)
        // Fallback packages with good images
        setPackages([
          {
            id: 1,
            title: "Great Migration Safari",
            description: "Witness the spectacular Great Migration in Serengeti National Park",
            price: 2499,
            duration_days: 7,
            image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&crop=center",
          },
          {
            id: 2,
            title: "Big Five Adventure",
            description: "Complete Big Five safari experience in Masai Mara",
            price: 1899,
            duration_days: 5,
            image_url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop&crop=center",
          },
          {
            id: 3,
            title: "Kruger Explorer",
            description: "South African safari adventure in Kruger National Park",
            price: 1599,
            duration_days: 4,
            image_url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop&crop=center",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPackages()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-8 loading-shimmer rounded-full"></div>
            </div>
            <div className="w-96 h-12 loading-shimmer rounded-xl mx-auto mb-4"></div>
            <div className="w-128 h-6 loading-shimmer rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-premium p-6 animate-pulse">
                <div className="h-64 loading-shimmer rounded-xl mb-6"></div>
                <div className="h-6 loading-shimmer rounded mb-4"></div>
                <div className="h-4 loading-shimmer rounded mb-4"></div>
                <div className="h-12 loading-shimmer rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container-premium relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          {/* Premium section badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-accent text-primary px-6 py-2 rounded-full font-medium text-sm shadow-premium">
              <Sparkles className="w-4 h-4" />
              Featured Experiences
            </div>
          </div>

          {/* Premium section title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 sm:mb-6 leading-tight text-center">
            <span className="block">Curated Safari</span>
            <span className="block text-gradient">Adventures</span>
          </h2>

          {/* Premium section subtitle */}
          <p className="text-subtitle text-premium max-w-3xl mx-auto">
            Discover our most sought-after safari experiences, meticulously crafted for discerning travelers seeking
            extraordinary wildlife encounters and unparalleled luxury in Africa's most pristine wilderness areas.
          </p>
        </div>

        {packages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PackageCard package={pkg} />
                </div>
              ))}
            </div>

            {/* Premium CTA */}
            <div className="text-center animate-fade-in">
              <Button
                asChild
                size="lg"
                className="bg-gradient-luxury hover:shadow-luxury text-accent border-0 px-12 py-4 rounded-xl transition-all duration-300 hover:scale-105 focus-ring font-semibold text-lg"
              >
                <Link href="/packages">
                  Explore All Packages
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">New Experiences Coming Soon</h3>
            <p className="text-premium mb-8 max-w-md mx-auto">
              We're curating exceptional safari packages for you. Check back soon for our featured adventures.
            </p>
            <Button asChild className="bg-gradient-luxury text-accent rounded-xl px-8 py-3 font-medium">
              <Link href="/packages">Browse Available Packages</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
