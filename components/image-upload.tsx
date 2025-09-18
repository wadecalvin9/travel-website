"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  required = false,
  placeholder = "Enter image URL or upload file",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
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
      onChange(data.url)
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

  const clearImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label>
        {label} {required && "*"}
      </Label>

      {/* URL Input */}
      <div className="flex space-x-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {value && (
          <Button type="button" variant="outline" size="sm" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File Upload */}
      <div className="flex items-center space-x-2">
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">Drag and drop an image here, or click upload above</p>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <img
            src={value || "/placeholder.svg"}
            alt="Preview"
            className="max-w-full h-32 object-cover rounded-lg border"
            onError={() => toast.error("Failed to load image preview")}
          />
        </div>
      )}
    </div>
  )
}
