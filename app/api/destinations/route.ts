import { type NextRequest, NextResponse } from "next/server"
import { getDestinations } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"

    const destinations = await getDestinations()

    // Filter for featured destinations if requested
    const filteredDestinations = featured ? destinations.filter((dest: any) => dest.featured) : destinations

    return NextResponse.json(filteredDestinations)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 })
  }
}
