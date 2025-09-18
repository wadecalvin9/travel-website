import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql, safeQuery } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use safeQuery to handle database connection issues
    const stats = await safeQuery(
      async () => {
        // Get all stats with individual error handling
        const results = await Promise.allSettled([
          sql!`SELECT COUNT(*) as count FROM packages`,
          sql!`SELECT COUNT(*) as count FROM bookings`,
          sql!`SELECT COUNT(*) as count FROM users WHERE role != 'admin'`,
          sql!`SELECT COUNT(*) as count FROM inquiries`,
          sql!`SELECT COUNT(*) as count FROM reviews`,
          sql!`SELECT COUNT(*) as count FROM testimonials`,
          sql!`SELECT COUNT(*) as count FROM destinations`,
          sql!`SELECT AVG(rating)::numeric(3,1) as avg_rating FROM reviews WHERE rating IS NOT NULL`,
          sql!`SELECT COUNT(*) as count FROM inquiries WHERE status = 'pending'`,
          sql!`SELECT COUNT(*) as count FROM reviews WHERE approved = false`,
          // Add recent bookings query
          sql!`
        SELECT b.id, b.customer_name, b.created_at, b.status, p.title as package_title
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        ORDER BY b.created_at DESC
        LIMIT 5
      `,
          // Add recent inquiries query
          sql!`
        SELECT i.id, i.name, i.email, i.created_at, i.status, p.title as package_title
        FROM inquiries i
        LEFT JOIN packages p ON i.package_id = p.id
        ORDER BY i.created_at DESC
        LIMIT 5
      `,
        ])

        // Extract values with fallbacks
        const getValue = (index: number, field = "count") => {
          const result = results[index]
          if (result.status === "fulfilled" && result.value && result.value[0]) {
            return result.value[0][field] || 0
          }
          return 0
        }

        // Extract array values
        const getArrayValue = (index: number) => {
          const result = results[index]
          if (result.status === "fulfilled" && result.value) {
            return result.value
          }
          return []
        }

        return {
          totalPackages: Number(getValue(0)),
          totalBookings: Number(getValue(1)),
          totalCustomers: Number(getValue(2)),
          totalInquiries: Number(getValue(3)),
          totalReviews: Number(getValue(4)),
          totalTestimonials: Number(getValue(5)),
          totalDestinations: Number(getValue(6)),
          averageRating: Number(getValue(7, "avg_rating")) || 0,
          pendingInquiries: Number(getValue(8)),
          pendingReviews: Number(getValue(9)),
          recentBookings: getArrayValue(10),
          recentInquiries: getArrayValue(11),
        }
      },
      {
        // Fallback stats if database is not available
        totalPackages: 0,
        totalBookings: 0,
        totalCustomers: 0,
        totalInquiries: 0,
        totalReviews: 0,
        totalTestimonials: 0,
        totalDestinations: 0,
        averageRating: 0,
        pendingInquiries: 0,
        pendingReviews: 0,
        recentBookings: [],
        recentInquiries: [],
      },
    )

    console.log("Admin stats calculated:", stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)

    // Return fallback stats instead of error
    const fallbackStats = {
      totalPackages: 0,
      totalBookings: 0,
      totalCustomers: 0,
      totalInquiries: 0,
      totalReviews: 0,
      totalTestimonials: 0,
      totalDestinations: 0,
      averageRating: 0,
      pendingInquiries: 0,
      pendingReviews: 0,
      recentBookings: [],
      recentInquiries: [],
    }

    return NextResponse.json(fallbackStats)
  }
}
