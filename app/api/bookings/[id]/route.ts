import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookingId = Number.parseInt(params.id)
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
        package_image as "packageImage", status, booking_date as "bookingDate", 
        travel_date as "travelDate", participants, total_amount as "totalAmount",
        deposit_amount as "depositAmount", balance_amount as "balanceAmount",
        accommodation_type as "accommodationType", dietary_requirements as "dietaryRequirements",
        special_requests as "specialRequests", emergency_contact as "emergencyContact",
        insurance, payment_method as "paymentMethod",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM bookings 
      WHERE id = ${bookingId} AND user_id = ${loggedInUser.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Parse emergency contact JSON
    const booking = result[0]
    if (booking.emergencyContact) {
      try {
        booking.emergencyContact = JSON.parse(booking.emergencyContact)
      } catch (error) {
        booking.emergencyContact = null
      }
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookingId = Number.parseInt(params.id)
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    const updates = await request.json()

    // Only allow certain fields to be updated by users
    const allowedFields = ["special_requests", "dietary_requirements"]
    const updateFields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex++}`)
        values.push(value)
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    values.push(bookingId, loggedInUser.id)

    const query = `
      UPDATE bookings
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
      RETURNING id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
                package_image as "packageImage", status, booking_date as "bookingDate", 
                travel_date as "travelDate", participants, total_amount as "totalAmount",
                created_at as "createdAt", updated_at as "updatedAt"
    `

    const result = await sql.query(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
