import { NextResponse, type NextRequest } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingId = Number.parseInt(params.id)
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    const { status } = await request.json()

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const result = await sql`
      UPDATE bookings 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId}
      RETURNING id, status
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
  }
}
