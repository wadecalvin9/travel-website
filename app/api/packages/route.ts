import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

const mockPackages = [
  {
    id: 1,
    title: "Masai Mara Safari Adventure",
    description:
      "Experience the world-famous Masai Mara National Reserve with its incredible wildlife and the Great Migration.",
    price: 2500,
    duration_days: 5,
    destination_name: "Kenya",
    image_url: "/placeholder.svg?height=300&width=400",
    included: ["Big Five", "Great Migration", "Masai Culture", "Hot Air Balloon"],
    featured: true,
    max_participants: 8,
  },
  {
    id: 2,
    title: "Serengeti & Ngorongoro Crater",
    description: "Explore Tanzania's most famous parks including the Serengeti and the stunning Ngorongoro Crater.",
    price: 3200,
    duration_days: 7,
    destination_name: "Tanzania",
    image_url: "/placeholder.svg?height=300&width=400",
    included: ["Serengeti Plains", "Ngorongoro Crater", "Big Five", "Wildebeest Migration"],
    featured: true,
    max_participants: 6,
  },
  {
    id: 3,
    title: "Kilimanjaro Base Camp Trek",
    description:
      "Trek to the base of Africa's highest mountain and experience breathtaking views and diverse ecosystems.",
    price: 1800,
    duration_days: 4,
    destination_name: "Tanzania",
    image_url: "/placeholder.svg?height=300&width=400",
    included: ["Mount Kilimanjaro", "Machame Route", "Alpine Desert", "Rainforest"],
    featured: false,
    max_participants: 12,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      destination: searchParams.get("destination") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
    }

    // Check if database is configured
    if (!sql) {
      console.log("Database not configured, returning mock packages")
      return NextResponse.json(mockPackages)
    }

    // Try to fetch from database
    try {
      let packages

      if (filters.featured !== undefined) {
        packages = await sql`
          SELECT p.*, d.name as destination_name, d.country
          FROM packages p
          LEFT JOIN destinations d ON p.destination_id = d.id
          WHERE p.featured = ${filters.featured}
          ORDER BY p.created_at DESC
        `
      } else {
        // Apply other filters
        let query = `
          SELECT p.*, d.name as destination_name, d.country
          FROM packages p
          LEFT JOIN destinations d ON p.destination_id = d.id
          WHERE 1=1
        `
        const params: any[] = []
        let paramIndex = 1

        if (filters.destination) {
          query += ` AND d.name ILIKE $${paramIndex}`
          params.push(`%${filters.destination}%`)
          paramIndex++
        }

        if (filters.minPrice) {
          query += ` AND p.price >= $${paramIndex}`
          params.push(filters.minPrice)
          paramIndex++
        }

        if (filters.maxPrice) {
          query += ` AND p.price <= $${paramIndex}`
          params.push(filters.maxPrice)
          paramIndex++
        }

        query += ` ORDER BY p.featured DESC, p.created_at DESC`

        if (params.length > 0) {
          packages = await sql.query(query, params)
        } else {
          packages = await sql`
            SELECT p.*, d.name as destination_name, d.country
            FROM packages p
            LEFT JOIN destinations d ON p.destination_id = d.id
            ORDER BY p.featured DESC, p.created_at DESC
          `
        }
      }

      return NextResponse.json(packages)
    } catch (dbError) {
      console.error("Database query failed, returning mock packages:", dbError)
      return NextResponse.json(mockPackages)
    }
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
