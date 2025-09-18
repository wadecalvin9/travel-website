import Link from "next/link"
import { MapPin, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDestinations } from "@/lib/db"

export const metadata = {
  title: "Safari Destinations - Travel Connect Expeditions",
  description: "Explore Africa's most spectacular wildlife destinations and discover unique safari experiences.",
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safari Destinations</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore Africa's most spectacular wildlife destinations. Each location offers unique experiences and
            incredible opportunities to witness nature's greatest spectacles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination: any) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={destination.image_url || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  {destination.featured && <Badge className="absolute top-2 left-2 bg-green-600">Featured</Badge>}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {destination.package_count} packages
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                <div className="flex items-center gap-1 text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  {destination.country}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                <Button asChild className="w-full">
                  <Link href={`/packages?destination=${encodeURIComponent(destination.name.toLowerCase())}`}>
                    View Packages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
