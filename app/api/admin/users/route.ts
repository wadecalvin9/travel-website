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

    const users = await sql`
      SELECT 
        u.id, u.name, u.email, u.role, u.phone, u.created_at,
        COUNT(DISTINCT b.id) as booking_count,
        COUNT(DISTINCT r.id) as review_count
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      LEFT JOIN reviews r ON u.id = r.user_id
      GROUP BY u.id, u.name, u.email, u.role, u.phone, u.created_at
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
