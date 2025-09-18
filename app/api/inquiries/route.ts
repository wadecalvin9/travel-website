import { type NextRequest, NextResponse } from "next/server"
import { createInquiry } from "@/lib/db"
import { publishInquiry } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Create inquiry in database
    const inquiry = await createInquiry(data)

    // Publish to Redis for real-time notifications
    await publishInquiry({
      id: inquiry.id,
      name: data.name,
      email: data.email,
      package_id: data.package_id,
      message: data.message,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error) {
    console.error("Error creating inquiry:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
