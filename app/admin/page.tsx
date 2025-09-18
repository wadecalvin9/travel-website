"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, MessageSquare, Star, Calendar, TrendingUp, Eye, Phone } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalPackages: number
  totalBookings: number
  totalInquiries: number
  totalReviews: number
  totalTestimonials: number
  recentBookings?: Array<{
    id: number
    package_title: string
    customer_name: string
    created_at: string
    status: string
  }>
  recentInquiries?: Array<{
    id: number
    name: string
    email: string
    package_title: string
    created_at: string
    status: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
          <Button onClick={fetchStats} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your travel business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <Link href="/admin/users">
              <Button variant="link" className="p-0 h-auto text-sm">
                View all users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages || 0}</div>
            <Link href="/admin/packages">
              <Button variant="link" className="p-0 h-auto text-sm">
                Manage packages
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings || 0}</div>
            <Link href="/admin/bookings">
              <Button variant="link" className="p-0 h-auto text-sm">
                View bookings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries || 0}</div>
            <Link href="/admin/inquiries">
              <Button variant="link" className="p-0 h-auto text-sm">
                View inquiries
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews || 0}</div>
            <Link href="/admin/reviews">
              <Button variant="link" className="p-0 h-auto text-sm">
                Manage reviews
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTestimonials || 0}</div>
            <Link href="/admin/testimonials">
              <Button variant="link" className="p-0 h-auto text-sm">
                Manage testimonials
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.customer_name}</p>
                      <p className="text-sm text-gray-600">{booking.package_title || "No package"}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInquiries && stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-sm text-gray-600">{inquiry.package_title || "General inquiry"}</p>
                      <p className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      variant={
                        inquiry.status === "responded"
                          ? "default"
                          : inquiry.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {inquiry.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent inquiries</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/admin/packages/new">
              <Button className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Add New Package
              </Button>
            </Link>
            <Link href="/admin/destinations/new">
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Site Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
