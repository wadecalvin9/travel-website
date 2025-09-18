import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sessions = await sql`
      SELECT 
        cs.*,
        COUNT(cm.id) FILTER (WHERE cm.sender_type = 'user' AND cm.read = false) as unread_count
      FROM chat_sessions cs
      LEFT JOIN chat_messages cm ON cs.id = cm.session_id
      WHERE cs.status = 'active'
      GROUP BY cs.id
      ORDER BY cs.last_message_at DESC
    `

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
