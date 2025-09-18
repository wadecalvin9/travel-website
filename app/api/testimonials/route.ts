import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    rating: 5,
    comment:
      "Absolutely incredible experience! The guides were knowledgeable and the wildlife viewing was beyond our expectations.",
    featured: true,
    approved: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    rating: 5,
    comment: "Best vacation of our lives! The Serengeti was breathtaking and the accommodations were top-notch.",
    featured: true,
    approved: true,
    created_at: "2024-01-10T14:30:00Z",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@example.com",
    rating: 4,
    comment: "Amazing trek to Kilimanjaro base camp. Well organized and our guide was fantastic!",
    featured: false,
    approved: true,
    created_at: "2024-01-05T09:15:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, returning mock testimonials")
      return NextResponse.json(featured ? mockTestimonials.filter((t) => t.featured) : mockTestimonials)
    }

    // Try to fetch from database
    try {
      let testimonials

      if (featured) {
        testimonials = await sql`
          SELECT * FROM testimonials
          WHERE featured = true AND approved = true
          ORDER BY created_at DESC
        `
      } else {
        testimonials = await sql`
          SELECT * FROM testimonials
          WHERE approved = true
          ORDER BY created_at DESC
          LIMIT 10
        `
      }

      return NextResponse.json(testimonials)
    } catch (dbError) {
      console.error("Database query failed, returning mock testimonials:", dbError)
      return NextResponse.json(featured ? mockTestimonials.filter((t) => t.featured) : mockTestimonials)
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, rating, comment } = body

    // Validate required fields
    if (!name || !email || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, simulating testimonial submission")
      return NextResponse.json({
        message: "Testimonial submitted successfully (demo mode)",
        id: Date.now(),
      })
    }

    // Try to insert into database
    try {
      const result = await sql`
        INSERT INTO testimonials (name, email, rating, comment, approved, featured)
        VALUES (${name}, ${email}, ${rating}, ${comment}, false, false)
        RETURNING id
      `

      return NextResponse.json({
        message: "Testimonial submitted successfully and is pending approval",
        id: result[0].id,
      })
    } catch (dbError) {
      console.error("Database insert failed:", dbError)
      return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 })
  }
}
