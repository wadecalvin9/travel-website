import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      // Return mock data when database is not configured
      return NextResponse.json([
        {
          id: 1,
          name: "Serengeti National Park",
          description: "Experience the Great Migration and witness millions of wildebeest crossing the plains.",
          image_url:
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          country: "Tanzania",
          featured: true,
          package_count: 3,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "Masai Mara",
          description: "Kenya's premier wildlife reserve, famous for the annual wildebeest migration.",
          image_url:
            "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          country: "Kenya",
          featured: true,
          package_count: 2,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 3,
          name: "Kruger National Park",
          description: "South Africa's largest game reserve, home to the Big Five.",
          image_url:
            "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          country: "South Africa",
          featured: false,
          package_count: 1,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 4,
          name: "Ngorongoro Crater",
          description: "A UNESCO World Heritage Site with incredible wildlife density.",
          image_url:
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          country: "Tanzania",
          featured: false,
          package_count: 2,
          created_at: "2024-01-01T00:00:00Z",
        },
      ])
    }

    const destinations = await sql`
      SELECT d.*, COUNT(p.id) as package_count
      FROM destinations d
      LEFT JOIN packages p ON d.id = p.destination_id
      GROUP BY d.id
      ORDER BY d.featured DESC, d.name
    `

    return NextResponse.json(destinations)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { name, description, image_url, country, featured } = await request.json()

    const result = await sql`
      INSERT INTO destinations (name, description, image_url, country, featured)
      VALUES (${name}, ${description}, ${image_url}, ${country}, ${featured || false})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 })
  }
}
