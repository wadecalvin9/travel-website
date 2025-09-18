import { type NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    await destroySession()
    return NextResponse.json({ success: true, message: "Signed out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Sign-out error:", error)
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}
