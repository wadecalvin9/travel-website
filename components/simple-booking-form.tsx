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
import { CalendarIcon, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface SimpleBookingFormProps {
  packageId: number
  packageTitle: string
  packagePrice?: number
  currency?: string
}

export function SimpleBookingForm({ packageId, packageTitle, packagePrice, currency = "USD" }: SimpleBookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: "1",
    travelDate: null as Date | null,
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const calculateTotal = () => {
    if (!packagePrice) return "To be determined"
    const participants = Number.parseInt(formData.participants) || 1
    const total = packagePrice * participants
    return `${currency === "USD" ? "$" : currency} ${total.toLocaleString()}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bookingData = {
        package_id: packageId,
        package_title: packageTitle,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        participants: Number.parseInt(formData.participants) || 1,
        travel_date: formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : null,
        special_requests: formData.specialRequests,
        total_price: packagePrice ? packagePrice * (Number.parseInt(formData.participants) || 1) : null,
        currency: currency,
        status: "pending",
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit booking")
      }

      toast.success("Booking submitted successfully! We'll contact you soon to confirm details and payment.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        participants: "1",
        travelDate: null,
        specialRequests: "",
      })
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Book This Package
        </CardTitle>
        <p className="text-sm text-gray-600">{packageTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="booking-name">Full Name *</Label>
              <Input
                id="booking-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="booking-email">Email *</Label>
              <Input
                id="booking-email"
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
              <Label htmlFor="booking-phone">Phone Number</Label>
              <Input
                id="booking-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="booking-participants">Number of People</Label>
              <Select value={formData.participants} onValueChange={(value) => handleInputChange("participants", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                  {formData.travelDate ? format(formData.travelDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.travelDate || undefined}
                  onSelect={(date) => handleInputChange("travelDate", date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="booking-requests">Special Requests</Label>
            <Textarea
              id="booking-requests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder="Any special requirements, dietary restrictions, or requests..."
              rows={4}
            />
          </div>

          {packagePrice && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-blue-900">Estimated Total:</span>
                <span className="text-xl font-bold text-blue-600">{calculateTotal()}</span>
              </div>
              <p className="text-sm text-blue-700">
                Final price will be confirmed after reviewing your requirements. Payment will be processed after
                confirmation.
              </p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting Booking..." : "Submit Booking Request"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to our terms and conditions. This is a booking request and not a
            confirmed reservation until we contact you.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
