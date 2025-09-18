"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, MapPin } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export const dynamic = "force-dynamic"

interface Package {
  id: number
  title: string
  description: string
  detailed_description: string
  price: number
  duration_days: number
  max_participants: number
  image_url: string
  gallery_images: string[]
  destination: {
    name: string
    country: string
  }
  included: string[]
  excluded: string[]
  itinerary: Record<string, string>
}

interface BookingFormData {
  travel_date: string
  participants: number
  special_requests: string
  guest_name: string
  guest_email: string
  guest_phone: string
}

export default function BookPackagePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [package_, setPackage] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    travel_date: "",
    participants: 1,
    special_requests: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
  })

  useEffect(() => {
    fetchPackage()
  }, [params.id])

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPackage(data)
      } else {
        toast.error("Package not found")
        router.push("/packages")
      }
    } catch (error) {
      console.error("Error fetching package:", error)
      toast.error("Failed to load package details")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const bookingData = {
        package_id: package_?.id,
        package_title: package_?.title,
        package_image: package_?.image_url,
        travel_date: formData.travel_date,
        participants: formData.participants,
        total_amount: (package_?.price || 0) * formData.participants,
        special_requests: formData.special_requests,
        ...(user
          ? {}
          : {
              guest_name: formData.guest_name,
              guest_email: formData.guest_email,
              guest_phone: formData.guest_phone,
            }),
      }

      const endpoint = user ? "/api/bookings" : "/api/guest-bookings"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Booking submitted successfully!")

        if (user) {
          router.push(`/bookings/${result.id}`)
        } else {
          router.push("/packages?booking=success")
        }
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to submit booking")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Failed to submit booking")
    } finally {
      setSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return (package_?.price || 0) * formData.participants
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!package_) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/packages")}>Browse Packages</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Your Safari</h1>
          <p className="text-gray-600">Complete your booking for {package_.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={package_.image_url || "/placeholder.svg"}
                    alt={package_.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl">{package_.title}</CardTitle>
                <CardDescription>{package_.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {package_.duration_days} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Max {package_.max_participants} people
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {package_.destination.name}, {package_.destination.country}
                  </div>
                </div>

                <div className="text-3xl font-bold text-green-600">
                  ${package_.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500"> per person</span>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">What's Included</h3>
                  <ul className="space-y-1">
                    {package_.included.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What's Excluded</h3>
                  <ul className="space-y-1">
                    {package_.excluded.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book This Package</CardTitle>
                <CardDescription>Fill in your details to book this amazing safari experience</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Guest Information (if not logged in) */}
                  {!user && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Your Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="guest_name">Full Name *</Label>
                          <Input
                            id="guest_name"
                            type="text"
                            value={formData.guest_name}
                            onChange={(e) => handleInputChange("guest_name", e.target.value)}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guest_email">Email Address *</Label>
                          <Input
                            id="guest_email"
                            type="email"
                            value={formData.guest_email}
                            onChange={(e) => handleInputChange("guest_email", e.target.value)}
                            required
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guest_phone">Phone Number *</Label>
                          <Input
                            id="guest_phone"
                            type="tel"
                            value={formData.guest_phone}
                            onChange={(e) => handleInputChange("guest_phone", e.target.value)}
                            required
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="travel_date">Preferred Travel Date *</Label>
                      <Input
                        id="travel_date"
                        type="date"
                        value={formData.travel_date}
                        onChange={(e) => handleInputChange("travel_date", e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="participants">Number of Participants *</Label>
                      <Input
                        id="participants"
                        type="number"
                        min="1"
                        max={package_.max_participants}
                        value={formData.participants}
                        onChange={(e) => handleInputChange("participants", Number.parseInt(e.target.value))}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {package_.max_participants} participants allowed
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                      <Textarea
                        id="special_requests"
                        value={formData.special_requests}
                        onChange={(e) => handleInputChange("special_requests", e.target.value)}
                        placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price per person:</span>
                      <span>${package_.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Number of participants:</span>
                      <span>{formData.participants}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Processing..." : "Book Now"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By booking, you agree to our terms and conditions. A deposit may be required to confirm your
                    booking.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
