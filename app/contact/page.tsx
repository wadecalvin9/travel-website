"use client"

import { useEffect, useState } from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InquiryForm } from "@/components/inquiry-form"

interface ContactSettings {
  contact_phone_primary?: string
  contact_email_primary?: string
  contact_address?: string
  whatsapp_number?: string
  site_name?: string
  map_embed_url?: string
}

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      console.log("Contact: Fetching settings...")
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
      console.log("Contact: Loaded settings:", loaded)

      if (loaded && typeof loaded === "object") {
        setSettings(loaded)
      }
    } catch (error) {
      console.error("Contact: Error fetching settings:", error)
      // Set fallback defaults
      setSettings({
        contact_phone_primary: "+254 700 123 456",
        contact_email_primary: "info@travelconnectexpeditions.com",
        contact_address: "Safari Center, 2nd Floor\nNairobi, Kenya\nP.O. Box 12345-00100",
        whatsapp_number: "+254700123456",
        site_name: "Travel Connect Expeditions",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse space-y-8">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Ready to start planning your African safari adventure? Get in touch with our expert team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {settings.contact_phone_primary && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">Phone</h3>
                      <a
                        href={`tel:${settings.contact_phone_primary}`}
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                      >
                        {settings.contact_phone_primary}
                      </a>
                    </div>
                  </div>
                )}

                {settings.contact_email_primary && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">Email</h3>
                      <a
                        href={`mailto:${settings.contact_email_primary}`}
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                      >
                        {settings.contact_email_primary}
                      </a>
                    </div>
                  </div>
                )}

                {settings.contact_address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">Office</h3>
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {settings.contact_address}
                      </div>
                    </div>
                  </div>
                )}

                {settings.whatsapp_number && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">WhatsApp</h3>
                      <a
                        href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        {settings.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Office Hours</h3>
                    <div className="text-gray-700 leading-relaxed">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Find Us</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {settings.map_embed_url ? (
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-orange-200 shadow-lg">
                    <iframe
                      src={settings.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office Location Map"
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-orange-700 font-medium">Interactive Map</p>
                      <p className="text-orange-600 text-sm">Configure map in admin settings</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InquiryForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">
                    What's the best time to visit for safari?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    The best time depends on your destination and what you want to see. Generally, dry seasons
                    (June-October) offer excellent wildlife viewing as animals gather around water sources.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">Do I need vaccinations?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, certain vaccinations are recommended or required depending on your destination. We'll provide
                    detailed health information once you book your safari.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">What should I pack?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We provide a comprehensive packing list with your booking confirmation. Essential items include
                    neutral-colored clothing, sun protection, and a good camera.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">Are safaris suitable for children?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Many of our safaris are family-friendly! We offer special family packages and can customize
                    itineraries to suit travelers of all ages.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
