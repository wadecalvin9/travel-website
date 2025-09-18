import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 })
    }

    const body = await request.json()
    console.log("PATCH request body:", body)

    const { approved, featured } = body

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, simulating testimonial update")
      return NextResponse.json({
        message: "Testimonial updated successfully (demo mode)",
        id,
        approved,
        featured,
      })
    }

    try {
      let result

      // Handle approved field update
      if (typeof approved === "boolean") {
        console.log(`Updating approved status to ${approved} for testimonial ${id}`)
        result = await sql`
          UPDATE testimonials 
          SET approved = ${approved}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id} 
          RETURNING *
        `
      }

      // Handle featured field update
      if (typeof featured === "boolean") {
        console.log(`Updating featured status to ${featured} for testimonial ${id}`)
        result = await sql`
          UPDATE testimonials 
          SET featured = ${featured}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id} 
          RETURNING *
        `
      }

      // If both fields are provided, update them together
      if (typeof approved === "boolean" && typeof featured === "boolean") {
        console.log(`Updating both approved (${approved}) and featured (${featured}) for testimonial ${id}`)
        result = await sql`
          UPDATE testimonials 
          SET approved = ${approved}, featured = ${featured}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id} 
          RETURNING *
        `
      }

      if (!result || result.length === 0) {
        console.error("Update query returned no results")
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
      }

      console.log("Update successful:", result[0])
      return NextResponse.json({
        message: "Testimonial updated successfully",
        testimonial: result[0],
      })
    } catch (dbError) {
      console.error("Database update failed:", dbError)
      return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 })
    }

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, simulating testimonial deletion")
      return NextResponse.json({
        message: "Testimonial deleted successfully (demo mode)",
        id,
      })
    }

    try {
      const result = await sql`
        DELETE FROM testimonials 
        WHERE id = ${id}
        RETURNING id
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
      }

      return NextResponse.json({
        message: "Testimonial deleted successfully",
        id: result[0].id,
      })
    } catch (dbError) {
      console.error("Database delete failed:", dbError)
      return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
