import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Get reviews with user and package information
    const reviews = await sql`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        p.title as package_title
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN packages p ON r.package_id = p.id
      ORDER BY r.created_at DESC
    `

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { user_id, package_id, rating, comment, images } = body

    if (!user_id || !package_id || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO reviews (user_id, package_id, rating, comment, images, approved)
      VALUES (${user_id}, ${package_id}, ${rating}, ${comment || null}, ${JSON.stringify(images || [])}, false)
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
