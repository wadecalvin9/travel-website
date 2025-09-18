import { type NextRequest, NextResponse } from "next/server"
import { sql, safeQuery } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.packageId || !data.travelDate || !data.participants) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use safeQuery to handle database connection issues gracefully
    const result = await safeQuery(
      async () => {
        if (!sql) {
          // Return demo response when database is not configured
          return {
            id: Math.floor(Math.random() * 1000),
            message: "Booking request submitted successfully (demo mode)",
          }
        }

        // Insert guest booking as an inquiry with booking details
        const inquiry = await sql`
        INSERT INTO inquiries (
          name, email, phone, package_id, message, preferred_date, participants, status
        )
        VALUES (
          ${data.name},
          ${data.email},
          ${data.phone || null},
          ${data.packageId},
          ${`Guest Booking Request for ${data.packageTitle}
          
Accommodation Type: ${data.accommodationType}
Total Amount: $${data.totalAmount}
Special Requests: ${data.specialRequests || "None"}`},
          ${data.travelDate},
          ${data.participants},
          'pending'
        )
        RETURNING id
      `

        return {
          id: inquiry[0].id,
          message: "Guest booking request submitted successfully",
        }
      },
      { id: null, message: "Failed to submit booking request" },
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Guest booking error:", error)
    return NextResponse.json({ error: "Failed to submit booking request" }, { status: 500 })
  }
}
