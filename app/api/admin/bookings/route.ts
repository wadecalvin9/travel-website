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

    const bookings = await sql`
      SELECT 
        b.*,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
