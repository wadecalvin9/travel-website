import { NextResponse } from "next/server"
import { checkDatabaseSetup, autoSetupDatabase, AUTO_SETUP_CONFIG } from "@/lib/auto-setup"

export async function GET() {
  try {
    const setupStatus = await checkDatabaseSetup()
    return NextResponse.json(setupStatus)
  } catch (error) {
    console.error("Error checking setup status:", error)
    return NextResponse.json({ error: "Failed to check setup status" }, { status: 500 })
  }
}

export async function POST() {
  try {
    if (!AUTO_SETUP_CONFIG.enabled) {
      return NextResponse.json({ error: "Auto-setup is disabled" }, { status: 403 })
    }

    const setupStatus = await checkDatabaseSetup()

    if (!setupStatus.needsSetup) {
      return NextResponse.json({
        success: false,
        message: setupStatus.reason,
        alreadySetup: true,
      })
    }

    const result = await autoSetupDatabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Auto-setup failed:", error)
    return NextResponse.json(
      {
        error: "Auto-setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
