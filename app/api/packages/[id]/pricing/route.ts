import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = Number.parseInt(params.id)

    // Fetch package pricing (replaces pricing_tiers)
    const packagePricing = await sql`
      SELECT 
        adult_price,
        child_price,
        allow_tour_only,
        allow_accommodation,
        group_discount_threshold,
        group_discount_percentage
      FROM package_pricing 
      WHERE package_id = ${packageId}
    `

    // Convert to expected format for compatibility
    const pricingTiers =
      packagePricing.length > 0
        ? [
            { id: 1, person_type: "adult", base_price: packagePricing[0].adult_price },
            { id: 2, person_type: "child", base_price: packagePricing[0].child_price },
          ]
        : []

    // Fetch room types available for this package
    const roomTypes = await sql`
      SELECT 
        rt.id,
        rt.name,
        rt.description,
        rt.max_adults,
        rt.max_children,
        prt.price_per_night as nightly_rate,
        prt.available_rooms,
        (rt.max_adults + rt.max_children) as total_capacity
      FROM room_types rt
      JOIN package_room_types prt ON rt.id = prt.room_type_id
      WHERE prt.package_id = ${packageId}
      ORDER BY prt.price_per_night
    `

    // Create group discounts from package pricing
    const groupDiscounts =
      packagePricing.length > 0
        ? [
            {
              id: 1,
              min_people: packagePricing[0].group_discount_threshold || 8,
              discount_percentage: packagePricing[0].group_discount_percentage || 10,
            },
          ]
        : []

    // Set booking modes from package pricing
    const bookingModes =
      packagePricing.length > 0
        ? {
            tour_only: packagePricing[0].allow_tour_only ?? true,
            tour_with_rooms: packagePricing[0].allow_accommodation ?? true,
            rooms_required: !packagePricing[0].allow_tour_only ?? false,
          }
        : {
            tour_only: true,
            tour_with_rooms: true,
            rooms_required: false,
          }

    return NextResponse.json({
      pricingTiers,
      roomTypes,
      groupDiscounts,
      bookingModes,
    })
  } catch (error) {
    console.error("Error fetching pricing data:", error)
    return NextResponse.json({ error: "Failed to fetch pricing data" }, { status: 500 })
  }
}
