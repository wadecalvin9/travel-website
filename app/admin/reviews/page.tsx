"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, User, Calendar, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

interface Review {
  id: number
  user_name: string
  package_title: string
  rating: number
  comment: string
  created_at: string
  status: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== id))
        toast({
          title: "Success",
          description: "Review deleted successfully",
        })
      } else {
        throw new Error("Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reviews...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
        <Badge variant="secondary">{reviews.length} Total Reviews</Badge>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground text-center">No customer reviews have been submitted yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {review.user_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {review.package_title}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={review.status === "approved" ? "default" : "secondary"}>{review.status}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground ml-1">({review.rating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Comment:</span>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
