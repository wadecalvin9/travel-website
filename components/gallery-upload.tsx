"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus, Upload, GripVertical, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface GalleryUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
}

export function GalleryUpload({ images, onChange, label = "Gallery Images" }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange([...images, data.url])
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Badge variant="secondary">{images.length} / 10</Badge>
      </div>

      {/* Add New Image */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
              />
              <Button type="button" onClick={addImageUrl} disabled={!newImageUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t" />
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t" />
            </div>

            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors mt-4"
            >
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Drag and drop images here, or click upload above</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="group relative">
              <CardContent className="p-2">
                <div className="aspect-video relative bg-gray-100 rounded overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => removeImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>

                    {index > 0 && (
                      <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, index - 1)}>
                        ←
                      </Button>
                    )}

                    {index < images.length - 1 && (
                      <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, index + 1)}>
                        →
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate flex-1">Image {index + 1}</span>
                  <Badge variant="outline" className="text-xs">
                    {index === 0 ? "Primary" : `#${index + 1}`}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Upload className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images in gallery</h3>
            <p className="text-gray-500 mb-4">Add images using the URL input or file upload above</p>
            <Badge variant="secondary">0 / 10 images</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
