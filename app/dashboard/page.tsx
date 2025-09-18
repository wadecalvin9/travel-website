"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Star } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: number
  package_title: string
  package_image: string
  status: string
  travel_date: string
  participants: number
  total_amount: number
  created_at: string
}

interface Review {
  id: number
  package_title: string
  rating: number
  comment: string
  created_at: string
  approved: boolean
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([fetch("/api/user/bookings"), fetch("/api/user/reviews")])

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Manage your safari bookings and reviews</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Bookings
                  <Badge variant="secondary">{bookings.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.package_title}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <img
                            src={booking.package_image || "/placeholder.svg"}
                            alt={booking.package_title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.travel_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {booking.participants} participants
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-semibold text-green-600">${booking.total_amount.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">
                            Booked {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No bookings yet</p>
                    <Button asChild>
                      <Link href="/packages">Browse Safari Packages</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Reviews
                  <Badge variant="secondary">{reviews.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{review.package_title}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{review.comment}</p>

                        <div className="flex items-center justify-between text-sm">
                          <Badge variant={review.approved ? "default" : "secondary"}>
                            {review.approved ? "Approved" : "Pending Review"}
                          </Badge>
                          <span className="text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No reviews yet</p>
                    <p className="text-sm text-gray-400">Complete a safari to leave a review</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
