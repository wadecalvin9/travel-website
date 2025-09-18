"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Calendar,
  Users,
  Clock,
  Mail,
  Phone,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  FileText,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Booking {
  id: number
  userId: number
  packageId: number
  packageTitle: string
  packageImage: string
  status: string
  bookingDate: string
  travelDate: string
  participants: number
  totalAmount: number
  depositAmount: number
  balanceAmount: number
  accommodationType: string
  dietaryRequirements?: string
  specialRequests?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  } | null
  insurance: boolean
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchBooking()
    }
  }, [user, params.id])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      } else if (response.status === 404) {
        toast({
          title: "Booking Not Found",
          description: "The booking you're looking for doesn't exist.",
          variant: "destructive",
        })
        router.push("/profile")
      } else {
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
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

  const handleDownloadItinerary = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Your itinerary is being prepared for download.",
    })
  }

  const handleShareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Safari Booking - ${booking?.packageTitle}`,
          text: `Check out my upcoming safari adventure!`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Booking link copied to clipboard",
      })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!user || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Button asChild>
            <Link href="/profile">View My Bookings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Confirmation</h1>
              <p className="text-gray-600">Booking ID: #{booking.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShareBooking}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleDownloadItinerary}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(booking.status)}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold">Booking Status</h2>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {booking.status === "confirmed" &&
                    "Your booking is confirmed! We'll send you detailed information closer to your travel date."}
                  {booking.status === "pending" && "Your booking is being processed. We'll confirm within 24 hours."}
                  {booking.status === "cancelled" &&
                    "This booking has been cancelled. Contact us if you have questions."}
                  {booking.status === "completed" &&
                    "Thank you for traveling with us! We hope you had an amazing experience."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Safari Package</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Image
                    src={booking.packageImage || "/placeholder.svg"}
                    alt={booking.packageTitle}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{booking.packageTitle}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {booking.participants} {booking.participants === 1 ? "participant" : "participants"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Accommodation: {booking.accommodationType}</span>
                      </div>
                      {booking.insurance && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Travel Insurance Included</span>
                        </div>
                      )}
                    </div>
                    <Button asChild className="mt-4" variant="outline">
                      <Link href={`/packages/${booking.packageId}`}>View Package Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Information */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.dietaryRequirements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Dietary Requirements</h4>
                    <p className="text-gray-600">{booking.dietaryRequirements}</p>
                  </div>
                )}

                {booking.specialRequests && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Special Requests</h4>
                    <p className="text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>

                  {booking.emergencyContact ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {booking.emergencyContact.name}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {booking.emergencyContact.phone}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">Relationship:</span> {booking.emergencyContact.relationship}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No emergency contact provided.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You'll receive a detailed itinerary 2 weeks before departure</li>
                    <li>• Final balance payment is due 30 days before travel</li>
                    <li>• We'll contact you for passport and visa requirements</li>
                    <li>• Travel insurance documents will be emailed separately</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-yellow-800">
                    Free cancellation up to 60 days before departure. 50% refund for cancellations 30-60 days before. No
                    refund for cancellations within 30 days of departure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-medium">${booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Deposit Paid</span>
                    <span className="font-medium">${booking.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Balance Due</span>
                    <span className="font-medium">${booking.balanceAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method: {booking.paymentMethod === "card" ? "Credit Card" : "Bank Transfer"}</span>
                  </div>
                  <p>Balance due 30 days before travel</p>
                </div>

                {booking.balanceAmount > 0 && (
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Balance
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <a href="mailto:bookings@travelconnect.com" className="text-green-600 hover:underline">
                        bookings@travelconnect.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <a href="tel:+1234567890" className="text-green-600 hover:underline">
                        +1 (234) 567-8900
                      </a>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/packages/${booking.packageId}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Package Details
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <Users className="h-4 w-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
                {booking.status === "completed" && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/review/${booking.packageId}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Write Review
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
