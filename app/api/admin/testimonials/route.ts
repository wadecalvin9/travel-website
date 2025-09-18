import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const testimonials = await sql`
      SELECT *
      FROM testimonials
      ORDER BY created_at DESC
    `

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, rating, comment, image_url, featured, approved } = body

    // Validate required fields
    if (!name || !email || !comment || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, simulating testimonial creation")
      return NextResponse.json({
        message: "Testimonial created successfully (demo mode)",
        testimonial: {
          id: Date.now(),
          name,
          email,
          rating,
          comment,
          image_url: image_url || null,
          featured: featured || false,
          approved: approved !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    }

    try {
      const result = await sql`
        INSERT INTO testimonials (name, email, rating, comment, image_url, featured, approved)
        VALUES (${name}, ${email}, ${rating}, ${comment}, ${image_url || null}, ${featured || false}, ${approved !== false})
        RETURNING *
      `

      return NextResponse.json({
        message: "Testimonial created successfully",
        testimonial: result[0],
      })
    } catch (dbError) {
      console.error("Database insert failed:", dbError)
      return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
