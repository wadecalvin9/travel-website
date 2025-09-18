"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface GuestBookingPopupProps {
  packageId: number
  packageTitle: string
  packagePrice?: number
  children: React.ReactNode
}

export function GuestBookingPopup({ packageId, packageTitle, packagePrice, children }: GuestBookingPopupProps) {
  const [open, setOpen] = useState(false)
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
    if (!packagePrice) return "Price on request"
    const participants = Number.parseInt(formData.participants) || 1
    return `$${(packagePrice * participants).toLocaleString()}`
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
        status: "pending",
      }

      const response = await fetch("/api/guest-bookings", {
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

      toast.success("Booking request submitted successfully! We'll contact you soon to confirm details.")

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phone: "",
        participants: "1",
        travelDate: null,
        specialRequests: "",
      })
      setOpen(false)
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Booking
          </DialogTitle>
          <p className="text-sm text-gray-600">{packageTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="guest-name">Full Name *</Label>
            <Input
              id="guest-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="guest-email">Email *</Label>
            <Input
              id="guest-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="guest-phone">Phone Number</Label>
            <Input
              id="guest-phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="guest-participants">Number of People</Label>
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
                <SelectItem value="more">More than 8</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="guest-requests">Special Requests</Label>
            <Textarea
              id="guest-requests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={3}
            />
          </div>

          {packagePrice && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Total:</span>
                <span className="text-lg font-bold text-green-600">{calculateTotal()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Final price will be confirmed after reviewing your requirements
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
