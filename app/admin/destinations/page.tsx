"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Destination {
  id: number
  name: string
  country: string
  description: string
  image_url: string
  highlights: string[]
  package_count: number
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/admin/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
      toast({
        title: "Error",
        description: "Failed to load destinations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteDestination = async (id: number) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDestinations(destinations.filter((dest) => dest.id !== id))
        toast({
          title: "Success",
          description: "Destination deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading destinations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Destinations</h1>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Link>
        </Button>
      </div>

      {destinations.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first destination.</p>
              <Button asChild>
                <Link href="/admin/destinations/new">Add Destination</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Card key={destination.id}>
              <CardHeader>
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={destination.image_url || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{destination.name}</span>
                  <Badge variant="secondary">{destination.package_count} packages</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">{destination.country}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{destination.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/destinations/${destination.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteDestination(destination.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
