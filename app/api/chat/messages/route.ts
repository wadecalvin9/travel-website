import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId || !sql) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const messages = await sql`
      SELECT * FROM chat_messages 
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // First create or get a chat session
    const sessionResult = await sql`
      INSERT INTO chat_sessions (user_name, user_email, status)
      VALUES (${name}, ${email}, 'active')
      RETURNING id
    `

    const sessionId = sessionResult[0].id

    // Insert message using the correct column name 'content'
    const result = await sql`
      INSERT INTO chat_messages (session_id, sender_type, content)
      VALUES (${sessionId}, 'user', ${message})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
