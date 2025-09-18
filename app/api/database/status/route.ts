import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if database is configured
    if (!sql) {
      return NextResponse.json({
        connected: false,
        message: "Database not configured",
        tables: [],
      })
    }

    // Test database connection
    try {
      await sql`SELECT 1 as test`

      // Check for required tables
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `

      const requiredTables = ["packages", "bookings", "testimonials", "users", "destinations", "site_settings"]

      const existingTables = tables.map((t: any) => t.table_name)
      const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

      return NextResponse.json({
        connected: true,
        message:
          missingTables.length > 0
            ? `Database connected but missing tables: ${missingTables.join(", ")}`
            : "Database connected and all tables exist",
        tables: existingTables,
        missingTables,
        needsSetup: missingTables.length > 0,
      })
    } catch (dbError) {
      console.error("Database connection test failed:", dbError)
      return NextResponse.json({
        connected: false,
        message: "Database connection failed",
        error: dbError instanceof Error ? dbError.message : "Unknown error",
        tables: [],
      })
    }
  } catch (error) {
    console.error("Error in database status route:", error)
    return NextResponse.json({
      connected: false,
      message: "Error checking database status",
      error: error instanceof Error ? error.message : "Unknown error",
      tables: [],
    })
  }
}
