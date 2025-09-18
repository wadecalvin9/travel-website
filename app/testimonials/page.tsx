"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Star, Send, CheckCircle } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  rating: number
  comment: string
  image_url?: string
  created_at: string
}

export default function TestimonialsPage() {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.rating || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a rating",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", rating: 0, comment: "" })
        toast({
          title: "Success",
          description: "Thank you for your testimonial! It will be reviewed and published soon.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to submit testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit testimonial",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400 transition-colors" : ""}`}
        onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Share Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              {" "}
              Safari Experience
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Help other travelers discover the magic of Africa through your authentic safari stories and experiences.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Submit Testimonial Form */}
          <div className="order-2 lg:order-1">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your testimonial has been submitted and will be reviewed shortly.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-amber-600 to-orange-600"
                    >
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate Your Experience *</label>
                        <div className="flex items-center gap-2">
                          {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                          <span className="text-sm text-gray-600 ml-2">
                            {formData.rating > 0 ? `${formData.rating}/5` : "Click to rate"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Testimonial *</label>
                        <Textarea
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                          placeholder="Tell us about your safari experience..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Testimonial
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Display Testimonials */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Travelers Say</h2>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse backdrop-blur-sm bg-white/60">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-6"></div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                      <blockquote className="text-gray-700 mb-4 italic">"{testimonial.comment}"</blockquote>
                      <div className="flex items-center">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-4">
                            <span className="text-white font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                  <p className="text-gray-600">Be the first to share your safari experience!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
