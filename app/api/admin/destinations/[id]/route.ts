import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const destinationId = Number.parseInt(params.id)

    const result = await sql`
      SELECT * FROM destinations WHERE id = ${destinationId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching destination:", error)
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const destinationId = Number.parseInt(params.id)
    const { name, description, image_url, country, featured } = await request.json()

    const result = await sql`
      UPDATE destinations 
      SET 
        name = ${name},
        description = ${description},
        image_url = ${image_url},
        country = ${country},
        featured = ${featured},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${destinationId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating destination:", error)
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const destinationId = Number.parseInt(params.id)
    const { featured } = await request.json()

    const result = await sql`
      UPDATE destinations 
      SET featured = ${featured}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${destinationId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating destination:", error)
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const destinationId = Number.parseInt(params.id)

    // Check if destination has packages
    const packages = await sql`SELECT COUNT(*) as count FROM packages WHERE destination_id = ${destinationId}`
    if (Number.parseInt(packages[0].count) > 0) {
      return NextResponse.json({ error: "Cannot delete destination with existing packages" }, { status: 400 })
    }

    const result = await sql`DELETE FROM destinations WHERE id = ${destinationId} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting destination:", error)
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 })
  }
}
