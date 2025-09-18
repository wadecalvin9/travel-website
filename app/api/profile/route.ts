import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser, getUserProfileFromDB, updateUserProfileInDB } from "@/lib/auth-utils"
import type { UserProfile } from "@/types/profile"

export async function GET(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const profile = await getUserProfileFromDB(loggedInUser.id)

    if (!profile) {
      // Return demo profile for testing without database
      const demoProfile: UserProfile = {
        id: loggedInUser.id,
        email: loggedInUser.email,
        name: loggedInUser.name,
        role: loggedInUser.role,
        phone: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
        travelPreferences: {
          accommodationType: "mid-range" as const,
          groupSize: "couple" as const,
          activityLevel: "moderate" as const,
          interests: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(demoProfile, { status: 200 })
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const loggedInUser = await getLoggedInUser()
    if (!loggedInUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const updates: Partial<UserProfile> = await request.json()
    console.log("Profile update request:", updates)

    const updatedProfile = await updateUserProfileInDB(loggedInUser.id, updates)

    if (!updatedProfile) {
      console.error("Failed to update profile - profile not found or update failed")
      return NextResponse.json({ error: "Failed to update profile or profile not found" }, { status: 404 })
    }

    console.log("Profile updated successfully:", updatedProfile)
    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
