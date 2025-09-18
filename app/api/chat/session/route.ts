import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { user_id, user_name, user_email } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Check if user has an active session
    const existingSessions = await sql`
      SELECT * FROM chat_sessions 
      WHERE user_id = ${user_id} AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (existingSessions.length > 0) {
      return NextResponse.json(existingSessions[0])
    }

    // Create new session
    const result = await sql`
      INSERT INTO chat_sessions (user_id, user_name, user_email, status, last_message_at, created_at)
      VALUES (${user_id}, ${user_name}, ${user_email}, 'active', NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
  }
}
