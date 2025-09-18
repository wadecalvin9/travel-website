"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "@/components/settings-provider"
import { useToast } from "@/hooks/use-toast"
import { X, MessageCircle, Loader2 } from "lucide-react"

export function ChatWidget() {
  const { settings, loading } = useSettings()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)

  // Don't render if chat is disabled or still loading
  if (loading || settings.chat_widget_enabled !== "true") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      })

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "We'll get back to you soon!",
        })
        setMessage("")
        setName("")
        setEmail("")
        setIsOpen(false)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat with us</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Textarea
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
              />
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="rounded-full h-12 w-12 shadow-lg" size="sm">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
