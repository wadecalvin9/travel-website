import { type NextRequest, NextResponse } from "next/server"
import { validateCredentials } from "@/lib/auth-utils"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if this is a demo login attempt
    const demoCredentials = [
      { email: "admin@travelconnect.com", password: "admin123", role: "admin", name: "Admin User" },
      { email: "user@example.com", password: "password123", role: "user", name: "Demo User" },
    ]

    const demoUser = demoCredentials.find((cred) => cred.email === email && cred.password === password)

    if (demoUser) {
      // Handle demo login without database
      const session = await getSession()
      session.userId = demoUser.email === "admin@travelconnect.com" ? 1 : 2
      session.userEmail = demoUser.email
      session.userName = demoUser.name
      session.userRole = demoUser.role
      await session.save()

      return NextResponse.json(
        {
          success: true,
          user: {
            id: session.userId,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          },
        },
        { status: 200 },
      )
    }

    // Try database authentication
    try {
      const user = await validateCredentials(email, password)

      if (user) {
        const session = await getSession()
        session.userId = user.id
        session.userEmail = user.email
        session.userName = user.name
        session.userRole = user.role
        await session.save()

        return NextResponse.json({ success: true, user }, { status: 200 })
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } catch (dbError) {
      console.error("Database authentication failed:", dbError)

      // If database is not configured, inform the user
      if (dbError instanceof Error && dbError.message.includes("Database not configured")) {
        return NextResponse.json(
          {
            error:
              "Database not configured. Please use demo credentials: admin@travelconnect.com/admin123 or user@example.com/password123",
          },
          { status: 503 },
        )
      }

      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 })
    }
  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
