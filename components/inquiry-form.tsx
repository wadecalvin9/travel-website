"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Send } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface InquiryFormProps {
  packageId?: number
  packageTitle?: string
  onClose?: () => void
}

export function InquiryForm({ packageId, packageTitle, onClose }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: "",
    preferredDate: null as Date | null,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const inquiryData = {
        package_id: packageId,
        package_title: packageTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        participants: formData.participants || "Not specified",
        preferred_date: formData.preferredDate ? format(formData.preferredDate, "yyyy-MM-dd") : null,
        message: formData.message,
        status: "pending",
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit inquiry")
      }

      toast.success("Inquiry submitted successfully! We'll get back to you soon.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        participants: "",
        preferredDate: null,
        message: "",
      })

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit inquiry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Inquiry
        </CardTitle>
        {packageTitle && <p className="text-sm text-gray-600">For: {packageTitle}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="participants">Number of People</Label>
              <Select value={formData.participants} onValueChange={(value) => handleInputChange("participants", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of people" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-specified">Not specified</SelectItem>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5">5 people</SelectItem>
                  <SelectItem value="6">6 people</SelectItem>
                  <SelectItem value="7">7 people</SelectItem>
                  <SelectItem value="8">8 people</SelectItem>
                  <SelectItem value="9">9 people</SelectItem>
                  <SelectItem value="10">10 people</SelectItem>
                  <SelectItem value="more">More than 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Preferred Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.preferredDate ? format(formData.preferredDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.preferredDate || undefined}
                  onSelect={(date) => handleInputChange("preferredDate", date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your travel preferences, special requirements, or any questions you have..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
