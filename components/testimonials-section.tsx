"use client"

import { useEffect, useState } from "react"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { Loader2 } from "lucide-react"
import { useSettings } from "@/components/settings-provider"
import type { Testimonial } from "@/types"

export function TestimonialsSection() {
  const { settings, loading } = useSettings()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials?featured=true")
      if (response.ok) {
        const data = await response.json()
        // Transform the data to match the expected format
        const transformedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          rating: item.rating,
          comment: item.comment,
          image_url: item.image_url || "/placeholder.svg?height=64&width=64",
          featured: item.featured,
          approved: item.approved,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }))
        setTestimonials(transformedData)
      } else {
        // Use fallback testimonials with proper structure
        setTestimonials([
          {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            rating: 5,
            comment:
              "Absolutely incredible experience! The guides were knowledgeable and the wildlife viewing was beyond our expectations. Every moment was magical!",
            image_url: "/placeholder.svg?height=64&width=64",
            featured: true,
            approved: true,
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
          },
          {
            id: 2,
            name: "Michael Chen",
            email: "michael@example.com",
            rating: 5,
            comment:
              "Best vacation of our lives! The Serengeti was breathtaking and the accommodations were top-notch. Highly recommend!",
            image_url: "/placeholder.svg?height=64&width=64",
            featured: true,
            approved: true,
            created_at: "2024-01-10T14:30:00Z",
            updated_at: "2024-01-10T14:30:00Z",
          },
          {
            id: 3,
            name: "Emma Wilson",
            email: "emma@example.com",
            rating: 5,
            comment:
              "Amazing trek to Kilimanjaro base camp. Well organized and our guide was fantastic! An unforgettable adventure.",
            image_url: "/placeholder.svg?height=64&width=64",
            featured: true,
            approved: true,
            created_at: "2024-01-05T09:15:00Z",
            updated_at: "2024-01-05T09:15:00Z",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      // Use fallback testimonials on error
      setTestimonials([
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          rating: 5,
          comment:
            "Absolutely incredible experience! The guides were knowledgeable and the wildlife viewing was beyond our expectations. Every moment was magical!",
          image_url: "/placeholder.svg?height=64&width=64",
          featured: true,
          approved: true,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          name: "Michael Chen",
          email: "michael@example.com",
          rating: 5,
          comment:
            "Best vacation of our lives! The Serengeti was breathtaking and the accommodations were top-notch. Highly recommend!",
          image_url: "/placeholder.svg?height=64&width=64",
          featured: true,
          approved: true,
          created_at: "2024-01-10T14:30:00Z",
          updated_at: "2024-01-10T14:30:00Z",
        },
        {
          id: 3,
          name: "Emma Wilson",
          email: "emma@example.com",
          rating: 5,
          comment:
            "Amazing trek to Kilimanjaro base camp. Well organized and our guide was fantastic! An unforgettable adventure.",
          image_url: "/placeholder.svg?height=64&width=64",
          featured: true,
          approved: true,
          created_at: "2024-01-05T09:15:00Z",
          updated_at: "2024-01-05T09:15:00Z",
        },
      ])
    } finally {
      setTestimonialsLoading(false)
    }
  }

  // Don't render if explicitly disabled
  if (!loading && settings.reviews_enabled === "false") {
    return null
  }

  // Show loading state
  if (testimonialsLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              What Our Travelers Say
            </h2>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          </div>
        </div>
      </section>
    )
  }

  // Don't render if no testimonials
  if (!testimonials.length) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their adventures with
            us.
          </p>
        </div>

        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
