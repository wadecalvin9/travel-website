"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Testimonial } from "@/types"

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(nextTestimonial, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length, isAutoPlaying])

  if (!testimonials.length) return null

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-3xl transform rotate-1"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-blue-50 via-purple-50 to-pink-50 rounded-3xl transform -rotate-1"></div>

      <Card className="relative bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-12 text-center">
          {/* Quote icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <Quote className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 mx-1 transition-all duration-300 ${
                  i < currentTestimonial.rating ? "text-amber-400 fill-current scale-110" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Testimonial text */}
          <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed font-light max-w-4xl mx-auto">
            "{currentTestimonial.comment}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center justify-center gap-6">
            {currentTestimonial.image_url && (
              <div className="relative">
                <img
                  src={currentTestimonial.image_url || "/placeholder.svg"}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            )}
            <div className="text-left">
              <div className="font-bold text-xl text-gray-900 font-display">{currentTestimonial.name}</div>
              <div className="text-amber-600 font-medium">Verified Traveler</div>
              <div className="text-sm text-gray-500">Safari Adventure 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg border-0 rounded-full w-12 h-12 hover:bg-white hover:scale-110 transition-all duration-300"
        onClick={() => {
          prevTestimonial()
          setIsAutoPlaying(false)
        }}
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg border-0 rounded-full w-12 h-12 hover:bg-white hover:scale-110 transition-all duration-300"
        onClick={() => {
          nextTestimonial()
          setIsAutoPlaying(false)
        }}
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 gap-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-12 h-3 bg-gradient-to-r from-amber-500 to-orange-600"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isAutoPlaying ? "⏸️ Pause" : "▶️ Play"} Auto-scroll
        </button>
      </div>
    </div>
  )
}
