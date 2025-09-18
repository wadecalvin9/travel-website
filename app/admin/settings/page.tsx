"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Settings, Phone, Share2, ImageIcon, MapPin } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface SiteSettings {
  // Branding
  site_name: string
  site_tagline: string
  site_logo: string
  favicon: string

  // Theme Colors
  primary_color: string
  secondary_color: string
  accent_color: string

  // Hero Section
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_background_image: string
  hero_video_url: string

  // Contact Information
  contact_phone_primary: string
  contact_email_primary: string
  contact_address: string
  whatsapp_number: string

  // Social Media
  social_facebook: string
  social_instagram: string
  social_twitter: string

  // Map Settings
  map_embed_url: string

  // Footer Content
  footer_description: string
  footer_copyright: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    // Branding
    site_name: "",
    site_tagline: "",
    site_logo: "",
    favicon: "",

    // Theme Colors
    primary_color: "#16a34a",
    secondary_color: "#059669",
    accent_color: "#f59e0b",

    // Hero Section
    hero_title: "",
    hero_subtitle: "",
    hero_cta_text: "",
    hero_background_image: "",
    hero_video_url: "",

    // Contact Information
    contact_phone_primary: "",
    contact_email_primary: "",
    contact_address: "",
    whatsapp_number: "",

    // Social Media
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",

    // Map Settings
    map_embed_url: "",

    // Footer Content
    footer_description: "",
    footer_copyright: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      console.log("Fetching settings...")
      const response = await fetch("/api/admin/settings", {
        headers: { Accept: "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const contentType = response.headers.get("content-type") ?? ""
      if (!contentType.includes("application/json")) {
        throw new Error(`Unexpected content-type: ${contentType}`)
      }

      const { settings: loaded } = await response.json()
      console.log("Loaded settings:", loaded)

      if (loaded && typeof loaded === "object") {
        setSettings((prev) => ({ ...prev, ...loaded }))
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings – showing defaults.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      console.log("Submitting settings:", settings)

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Save result:", result)
        toast({
          title: "Success",
          description: "Settings updated successfully",
        })
      } else {
        const error = await response.json()
        console.error("Save error:", error)
        throw new Error(error.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    console.log(`Changing ${field} to:`, value)
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Site Settings
        </h1>
        <p className="text-muted-foreground">Configure your website settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Maps
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core site information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange("site_name", e.target.value)}
                      placeholder="Travel Connect Expeditions"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_tagline">Site Tagline</Label>
                    <Input
                      id="site_tagline"
                      value={settings.site_tagline}
                      onChange={(e) => handleInputChange("site_tagline", e.target.value)}
                      placeholder="African Safari Adventures"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>Upload and configure your site branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    value={settings.site_logo}
                    onChange={(url) => handleInputChange("site_logo", url)}
                    label="Site Logo"
                    placeholder="Upload or enter logo URL"
                  />

                  <ImageUpload
                    value={settings.favicon}
                    onChange={(url) => handleInputChange("favicon", url)}
                    label="Favicon"
                    placeholder="Upload or enter favicon URL"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Colors</CardTitle>
                  <CardDescription>Customize your website colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={settings.primary_color}
                          onChange={(e) => handleInputChange("primary_color", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.primary_color}
                          onChange={(e) => handleInputChange("primary_color", e.target.value)}
                          placeholder="#16a34a"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={settings.secondary_color}
                          onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.secondary_color}
                          onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                          placeholder="#059669"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accent_color">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent_color"
                          type="color"
                          value={settings.accent_color}
                          onChange={(e) => handleInputChange("accent_color", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.accent_color}
                          onChange={(e) => handleInputChange("accent_color", e.target.value)}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Homepage hero configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero_title">Hero Title</Label>
                    <Input
                      id="hero_title"
                      value={settings.hero_title}
                      onChange={(e) => handleInputChange("hero_title", e.target.value)}
                      placeholder="Discover Africa's Wild Heart"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                    <Textarea
                      id="hero_subtitle"
                      value={settings.hero_subtitle}
                      onChange={(e) => handleInputChange("hero_subtitle", e.target.value)}
                      placeholder="Embark on unforgettable safari adventures across East and Southern Africa"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_cta_text">CTA Button Text</Label>
                    <Input
                      id="hero_cta_text"
                      value={settings.hero_cta_text}
                      onChange={(e) => handleInputChange("hero_cta_text", e.target.value)}
                      placeholder="Explore Packages"
                    />
                  </div>

                  <ImageUpload
                    value={settings.hero_background_image}
                    onChange={(url) => handleInputChange("hero_background_image", url)}
                    label="Hero Background Image"
                    placeholder="Upload or enter hero background image URL"
                  />

                  <div>
                    <Label htmlFor="hero_video_url">Hero Video URL</Label>
                    <Input
                      id="hero_video_url"
                      value={settings.hero_video_url}
                      onChange={(e) => handleInputChange("hero_video_url", e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      This video will be opened when users click "Watch Our Story" button. Supports YouTube, Vimeo, and
                      direct video links.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your business contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email_primary">Primary Email</Label>
                    <Input
                      id="contact_email_primary"
                      type="email"
                      value={settings.contact_email_primary}
                      onChange={(e) => handleInputChange("contact_email_primary", e.target.value)}
                      placeholder="info@travelconnectexpeditions.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone_primary">Primary Phone</Label>
                    <Input
                      id="contact_phone_primary"
                      value={settings.contact_phone_primary}
                      onChange={(e) => handleInputChange("contact_phone_primary", e.target.value)}
                      placeholder="+254 700 123 456"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      value={settings.whatsapp_number}
                      onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                      placeholder="+254700123456"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_address">Business Address</Label>
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange("contact_address", e.target.value)}
                    placeholder="Safari Center, 2nd Floor&#10;Nairobi, Kenya&#10;P.O. Box 12345-00100"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps">
            <Card>
              <CardHeader>
                <CardTitle>Map Configuration</CardTitle>
                <CardDescription>Configure the embedded map for your contact page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="map_embed_url">Google Maps Embed URL</Label>
                  <Textarea
                    id="map_embed_url"
                    value={settings.map_embed_url}
                    onChange={(e) => handleInputChange("map_embed_url", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8197..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    To get the embed URL: Go to Google Maps → Search for your location → Click "Share" → Click "Embed a
                    map" → Copy the src URL from the iframe code
                  </p>
                </div>
                {settings.map_embed_url && (
                  <div className="mt-4">
                    <Label>Map Preview</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <iframe
                        src={settings.map_embed_url}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location Preview"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="social_facebook">Facebook URL</Label>
                    <Input
                      id="social_facebook"
                      value={settings.social_facebook}
                      onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/travelconnectexpeditions"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_instagram">Instagram URL</Label>
                    <Input
                      id="social_instagram"
                      value={settings.social_instagram}
                      onChange={(e) => handleInputChange("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/travelconnectexpeditions"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_twitter">Twitter URL</Label>
                    <Input
                      id="social_twitter"
                      value={settings.social_twitter}
                      onChange={(e) => handleInputChange("social_twitter", e.target.value)}
                      placeholder="https://twitter.com/travelconnectexp"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>Footer text and copyright information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="footer_description">Footer Description</Label>
                  <Textarea
                    id="footer_description"
                    value={settings.footer_description}
                    onChange={(e) => handleInputChange("footer_description", e.target.value)}
                    placeholder="Creating unforgettable safari experiences across Africa since 2010."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="footer_copyright">Copyright Text</Label>
                  <Input
                    id="footer_copyright"
                    value={settings.footer_copyright}
                    onChange={(e) => handleInputChange("footer_copyright", e.target.value)}
                    placeholder="© 2024 Travel Connect Expeditions. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={saving} size="lg">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
