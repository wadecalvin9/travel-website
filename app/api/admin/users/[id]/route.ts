import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(params.id)
    const body = await request.json()
    const { role, account_type } = body

    console.log("Updating user:", userId, "with data:", { role, account_type })

    // Prevent changing your own role
    if (userId === user.id && role !== undefined) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Update role if provided
    if (role !== undefined) {
      console.log("Updating role to:", role)
      await sql`
        UPDATE users 
        SET role = ${role}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
    }

    // Update account_type if provided
    if (account_type !== undefined) {
      console.log("Updating account_type to:", account_type)
      await sql`
        UPDATE users 
        SET account_type = ${account_type}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
    }

    console.log("Update successful")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user: " + error.message }, { status: 500 })
  }
}
