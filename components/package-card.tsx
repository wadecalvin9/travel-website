"use client"

import { useState, memo } from "react"
import Link from "next/link"
import { Clock, Users, MapPin, Eye, Star, Heart, Calendar, MessageCircle, Award, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/currency-utils"
import type { Package } from "@/types"

interface PackageCardProps {
  package: Package
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

const PackageCard = memo(function PackageCard({ package: pkg }: PackageCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  // Helper function to render pricing based on type
  const renderPricing = () => {
    if (pkg.pricing_type === "custom" && pkg.price_text) {
      return (
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-neutral-900">{pkg.price_text}</div>
        </div>
      )
    } else if (pkg.pricing_type === "fixed" && pkg.price) {
      return (
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-neutral-900">
            {formatPrice(pkg.price, pkg.currency || "USD")}
            <span className="text-sm text-neutral-500 ml-1">per person</span>
          </div>
          <div className="text-sm text-neutral-400 line-through">
            {formatPrice(pkg.price * 1.2, pkg.currency || "USD")}
          </div>
          <Badge className="bg-green-100 text-green-800 text-xs font-medium mt-1">Save 20%</Badge>
        </div>
      )
    } else {
      return (
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-neutral-900">Contact for Pricing</div>
        </div>
      )
    }
  }

  return (
    <Card className="group card-premium h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden rounded-t-2xl">
          {/* Premium Image with loading state */}
          <div className="relative h-64 bg-gradient-to-br from-neutral-100 to-neutral-200">
            {!imageError ? (
              <img
                src={getPackageImage(pkg.title, pkg.image_url) || "/placeholder.svg"}
                alt={pkg.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                <div className="text-center text-neutral-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">Safari Adventure</p>
                </div>
              </div>
            )}

            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loading-shimmer w-full h-full"></div>
              </div>
            )}
          </div>

          {/* Premium overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Premium badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {pkg.featured && (
              <Badge className="bg-gradient-accent text-primary border-0 px-3 py-1 rounded-full font-semibold text-xs shadow-premium">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className="glass-effect text-white border-white/20 px-3 py-1 rounded-full font-medium text-xs">
              {pkg.duration_days} Days
            </Badge>
          </div>

          {/* Premium like button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-4 right-4 w-10 h-10 glass-effect rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-ring"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? "text-red-500 fill-current" : "text-white"}`} />
          </button>

          {/* Premium view count */}
          <div className="absolute bottom-4 right-4 glass-dark text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {pkg.view_count || 0}
          </div>

          {/* Premium quick actions (desktop hover) */}
          <div className="hidden sm:flex absolute bottom-4 left-4 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <Button
              asChild
              size="sm"
              className="glass-effect text-white hover:bg-white/20 rounded-full px-4 text-xs focus-ring border-0"
            >
              <Link href={`/packages/${pkg.id}#inquiry-form`}>
                <Calendar className="w-3 h-3 mr-1" />
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Premium title */}
        <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Premium description */}
        <p className="text-premium mb-4 line-clamp-2 text-sm leading-relaxed flex-1">{pkg.description}</p>

        {/* Premium details */}
        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent" />
            <span className="font-medium">{pkg.duration_days} days</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-accent" />
            <span className="font-medium">Max {pkg.max_participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-medium truncate">{pkg.destination_name || "Safari Destination"}</span>
          </div>
        </div>

        {/* Premium rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-accent fill-current" : "text-neutral-300"}`} />
            ))}
          </div>
          <span className="text-xs text-neutral-600 font-medium">4.8 (127 reviews)</span>
          <Award className="w-4 h-4 text-accent ml-auto" />
        </div>

        {/* Premium price with flexible pricing support */}
        <div className="flex items-baseline justify-between mb-6">{renderPricing()}</div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            asChild
            className="flex-1 bg-gradient-luxury hover:shadow-luxury text-accent border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 focus-ring"
          >
            <Link href={`/packages/${pkg.id}#inquiry-form`}>
              <Calendar className="w-4 h-4 mr-2" />
              Book Safari
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-2 border-accent/30 text-accent hover:bg-accent/10 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 focus-ring bg-transparent"
          >
            <Link href={`/packages/${pkg.id}#inquiry`}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Inquire
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
})

export { PackageCard }
