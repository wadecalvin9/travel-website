"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function NewDestinationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    image_url: "",
    highlights: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.split("\n").filter((h) => h.trim()),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Destination created successfully",
        })
        router.push("/admin/destinations")
      } else {
        throw new Error("Failed to create destination")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create destination",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/admin/destinations">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Destinations
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add New Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Destination Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="highlights">Highlights (one per line)</Label>
              <Textarea
                id="highlights"
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                rows={4}
                placeholder="Beautiful landscapes&#10;Rich wildlife&#10;Cultural experiences"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Destination"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
