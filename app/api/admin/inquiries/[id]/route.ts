import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inquiryId = Number.parseInt(params.id)
    const { status } = await request.json()

    await sql`
      UPDATE inquiries 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating inquiry:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}
