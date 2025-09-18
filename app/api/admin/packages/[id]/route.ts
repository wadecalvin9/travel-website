import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packageId = Number.parseInt(params.id)
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const result = await sql`
      SELECT p.*, d.name as destination_name, d.country
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      WHERE p.id = ${packageId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packageId = Number.parseInt(params.id)
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const data = await request.json()

    // Handle gallery images - ensure it's an array
    let galleryImages = data.gallery_images
    if (typeof galleryImages === "string") {
      try {
        galleryImages = JSON.parse(galleryImages)
      } catch {
        galleryImages = []
      }
    }
    if (!Array.isArray(galleryImages)) {
      galleryImages = []
    }

    // Handle included/excluded arrays
    let included = data.included
    if (typeof included === "string") {
      try {
        included = JSON.parse(included)
      } catch {
        included = []
      }
    }
    if (!Array.isArray(included)) {
      included = []
    }

    let excluded = data.excluded
    if (typeof excluded === "string") {
      try {
        excluded = JSON.parse(excluded)
      } catch {
        excluded = []
      }
    }
    if (!Array.isArray(excluded)) {
      excluded = []
    }

    // Handle itinerary object
    let itinerary = data.itinerary
    if (typeof itinerary === "string") {
      try {
        itinerary = JSON.parse(itinerary)
      } catch {
        itinerary = {}
      }
    }
    if (typeof itinerary !== "object" || itinerary === null) {
      itinerary = {}
    }

    // Handle optional activities
    let optionalActivities = data.optional_activities
    if (typeof optionalActivities === "string") {
      try {
        optionalActivities = JSON.parse(optionalActivities)
      } catch {
        optionalActivities = []
      }
    }
    if (!Array.isArray(optionalActivities)) {
      optionalActivities = []
    }

    const result = await sql`
      UPDATE packages SET
        title = ${data.title},
        description = ${data.description},
        detailed_description = ${data.detailed_description},
        price = ${data.pricing_type === "fixed" ? data.price : null},
        price_text = ${data.pricing_type === "custom" ? data.price_text : null},
        pricing_type = ${data.pricing_type || "fixed"},
        currency = ${data.currency || "USD"},
        duration_days = ${data.duration_days},
        max_participants = ${data.max_participants},
        destination_id = ${data.destination_id},
        image_url = ${data.image_url},
        gallery_images = ${JSON.stringify(galleryImages)}::jsonb,
        included = ${JSON.stringify(included)}::jsonb,
        excluded = ${JSON.stringify(excluded)}::jsonb,
        itinerary = ${JSON.stringify(itinerary)}::jsonb,
        optional_activities = ${JSON.stringify(optionalActivities)}::jsonb,
        featured = ${data.featured || false},
        updated_at = NOW()
      WHERE id = ${packageId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packageId = Number.parseInt(params.id)
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const result = await sql`
      DELETE FROM packages
      WHERE id = ${packageId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}
