"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Star, Plus, Eye, EyeOff, Award, Search, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

interface Testimonial {
  id: number
  name: string
  email?: string
  rating: number
  comment: string
  image_url?: string
  featured: boolean
  approved: boolean
  created_at: string
  updated_at: string
}

interface NewTestimonial {
  name: string
  email: string
  rating: number
  comment: string
  image_url: string
  featured: boolean
  approved: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [newTestimonial, setNewTestimonial] = useState<NewTestimonial>({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    image_url: "",
    featured: false,
    approved: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    filterTestimonials()
  }, [testimonials, searchTerm, statusFilter, ratingFilter])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTestimonials = () => {
    let filtered = testimonials

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (testimonial) =>
          testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (testimonial.email && testimonial.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "approved") {
        filtered = filtered.filter((t) => t.approved)
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((t) => !t.approved)
      } else if (statusFilter === "featured") {
        filtered = filtered.filter((t) => t.featured)
      }
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter((t) => t.rating === Number.parseInt(ratingFilter))
    }

    setFilteredTestimonials(filtered)
  }

  const addTestimonial = async () => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestimonial),
      })

      if (response.ok) {
        const data = await response.json()
        setTestimonials([data.testimonial, ...testimonials])
        setNewTestimonial({
          name: "",
          email: "",
          rating: 5,
          comment: "",
          image_url: "",
          featured: false,
          approved: true,
        })
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to add testimonial",
        variant: "destructive",
      })
    }
  }

  const updateTestimonial = async (id: number, updates: Partial<Testimonial>) => {
    try {
      console.log("Updating testimonial:", id, updates) // Debug log

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Update response:", data) // Debug log

        setTestimonials(
          testimonials.map((testimonial) => (testimonial.id === id ? { ...testimonial, ...updates } : testimonial)),
        )
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        })
      } else {
        const errorData = await response.json()
        console.error("Update failed:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to update testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      })
    }
  }

  const deleteTestimonial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id))
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  const toggleApproval = (id: number, approved: boolean) => {
    updateTestimonial(id, { approved })
  }

  const toggleFeatured = (id: number, featured: boolean) => {
    updateTestimonial(id, { featured })
  }

  const exportTestimonials = () => {
    const csvContent = [
      ["Name", "Email", "Rating", "Comment", "Featured", "Approved", "Created At"].join(","),
      ...filteredTestimonials.map((t) =>
        [
          `"${t.name}"`,
          `"${t.email}"`,
          t.rating,
          `"${t.comment.replace(/"/g, '""')}"`,
          t.featured,
          t.approved,
          new Date(t.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "testimonials.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusColor = (testimonial: Testimonial) => {
    if (testimonial.featured) return "bg-purple-100 text-purple-800"
    if (testimonial.approved) return "bg-green-100 text-green-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const getStatusText = (testimonial: Testimonial) => {
    if (testimonial.featured) return "Featured"
    if (testimonial.approved) return "Approved"
    return "Pending"
  }

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter((t) => t.approved).length,
    pending: testimonials.filter((t) => !t.approved).length,
    featured: testimonials.filter((t) => t.featured).length,
    avgRating:
      testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : "0",
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading testimonials...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <div className="flex gap-2">
          <Button onClick={exportTestimonials} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTestimonial.email}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={newTestimonial.rating.toString()}
                      onValueChange={(value) =>
                        setNewTestimonial({ ...newTestimonial, rating: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{rating}</span>
                              <div className="flex">
                                {Array.from({ length: rating }, (_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      id="image_url"
                      value={newTestimonial.image_url}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestimonial.approved}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, approved: e.target.checked })}
                    />
                    <span>Approved</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestimonial.featured}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, featured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addTestimonial}>Add Testimonial</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <div className="text-sm text-gray-600">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No testimonials found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Testimonials will appear here when customers submit them."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    {testimonial.image_url && (
                      <img
                        src={testimonial.image_url || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-gray-600">{testimonial.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                        <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(testimonial)}>{getStatusText(testimonial)}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApproval(testimonial.id, !testimonial.approved)}
                        title={testimonial.approved ? "Unapprove" : "Approve"}
                      >
                        {testimonial.approved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(testimonial.id, !testimonial.featured)}
                        title={testimonial.featured ? "Unfeature" : "Feature"}
                        className={testimonial.featured ? "bg-purple-50" : ""}
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Submitted: {new Date(testimonial.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(testimonial.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
