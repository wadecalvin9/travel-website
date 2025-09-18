"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/components/settings-provider"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"

export function NewsletterSection() {
  const { settings, loading } = useSettings()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Don't render if newsletter is disabled or still loading
  if (loading || settings.newsletter_enabled !== "true") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call - replace with actual newsletter API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter",
      })
      setEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {settings.footer_newsletter_text || "Stay Updated with Our Latest Adventures"}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get exclusive deals, travel tips, and destination guides delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background text-foreground"
              required
            />
            <Button type="submit" variant="secondary" disabled={isSubmitting} className="whitespace-nowrap">
              {isSubmitting ? (
                <>
                  <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
