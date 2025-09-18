"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, X } from "lucide-react"
import { formatPrice } from "@/lib/currency-utils"

interface InquiryPopupProps {
  packageData: {
    id: number
    title: string
    price: number | null // ❶ can be null
    price_text?: string // ❷ optional custom text
    duration_days: number
    max_participants: number | null // ❸ can be null
  }
  children: React.ReactNode
}

export function InquiryPopup({ packageData, children }: InquiryPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      package_id: packageData.id,
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert("Inquiry sent successfully! We'll get back to you soon.")
        setIsOpen(false)
        ;(e.target as HTMLFormElement).reset()
      } else {
        alert("Failed to send inquiry. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to send inquiry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const priceDisplay =
    packageData.price !== null && packageData.price !== undefined
      ? `${formatPrice(packageData.price)}/person`
      : packageData.price_text || "Contact for pricing"

  const maxGroupDisplay =
    packageData.max_participants !== null && packageData.max_participants !== undefined
      ? `${packageData.max_participants} people`
      : "—"

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Inquire about {packageData.title}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-4">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Price:</strong> {priceDisplay}
                  </div>
                  <div>
                    <strong>Duration:</strong> {packageData.duration_days} days
                  </div>
                  <div>
                    <strong>Max&nbsp;Group:</strong> {maxGroupDisplay}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your safari preferences..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Inquiry"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
