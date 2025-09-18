import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Try to create the user
    const newUser = await createUser({ name, email, password, phone })

    return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)

    // Check if it's a unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes("duplicate key value violates unique constraint")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
