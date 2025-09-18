"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"
import { GalleryUpload } from "@/components/gallery-upload"
import { PricingInput } from "@/components/pricing-input"
import { ItineraryInput } from "@/components/itinerary-input"

type Destination = {
  id: number
  name: string
  country: string
}

export default function NewPackagePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [detailedDescription, setDetailedDescription] = useState("")
  const [durationDays, setDurationDays] = useState(1)
  const [maxParticipants, setMaxParticipants] = useState(0)
  const [destinationId, setDestinationId] = useState<number | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [includedItems, setIncludedItems] = useState<string[]>([""])
  const [excludedItems, setExcludedItems] = useState<string[]>([""])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [itinerary, setItinerary] = useState<Record<string, string>>({})
  const [isFeatured, setIsFeatured] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState("USD")
  const [priceText, setPriceText] = useState("")
  const [pricingType, setPricingType] = useState<"fixed" | "custom">("fixed")
  const router = useRouter()
  const [optionalActivities, setOptionalActivities] = useState<
    Array<{
      title: string
      description: string
      price?: number
      duration?: string
    }>
  >([])

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/destinations")
        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status}`)
        }
        const data = await response.json()
        setDestinations(data)
      } catch (error: any) {
        console.error("Error fetching destinations:", error.message)
        setError(error.message)
      }
    }

    fetchDestinations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error("Title is required")
      }
      if (!description.trim()) {
        throw new Error("Description is required")
      }
      if (!detailedDescription.trim()) {
        throw new Error("Detailed description is required")
      }
      if (!destinationId) {
        throw new Error("Destination is required")
      }
      if (pricingType === "fixed" && price <= 0) {
        throw new Error("Price must be greater than 0 for fixed pricing")
      }
      if (pricingType === "custom" && !priceText.trim()) {
        throw new Error("Please enter pricing text")
      }
      if (durationDays <= 0) {
        throw new Error("Duration must be greater than 0")
      }

      // Prepare data for submission
      const packageData = {
        title: title.trim(),
        description: description.trim(),
        detailed_description: detailedDescription.trim(),
        duration_days: durationDays,
        max_participants: maxParticipants || null,
        destination_id: destinationId,
        price: pricingType === "fixed" ? price : null,
        price_text: pricingType === "custom" ? priceText : null,
        pricing_type: pricingType,
        currency: currency,
        image_url: imageUrl.trim(),
        featured: isFeatured,
        included: includedItems.filter((item) => item.trim() !== ""),
        excluded: excludedItems.filter((item) => item.trim() !== ""),
        gallery_images: galleryImages.filter((url) => url.trim() !== ""),
        itinerary: itinerary,
        optional_activities: optionalActivities.filter((activity) => activity.title.trim() !== ""),
      }

      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || `Failed to create package: ${response.status}`)
      }

      toast.success("Package created successfully")
      router.push("/admin/packages")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating package:", error.message)
      setError(error.message)
      toast.error(`Failed to create package: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Array management functions
  const handleArrayChange = (array: string[], setArray: (arr: string[]) => void, index: number, value: string) => {
    const newArray = [...array]
    newArray[index] = value
    setArray(newArray)
  }

  const addArrayItem = (array: string[], setArray: (arr: string[]) => void) => {
    setArray([...array, ""])
  }

  const removeArrayItem = (array: string[], setArray: (arr: string[]) => void, index: number) => {
    const newArray = array.filter((_, i) => i !== index)
    setArray(newArray)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Package</h1>
          <p className="text-gray-600">Add a new travel package to your catalog</p>
        </div>

        {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Package Title *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Select
                    value={destinationId?.toString() || ""}
                    onValueChange={(value) => setDestinationId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id} value={dest.id.toString()}>
                          {dest.name}, {dest.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="detailed_description">Detailed Description *</Label>
                <Textarea
                  id="detailed_description"
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  required
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PricingInput
                price={price}
                priceText={priceText}
                currency={currency}
                pricingType={pricingType}
                onPriceChange={setPrice}
                onPriceTextChange={setPriceText}
                onCurrencyChange={setCurrency}
                onPricingTypeChange={setPricingType}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    required
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    min="1"
                    placeholder="Optional - leave blank for unlimited"
                  />
                </div>
              </div>

              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                label="Main Image"
                required
                placeholder="https://example.com/image.jpg"
              />

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="featured">Featured Package</Label>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryUpload images={galleryImages} onChange={setGalleryImages} label="Additional Images" />
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange(includedItems, setIncludedItems, index, e.target.value)}
                    placeholder="e.g., Professional guide, All meals, Transportation"
                    className="flex-1"
                  />
                  {includedItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem(includedItems, setIncludedItems, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(includedItems, setIncludedItems)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Included Item
              </Button>
            </CardContent>
          </Card>

          {/* What's Excluded */}
          <Card>
            <CardHeader>
              <CardTitle>What's Excluded</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {excludedItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange(excludedItems, setExcludedItems, index, e.target.value)}
                    placeholder="e.g., International flights, Travel insurance, Personal expenses"
                    className="flex-1"
                  />
                  {excludedItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem(excludedItems, setExcludedItems, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(excludedItems, setExcludedItems)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Excluded Item
              </Button>
            </CardContent>
          </Card>

          {/* Daily Itinerary */}
          <ItineraryInput
            itinerary={itinerary}
            onChange={setItinerary}
            optionalActivities={optionalActivities}
            onOptionalActivitiesChange={setOptionalActivities}
            label="Daily Itinerary"
          />

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/packages")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
