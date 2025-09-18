"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Package, Star, ArrowRight, Globe, Camera } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Destination {
  id: number
  name: string
  description: string
  image_url: string
  country: string
  featured: boolean
  package_count: number
}

// Premium destination images
const destinationImages: Record<string, string> = {
  Serengeti: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
  "Masai Mara": "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop",
  Kruger: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop",
  Okavango: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
  Ngorongoro: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop",
  Amboseli: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
}

function getDestinationImage(name: string, originalUrl?: string) {
  if (originalUrl && !originalUrl.includes("placeholder.svg")) {
    return originalUrl
  }

  const matchingKey = Object.keys(destinationImages).find((key) => name.toLowerCase().includes(key.toLowerCase()))

  return matchingKey
    ? destinationImages[matchingKey]
    : "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop"
}

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch("/api/destinations?featured=true")
        if (response.ok) {
          const data = await response.json()
          const destinationsWithImages = data.slice(0, 6).map((dest: Destination) => ({
            ...dest,
            image_url: getDestinationImage(dest.name, dest.image_url),
          }))
          setDestinations(destinationsWithImages)
        }
      } catch (error) {
        console.error("Error fetching destinations:", error)
        // Fallback destinations
        setDestinations([
          {
            id: 1,
            name: "Serengeti National Park",
            description: "Witness the Great Migration and endless plains of Tanzania's most famous park.",
            image_url: destinationImages["Serengeti"],
            country: "Tanzania",
            featured: true,
            package_count: 8,
          },
          {
            id: 2,
            name: "Masai Mara Reserve",
            description: "Kenya's premier wildlife destination, home to the Big Five and Maasai culture.",
            image_url: destinationImages["Masai Mara"],
            country: "Kenya",
            featured: true,
            package_count: 12,
          },
          {
            id: 3,
            name: "Kruger National Park",
            description: "South Africa's flagship park offering incredible wildlife diversity.",
            image_url: destinationImages["Kruger"],
            country: "South Africa",
            featured: true,
            package_count: 6,
          },
          {
            id: 4,
            name: "Okavango Delta",
            description: "Botswana's pristine wetland paradise, perfect for water-based safaris.",
            image_url: destinationImages["Okavango"],
            country: "Botswana",
            featured: true,
            package_count: 4,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <div className="w-32 h-8 loading-shimmer rounded-full mx-auto mb-6"></div>
            <div className="w-96 h-12 loading-shimmer rounded-xl mx-auto mb-4"></div>
            <div className="w-128 h-6 loading-shimmer rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-premium p-6 animate-pulse">
                <div className="h-48 loading-shimmer rounded-xl mb-4"></div>
                <div className="h-6 loading-shimmer rounded mb-2"></div>
                <div className="h-4 loading-shimmer rounded mb-4"></div>
                <div className="h-10 loading-shimmer rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <div className="container-premium relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          {/* Premium section badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-6 py-2 rounded-full font-medium text-sm border border-blue-200">
              <Globe className="w-4 h-4" />
              Popular Destinations
            </div>
          </div>

          {/* Premium section title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 sm:mb-6 leading-tight text-center">
            <span className="block">Africa's Most</span>
            <span className="block text-gradient">Spectacular Destinations</span>
          </h2>

          {/* Premium section subtitle */}
          <p className="text-subtitle text-premium max-w-3xl mx-auto">
            Explore the continent's most breathtaking wildlife sanctuaries, where ancient landscapes meet extraordinary
            biodiversity in perfect harmony.
          </p>
        </div>

        {destinations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {destinations.map((destination, index) => (
                <Card
                  key={destination.id}
                  className="group card-premium h-full flex flex-col animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <img
                          src={destination.image_url || "/placeholder.svg"}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {/* Premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Premium badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {destination.featured && (
                          <Badge className="bg-gradient-accent text-primary border-0 px-3 py-1 rounded-full font-semibold text-xs shadow-premium">
                            Featured
                          </Badge>
                        )}
                        <Badge className="glass-effect text-white border-white/20 px-3 py-1 rounded-full font-medium text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {destination.country}
                        </Badge>
                      </div>

                      {/* Package count */}
                      <div className="absolute bottom-4 right-4 glass-dark text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {destination.package_count} tours
                      </div>

                      {/* Premium hover actions */}
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <Button
                          asChild
                          size="sm"
                          className="glass-effect text-white hover:bg-white/20 rounded-full px-4 text-xs focus-ring border-0"
                        >
                          <Link href={`/destinations/${destination.id}`}>
                            <Camera className="w-3 h-3 mr-1" />
                            Explore
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Premium title */}
                    <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {destination.name}
                    </h3>

                    {/* Premium description */}
                    <p className="text-premium mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                      {destination.description}
                    </p>

                    {/* Premium rating */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "text-accent fill-current" : "text-neutral-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-600 font-medium">4.8 rating</span>
                    </div>

                    {/* Premium CTA */}
                    <Button
                      asChild
                      className="w-full bg-gradient-luxury hover:shadow-luxury text-accent border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 focus-ring"
                    >
                      <Link href={`/packages?destination=${encodeURIComponent(destination.name.toLowerCase())}`}>
                        View Tours
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium section CTA */}
            <div className="text-center animate-fade-in">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-accent/30 text-accent hover:bg-accent/10 rounded-xl px-12 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 focus-ring"
              >
                <Link href="/destinations">
                  Explore All Destinations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">Destinations Coming Soon</h3>
            <p className="text-premium mb-8 max-w-md mx-auto">
              We're adding more incredible destinations to our portfolio. Check back soon for new adventures.
            </p>
            <Button asChild className="bg-gradient-luxury text-accent rounded-xl px-8 py-3 font-medium">
              <Link href="/destinations">View Available Destinations</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
