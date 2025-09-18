import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Ensures we attempt to add the column only once per runtime
let updatedAtEnsured = false

async function ensureUpdatedAtColumn() {
  if (updatedAtEnsured || !sql) return
  try {
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`
    updatedAtEnsured = true
  } catch (e) {
    console.error("Failed ensuring updated_at column:", e)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureUpdatedAtColumn()

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    const body = await request.json()
    const { approved } = body

    if (typeof approved !== "boolean") {
      return NextResponse.json({ error: "Approved status must be a boolean" }, { status: 400 })
    }

    const result = await sql`
      UPDATE reviews
      SET approved = ${approved}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureUpdatedAtColumn()

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM reviews
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
