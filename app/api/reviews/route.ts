import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser, getUserReviewsFromDB, createReviewInDB } from "@/lib/auth-utils"
import type { Review } from "@/types/profile"

export async function GET(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const reviews = await getUserReviewsFromDB(loggedInUser.id)
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data: Omit<Review, "id" | "userId" | "createdAt" | "approved"> = await request.json()

    if (!data.packageId || !data.packageTitle || !data.rating || !data.comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 })
    }

    const newReview = await createReviewInDB({ ...data, userId: loggedInUser.id })
    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    // Handle unique constraint violation for user_id, package_id
    if (error instanceof Error && error.message.includes("duplicate key value violates unique constraint")) {
      return NextResponse.json({ error: "You have already submitted a review for this package." }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
