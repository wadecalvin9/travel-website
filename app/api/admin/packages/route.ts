import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if database is configured
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packages = await sql`
      SELECT p.*, d.name as destination_name, d.country
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if database is configured
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.detailed_description ||
      !data.duration_days ||
      !data.max_participants ||
      !data.image_url ||
      !data.destination_id ||
      !data.currency
    ) {
      return NextResponse.json({ error: "Missing required package fields" }, { status: 400 })
    }

    // Validate pricing based on type
    if (data.pricing_type === "fixed" && (!data.price || data.price <= 0)) {
      return NextResponse.json({ error: "Price must be greater than 0 for fixed pricing" }, { status: 400 })
    }

    if (data.pricing_type === "custom" && !data.price_text?.trim()) {
      return NextResponse.json({ error: "Price text is required for custom pricing" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO packages (
        title, description, detailed_description, price, price_text, pricing_type, 
        currency, duration_days, max_participants, image_url, gallery_images, 
        destination_id, included, excluded, itinerary, optional_activities, featured
      ) VALUES (
        ${data.title}, ${data.description}, ${data.detailed_description}, 
        ${data.price}, ${data.price_text}, ${data.pricing_type || "fixed"}, 
        ${data.currency}, ${data.duration_days}, ${data.max_participants}, 
        ${data.image_url}, ${JSON.stringify(data.gallery_images || [])}, ${data.destination_id}, 
        ${JSON.stringify(data.included || [])}, ${JSON.stringify(data.excluded || [])}, 
        ${JSON.stringify(data.itinerary || {})}, ${JSON.stringify(data.optional_activities || [])}, 
        ${data.featured || false}
      ) RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}
