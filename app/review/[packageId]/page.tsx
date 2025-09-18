"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export const dynamic = "force-dynamic"

interface Package {
  id: number
  title: string
  description: string
  price: number
  image_url: string
}

export default function ReviewPackagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const packageId = params.packageId as string

  const [packageData, setPackageData] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [reviewerEmail, setReviewerEmail] = useState("")

  useEffect(() => {
    if (user) {
      setReviewerName(user.name || "")
      setReviewerEmail(user.email || "")
    }
  }, [user])

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`)
        if (response.ok) {
          const data = await response.json()
          setPackageData(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load package details",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching package:", error)
        toast({
          title: "Error",
          description: "Failed to load package details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (packageId) {
      fetchPackage()
    }
  }, [packageId, toast])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive",
      })
      return
    }

    if (!user && (!reviewerName.trim() || !reviewerEmail.trim())) {
      toast({
        title: "Error",
        description: "Please provide your name and email",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_id: Number.parseInt(packageId),
          rating,
          comment: comment.trim(),
          reviewer_name: user ? user.name : reviewerName.trim(),
          reviewer_email: user ? user.email : reviewerEmail.trim(),
          user_id: user?.id || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your review has been submitted successfully!",
        })
        router.push(`/packages/${packageId}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      return (
        <Star
          key={index}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            starValue <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
                <p className="text-gray-600 mb-6">The package you're trying to review could not be found.</p>
                <Button onClick={() => router.push("/packages")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Packages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {packageData.image_url && (
                  <img
                    src={packageData.image_url || "/placeholder.svg"}
                    alt={packageData.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{packageData.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{packageData.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${packageData.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {!user && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reviewerName">Your Name *</Label>
                      <Input
                        id="reviewerName"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviewerEmail">Your Email *</Label>
                      <Input
                        id="reviewerEmail"
                        type="email"
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Rating *</Label>
                  <div className="flex gap-1 mt-2">{renderStars()}</div>
                  {rating > 0 && <p className="text-sm text-gray-600 mt-1">{rating} out of 5 stars</p>}
                </div>

                <div>
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your experience with this package..."
                    rows={5}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
