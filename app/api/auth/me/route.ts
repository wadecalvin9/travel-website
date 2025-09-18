import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (user) {
      return NextResponse.json({ user }, { status: 200 })
    } else {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get user session error:", error)
    return NextResponse.json({ error: "Failed to retrieve user session" }, { status: 500 })
  }
}
