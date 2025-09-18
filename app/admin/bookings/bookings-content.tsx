"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, ArrowLeft, Calendar, Users, DollarSign, Mail, Phone } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: number
  user_name: string
  user_email: string
  user_phone?: string
  package_title: string
  package_image?: string
  status: string
  travel_date: string
  participants: number
  total_amount: number
  special_requests?: string
  created_at: string
}

export function BookingsContent() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking status updated successfully",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.package_title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600">View and manage customer bookings</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {booking.package_image && (
                      <img
                        src={booking.package_image || "/placeholder.svg"}
                        alt={booking.package_title}
                        className="w-full lg:w-24 h-48 lg:h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{booking.package_title}</h3>
                          <p className="text-gray-600">{booking.user_name}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span className="break-all">{booking.user_email}</span>
                            </div>
                            {booking.user_phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{booking.user_phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Travel: {new Date(booking.travel_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{booking.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>${booking.total_amount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="text-gray-500">Booked: {new Date(booking.created_at).toLocaleDateString()}</div>
                      </div>

                      {booking.special_requests && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Special Requests:</p>
                          <p className="text-sm text-gray-600">{booking.special_requests}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(status) => updateBookingStatus(booking.id, status)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${booking.user_email}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </a>
                        </Button>
                        {booking.user_phone && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`tel:${booking.user_phone}`}>
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "No bookings match your search criteria."
                    : "No bookings have been made yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
