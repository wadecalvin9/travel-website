import { notFound } from "next/navigation"
import { Clock, Users, MapPin, Check, X, Calendar, MessageCircle, Plus, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InquiryForm } from "@/components/inquiry-form"
import { getPackageById, incrementPackageViews } from "@/lib/db"
import { incrementViews } from "@/lib/redis"
import Link from "next/link"
import { InquiryPopup } from "@/components/inquiry-popup"
import { formatPrice } from "@/lib/currency-utils"

interface PackageDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PackageDetailPageProps) {
  const packageId = Number.parseInt(params.id)
  const pkg = await getPackageById(packageId)

  if (!pkg) {
    return {
      title: "Package Not Found",
      description: "The requested safari package could not be found.",
    }
  }

  return {
    title: `${pkg.title} - Travel Connect Expeditions`,
    description: pkg.description,
    openGraph: {
      title: pkg.title,
      description: pkg.description,
      images: [pkg.image_url],
    },
  }
}

// Helper function to format itinerary content with proper bullet point handling
function formatItineraryContent(content: string) {
  if (!content) return null

  // Check if content has bullet points (starts with • or contains •)
  if (content.includes("•")) {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    return (
      <ul className="space-y-2">
        {lines.map((line, index) => {
          // Remove existing bullet point if present
          const cleanLine = line.startsWith("•") ? line.substring(1).trim() : line
          return (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-1 flex-shrink-0">•</span>
              <span className="text-gray-700">{cleanLine}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  // Check if content has line breaks for bullet formatting
  if (content.includes("\n")) {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    if (lines.length > 1) {
      return (
        <ul className="space-y-2">
          {lines.map((line, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-1 flex-shrink-0">•</span>
              <span className="text-gray-700">{line}</span>
            </li>
          ))}
        </ul>
      )
    }
  }

  // Return as paragraph for single line content
  return <p className="text-gray-700 leading-relaxed">{content}</p>
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const packageId = Number.parseInt(params.id)
  const pkg = await getPackageById(packageId)

  if (!pkg) {
    notFound()
  }

  // Increment view count in both database and Redis
  await Promise.all([incrementPackageViews(packageId), incrementViews(packageId)])

  // Parse optional activities if they exist
  let optionalActivities: Array<{
    title: string
    description: string
    price?: number
    duration?: string
  }> = []

  try {
    if (pkg.optional_activities) {
      if (typeof pkg.optional_activities === "string") {
        optionalActivities = JSON.parse(pkg.optional_activities)
      } else if (Array.isArray(pkg.optional_activities)) {
        optionalActivities = pkg.optional_activities
      }
    }
  } catch (error) {
    console.error("Error parsing optional activities:", error)
  }

  // Filter out empty optional activities
  optionalActivities = optionalActivities.filter((activity) => activity.title && activity.title.trim())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${pkg.image_url})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              {pkg.featured && <Badge className="bg-green-600">Featured</Badge>}
              <Badge variant="secondary">{pkg.view_count + 1} views</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pkg.title}</h1>
            <div className="flex flex-wrap gap-6 text-white text-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {pkg.duration_days} days
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Max {pkg.max_participants} people
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {pkg.destination_name}, {pkg.country}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md">
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3">
                <Link href="#inquiry-form">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book This Safari
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 text-lg py-3 bg-transparent"
              >
                <Link href="#inquiry-form">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send Inquiry
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Safari</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{pkg.detailed_description}</p>
              </CardContent>
            </Card>

            {/* Itinerary */}
            {pkg.itinerary && Object.keys(pkg.itinerary).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(pkg.itinerary).map(([day, activity]) => (
                      <div key={day} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {day.replace(/\D/g, "") || "1"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </h4>
                          <div className="text-gray-700">{formatItineraryContent(activity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optional Activities - Only show if there are valid activities */}
            {optionalActivities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-orange-600" />
                    Optional Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optionalActivities.map((activity, index) => (
                      <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-orange-800 text-lg">{activity.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-orange-600">
                            {activity.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}
                              </div>
                            )}
                            {activity.price && activity.price > 0 && (
                              <div className="flex items-center gap-1 font-semibold">
                                <DollarSign className="h-3 w-3" />${activity.price}
                              </div>
                            )}
                          </div>
                        </div>
                        {activity.description && <p className="text-gray-700">{activity.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">What's Excluded</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.excluded.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Gallery */}
            {pkg.gallery_images && pkg.gallery_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pkg.gallery_images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${pkg.title} gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Booking */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {pkg.pricing_type === "fixed" ? (
                    <>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatPrice(pkg.price, pkg.currency ?? "USD")}
                      </div>
                      <p className="text-gray-600">per person</p>
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {pkg.price_text ?? "Contact for Pricing"}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{pkg.duration_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Group:</span>
                    <span className="font-semibold">{pkg.max_participants} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-semibold">{pkg.destination_name}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <InquiryPopup
                    packageData={{
                      id: pkg.id,
                      title: pkg.title,
                      price: pkg.price,
                      duration_days: pkg.duration_days,
                      max_participants: pkg.max_participants,
                    }}
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Inquire About This Safari
                    </Button>
                  </InquiryPopup>
                </div>

                <Button asChild variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Available year-round</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Small group experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Expert local guides</span>
                </div>
                {optionalActivities.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">{optionalActivities.length} optional activities</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book This Safari or Send an Inquiry</h2>
            <p className="text-gray-600 text-lg">
              Ready to book or have questions? Fill out the form below and we'll get back to you within 24 hours with
              personalized recommendations and booking details.
            </p>
          </div>
          <InquiryForm packageId={pkg.id} packageTitle={pkg.title} />
        </div>
      </div>
    </div>
  )
}
