"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import {
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Booking {
  id: number
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
  createdAt: string
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
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

  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      const matchesSearch = booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "travel-date":
          return new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime()
        case "amount":
          return b.totalAmount - a.totalAmount
        default:
          return 0
      }
    })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage and track your safari bookings</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="travel-date">Travel Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredAndSortedBookings.length > 0 ? (
            filteredAndSortedBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <Image
                      src={booking.packageImage || "/placeholder.svg"}
                      alt={booking.packageTitle}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">{booking.packageTitle}</h3>
                          <p className="text-gray-600">Booking #{booking.id}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">Travel Date</p>
                            <p className="text-gray-600">{new Date(booking.travelDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">Participants</p>
                            <p className="text-gray-600">{booking.participants}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-gray-600">${booking.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">Booked</p>
                            <p className="text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {booking.balanceAmount > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-sm text-orange-800">
                            <strong>Balance Due:</strong> ${booking.balanceAmount.toLocaleString()}
                            (Due 30 days before travel)
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        {booking.status === "completed" && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/review/${booking.packageId}`}>Write Review</Link>
                          </Button>
                        )}
                        {booking.balanceAmount > 0 && booking.status === "confirmed" && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Pay Balance
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
                <div className="max-w-md mx-auto">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No bookings found" : "No bookings yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Start planning your next safari adventure!"}
                  </p>
                  <Button asChild>
                    <Link href="/packages">Browse Safari Packages</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
