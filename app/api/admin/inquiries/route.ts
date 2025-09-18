import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inquiries = await sql`
      SELECT i.*, p.title as package_title
      FROM inquiries i
      LEFT JOIN packages p ON i.package_id = p.id
      ORDER BY i.created_at DESC
    `

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
