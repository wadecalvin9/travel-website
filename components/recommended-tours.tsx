"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, MapPin, Star, ArrowRight, Award, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RecommendedTour {
  id: number
  title: string
  description: string
  price: number
  duration_days: number
  image_url: string
  destination_name?: string
  max_participants: number
  difficulty_level: string
  recommendation_reason: string
  popularity_score: number
}

// Premium tour images
const tourImages: Record<string, string> = {
  Migration: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
  "Big Five": "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop",
  Luxury: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop",
  Adventure: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
  Family: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&h=400&fit=crop",
  Photography: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
}

function getTourImage(title: string, originalUrl?: string) {
  if (originalUrl && !originalUrl.includes("placeholder.svg")) {
    return originalUrl
  }

  const matchingKey = Object.keys(tourImages).find((key) => title.toLowerCase().includes(key.toLowerCase()))

  return matchingKey
    ? tourImages[matchingKey]
    : "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop"
}

export function RecommendedTours() {
  const [tours, setTours] = useState<RecommendedTour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendedTours() {
      try {
        const response = await fetch("/api/packages?recommended=true")
        if (response.ok) {
          const data = await response.json()
          const toursWithImages = data.slice(0, 4).map((tour: any) => ({
            ...tour,
            image_url: getTourImage(tour.title, tour.image_url),
            recommendation_reason: getRecommendationReason(tour),
            popularity_score: Math.floor(Math.random() * 30) + 70, // Mock popularity score
            difficulty_level: tour.difficulty_level || "Moderate",
          }))
          setTours(toursWithImages)
        }
      } catch (error) {
        console.error("Error fetching recommended tours:", error)
        // Fallback recommended tours
        setTours([
          {
            id: 1,
            title: "Great Migration Luxury Safari",
            description: "Experience the world's greatest wildlife spectacle in ultimate comfort and style.",
            price: 3499,
            duration_days: 8,
            image_url: tourImages["Migration"],
            destination_name: "Serengeti",
            max_participants: 12,
            difficulty_level: "Easy",
            recommendation_reason: "Most Popular",
            popularity_score: 95,
          },
          {
            id: 2,
            title: "Big Five Photography Adventure",
            description: "Perfect for wildlife photographers seeking the ultimate African Big Five experience.",
            price: 2899,
            duration_days: 7,
            image_url: tourImages["Photography"],
            destination_name: "Masai Mara",
            max_participants: 8,
            difficulty_level: "Moderate",
            recommendation_reason: "Best for Photography",
            popularity_score: 88,
          },
          {
            id: 3,
            title: "Family Safari Adventure",
            description: "Specially designed family-friendly safari with activities for all ages.",
            price: 2299,
            duration_days: 6,
            image_url: tourImages["Family"],
            destination_name: "Kruger",
            max_participants: 16,
            difficulty_level: "Easy",
            recommendation_reason: "Family Favorite",
            popularity_score: 92,
          },
          {
            id: 4,
            title: "Luxury Okavango Experience",
            description: "Exclusive water-based safari in Botswana's pristine Okavango Delta.",
            price: 4299,
            duration_days: 5,
            image_url: tourImages["Luxury"],
            destination_name: "Okavango Delta",
            max_participants: 6,
            difficulty_level: "Moderate",
            recommendation_reason: "Most Exclusive",
            popularity_score: 85,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedTours()
  }, [])

  function getRecommendationReason(tour: any) {
    const reasons = [
      "Most Popular",
      "Best Value",
      "Trending Now",
      "Expert Choice",
      "Customer Favorite",
      "New & Exciting",
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  function getRecommendationIcon(reason: string) {
    switch (reason) {
      case "Most Popular":
        return <TrendingUp className="w-3 h-3" />
      case "Best Value":
        return <Award className="w-3 h-3" />
      case "Trending Now":
        return <Zap className="w-3 h-3" />
      default:
        return <Star className="w-3 h-3" />
    }
  }

  function getRecommendationColor(reason: string) {
    switch (reason) {
      case "Most Popular":
        return "bg-red-100 text-red-700 border-red-200"
      case "Best Value":
        return "bg-green-100 text-green-700 border-green-200"
      case "Trending Now":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <div className="w-32 h-8 loading-shimmer rounded-full mx-auto mb-6"></div>
            <div className="w-96 h-12 loading-shimmer rounded-xl mx-auto mb-4"></div>
            <div className="w-128 h-6 loading-shimmer rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
    <section className="section-padding bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container-premium relative">
        <div className="text-center mb-16 animate-fade-in">
          {/* Premium section badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-6 py-2 rounded-full font-medium text-sm border border-purple-200">
              <Award className="w-4 h-4" />
              Recommended Tours
            </div>
          </div>

          {/* Premium section title */}
          <h2 className="text-section-title text-neutral-900 mb-6 leading-tight">
            <span className="block">Handpicked</span>
            <span className="block text-gradient">Safari Experiences</span>
          </h2>

          {/* Premium section subtitle */}
          <p className="text-subtitle text-premium max-w-3xl mx-auto">
            Our expert team has carefully selected these exceptional safari experiences based on guest reviews, unique
            features, and unforgettable wildlife encounters.
          </p>
        </div>

        {tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {tours.map((tour, index) => (
                <Card
                  key={tour.id}
                  className="group card-premium h-full flex flex-col animate-scale-in hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <img
                          src={tour.image_url || "/placeholder.svg"}
                          alt={tour.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {/* Premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Recommendation badge */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${getRecommendationColor(tour.recommendation_reason)} border px-2 py-1 rounded-full font-medium text-xs flex items-center gap-1`}
                        >
                          {getRecommendationIcon(tour.recommendation_reason)}
                          {tour.recommendation_reason}
                        </Badge>
                      </div>

                      {/* Popularity score */}
                      <div className="absolute top-3 right-3 glass-dark text-white px-2 py-1 rounded-full text-xs font-medium">
                        {tour.popularity_score}% loved
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 glass-effect text-white border-white/20 px-2 py-1 rounded-full font-medium text-xs">
                        {tour.duration_days} days
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    {/* Premium title */}
                    <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {tour.title}
                    </h3>

                    {/* Premium description */}
                    <p className="text-premium mb-3 line-clamp-2 text-xs leading-relaxed flex-1">{tour.description}</p>

                    {/* Tour details */}
                    <div className="flex flex-wrap gap-2 text-xs text-neutral-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-accent" />
                        <span className="font-medium truncate">{tour.destination_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-accent" />
                        <span className="font-medium">Max {tour.max_participants}</span>
                      </div>
                    </div>

                    {/* Difficulty level */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {tour.difficulty_level}
                      </Badge>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < 4 ? "text-accent fill-current" : "text-neutral-300"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Premium price */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-xl font-display font-bold text-neutral-900">
                          ${tour.price?.toLocaleString() || "0"}
                        </span>
                        <span className="text-xs text-neutral-500 ml-1">per person</span>
                      </div>
                    </div>

                    {/* Premium CTA */}
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-luxury hover:shadow-luxury text-accent border-0 rounded-xl py-2 font-semibold transition-all duration-300 hover:scale-105 focus-ring text-xs"
                    >
                      <Link href={`/packages/${tour.id}`}>
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
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
                className="bg-gradient-luxury hover:shadow-luxury text-accent border-0 px-12 py-4 rounded-xl transition-all duration-300 hover:scale-105 focus-ring font-semibold text-lg"
              >
                <Link href="/packages">
                  View All Tours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">Curating Recommendations</h3>
            <p className="text-premium mb-8 max-w-md mx-auto">
              Our experts are selecting the best tours for you. Check back soon for personalized recommendations.
            </p>
            <Button asChild className="bg-gradient-luxury text-accent rounded-xl px-8 py-3 font-medium">
              <Link href="/packages">Browse All Tours</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
