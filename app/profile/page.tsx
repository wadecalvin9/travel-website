"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Calendar,
  MapPin,
  Star,
  Edit,
  Phone,
  Mail,
  Globe,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth" // Changed from useSimpleAuth
import { useProfile } from "@/hooks/use-profile"
import Link from "next/link"

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth() // Changed from useSimpleAuth
  const { profile, bookings, reviews, loading: profileLoading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your safari adventures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-green-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <Badge variant="secondary" className="mb-4">
                  {profile.role === "admin" ? "Administrator" : "Traveler"}
                </Badge>
                <Button asChild className="w-full">
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Travel Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{bookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Trips</span>
                  <span className="font-semibold">{bookings.filter((b) => b.status === "completed").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews Written</span>
                  <span className="font-semibold">{reviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{new Date(profile.createdAt).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}
                      {profile.nationality && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Nationality</p>
                            <p className="font-medium">{profile.nationality}</p>
                          </div>
                        </div>
                      )}
                      {profile.dateOfBirth && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Date of Birth</p>
                            <p className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <img
                              src={booking.packageImage || "/placeholder.svg"}
                              alt={booking.packageTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{booking.packageTitle}</h4>
                              <p className="text-sm text-gray-600">
                                Travel Date: {new Date(booking.travelDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">${booking.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        <Button asChild variant="outline" className="w-full">
                          <Link href="#bookings">View All Bookings</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No bookings yet</p>
                        <Button asChild>
                          <Link href="/packages">Browse Safari Packages</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length > 0 ? (
                      <div className="space-y-6">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-6">
                            <div className="flex items-start gap-4">
                              <img
                                src={booking.packageImage || "/placeholder.svg"}
                                alt={booking.packageTitle}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-semibold">{booking.packageTitle}</h3>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1 capitalize">{booking.status}</span>
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p>
                                      <strong>Booking Date:</strong>{" "}
                                      {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                      <strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong>Participants:</strong> {booking.participants}
                                    </p>
                                    <p>
                                      <strong>Total Amount:</strong> ${booking.totalAmount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                {booking.specialRequests && (
                                  <div className="mt-3">
                                    <p className="text-sm text-gray-600">
                                      <strong>Special Requests:</strong> {booking.specialRequests}
                                    </p>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-4">
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                  {booking.status === "completed" && (
                                    <Button size="sm" asChild>
                                      <Link href={`/review/${booking.packageId}`}>Write Review</Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">Start planning your next safari adventure!</p>
                        <Button asChild>
                          <Link href="/packages">Browse Safari Packages</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{review.packageTitle}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={review.approved ? "default" : "secondary"}>
                                {review.approved ? "Published" : "Pending Review"}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`Review image ${index + 1}`}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600 mb-6">Share your safari experiences with other travelers!</p>
                        <Button asChild variant="outline">
                          <Link href="/packages">Browse Packages to Review</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.travelPreferences ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Accommodation Type</h4>
                            <Badge variant="outline" className="capitalize">
                              {profile.travelPreferences.accommodationType}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Preferred Group Size</h4>
                            <Badge variant="outline" className="capitalize">
                              {profile.travelPreferences.groupSize.replace("-", " ")}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Activity Level</h4>
                            <Badge variant="outline" className="capitalize">
                              {profile.travelPreferences.activityLevel}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Interests</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.travelPreferences.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href="/profile/edit">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Preferences
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No preferences set</h3>
                        <p className="text-gray-600 mb-6">
                          Set your travel preferences to get personalized recommendations!
                        </p>
                        <Button asChild>
                          <Link href="/profile/edit">
                            <Edit className="h-4 w-4 mr-2" />
                            Set Preferences
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
