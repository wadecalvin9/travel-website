"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface Destination {
  id: number
  name: string
  description: string
  image_url: string
  country: string
  featured: boolean
}

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    country: "",
    featured: false,
  })

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/auth/signin")
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetchDestination()
    }
  }, [isAdmin, params.id])

  const fetchDestination = async () => {
    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDestination(data)
        setFormData({
          name: data.name || "",
          description: data.description || "",
          image_url: data.image_url || "",
          country: data.country || "",
          featured: data.featured || false,
        })
      } else if (response.status === 404) {
        toast({
          title: "Error",
          description: "Destination not found",
          variant: "destructive",
        })
        router.push("/admin/destinations")
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch destination",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch destination",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Destination updated successfully",
        })
        router.push("/admin/destinations")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update destination",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update destination",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-4">The destination you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/admin/destinations">Back to Destinations</Link>
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
            <Link href="/admin/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Destinations
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Destination</h1>
          <p className="text-gray-600">Update destination information</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Destination Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Destination Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter destination name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter destination description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="Enter image URL"
                  type="url"
                />
              </div>

              {formData.image_url && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Destination</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/destinations">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
