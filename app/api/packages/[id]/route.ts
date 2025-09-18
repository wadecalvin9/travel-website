import { type NextRequest, NextResponse } from "next/server"
import { getPackageForBooking, incrementPackageViews } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = Number.parseInt(params.id)

    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    // Get package details
    const pkg = await getPackageForBooking(packageId)

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Increment view count
    await incrementPackageViews(packageId)

    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package details" }, { status: 500 })
  }
}
