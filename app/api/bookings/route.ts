import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql, safeQuery } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookings = await safeQuery(async () => {
      if (!sql) {
        return [
          {
            id: 1,
            userId: loggedInUser.id,
            packageId: 1,
            packageTitle: "Serengeti Classic Safari",
            packageImage: "/placeholder.svg?height=200&width=300",
            status: "confirmed",
            bookingDate: new Date().toISOString(),
            travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            participants: 2,
            totalAmount: 2500,
            depositAmount: 750,
            balanceAmount: 1750,
            accommodationType: "lodge",
            specialRequests: "Vegetarian meals preferred",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      }

      const result = await sql`
        SELECT 
          id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
          package_image as "packageImage", status, booking_date as "bookingDate", 
          travel_date as "travelDate", participants, total_amount as "totalAmount",
          deposit_amount as "depositAmount", balance_amount as "balanceAmount",
          accommodation_type as "accommodationType", dietary_requirements as "dietaryRequirements",
          special_requests as "specialRequests", emergency_contact as "emergencyContact",
          insurance, created_at as "createdAt", updated_at as "updatedAt"
        FROM bookings 
        WHERE user_id = ${loggedInUser.id}
        ORDER BY created_at DESC
      `
      return result
    }, [])

    return NextResponse.json(bookings, { status: 200 })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.packageId || !data.packageTitle || !data.travelDate || !data.participants || !data.totalAmount) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 })
    }

    const result = await safeQuery(async () => {
      if (!sql) {
        return [
          {
            id: Math.floor(Math.random() * 1000),
            userId: loggedInUser.id,
            packageId: data.packageId,
            packageTitle: data.packageTitle,
            packageImage: data.packageImage || "/placeholder.svg?height=200&width=300",
            status: "pending",
            bookingDate: new Date().toISOString(),
            travelDate: data.travelDate,
            participants: data.participants,
            totalAmount: data.totalAmount,
            depositAmount: data.depositAmount || Math.round(data.totalAmount * 0.3),
            balanceAmount: data.balanceAmount || data.totalAmount - Math.round(data.totalAmount * 0.3),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      }

      const bookingResult = await sql`
        INSERT INTO bookings (
          user_id, package_id, package_title, package_image, travel_date, participants, 
          total_amount, deposit_amount, balance_amount, accommodation_type, 
          dietary_requirements, special_requests, emergency_contact, insurance
        )
        VALUES (
          ${loggedInUser.id}, ${data.packageId}, ${data.packageTitle}, ${data.packageImage}, 
          ${data.travelDate}, ${data.participants}, ${data.totalAmount}, ${data.depositAmount}, 
          ${data.balanceAmount}, ${data.accommodationType}, ${data.dietaryRequirements}, 
          ${data.specialRequests}, ${JSON.stringify(data.emergencyContact)}, ${data.insurance}
        )
        RETURNING id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
                  package_image as "packageImage", status, booking_date as "bookingDate", 
                  travel_date as "travelDate", participants, total_amount as "totalAmount",
                  deposit_amount as "depositAmount", balance_amount as "balanceAmount",
                  created_at as "createdAt", updated_at as "updatedAt"
      `
      return bookingResult
    }, [])

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
