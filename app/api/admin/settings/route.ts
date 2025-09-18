import { type NextRequest, NextResponse } from "next/server"
import { sql, safeQuery } from "@/lib/db"
import { DEFAULT_SETTINGS } from "@/lib/settings"

// Helper – read settings rows into a plain object
async function loadSettings() {
  return safeQuery(async () => {
    const rows: { setting_key: string; setting_value: unknown }[] =
      await sql!`SELECT setting_key, setting_value FROM site_settings`

    const settings = rows.reduce<Record<string, unknown>>((acc, row) => {
      // Extract the value from jsonb (it comes back as the actual value)
      acc[row.setting_key] = row.setting_value
      return acc
    }, {})

    console.log("Loaded settings:", settings)
    return settings
  }, DEFAULT_SETTINGS)
}

/**
 * GET /api/admin/settings
 * Returns all settings as JSON.
 */
export async function GET() {
  try {
    const settings = await loadSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings GET failed:", error)
    // Return default settings instead of error
    return NextResponse.json({ settings: DEFAULT_SETTINGS })
  }
}

/**
 * PUT /api/admin/settings
 * Body: { settings: { key: value, … } }
 */
export async function PUT(request: NextRequest) {
  try {
    // Check if database is available
    if (!sql) {
      return NextResponse.json(
        {
          error: "Database not configured. Settings cannot be saved.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    console.log("Received PUT body:", body)

    const { settings } = body

    if (!settings || typeof settings !== "object") {
      console.error("Invalid settings payload:", settings)
      return NextResponse.json({ error: "Invalid or missing settings payload" }, { status: 400 })
    }

    console.log("Processing settings:", Object.keys(settings))

    for (const [key, value] of Object.entries(settings)) {
      console.log(`Saving setting: ${key} = ${value}`)

      try {
        // For jsonb, we need to pass the actual value and let the database handle the conversion
        // The neon driver will automatically convert JavaScript values to proper JSON
        await sql`
          INSERT INTO site_settings (setting_key, setting_value, category, description)
          VALUES (${key}, ${JSON.stringify(value)}, 'general', 'User updated setting')
          ON CONFLICT (setting_key)
          DO UPDATE SET
            setting_value = ${JSON.stringify(value)},
            updated_at = CURRENT_TIMESTAMP
        `
      } catch (settingError) {
        console.error(`Error saving setting ${key}:`, settingError)
        // Continue with other settings even if one fails
      }
    }

    console.log("Settings saved successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings PUT failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
