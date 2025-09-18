import { neon } from "@neondatabase/serverless"

// Create database connection using the Neon integration
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

// Helper function to check if database is available
export function isDatabaseAvailable(): boolean {
  return sql !== null
}

// Helper function to safely execute queries with fallback
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  // If there's no sql client, immediately use the fallback
  if (!sql) {
    console.warn("Database not available, using fallback")
    return fallback
  }

  try {
    // Attempt the live query
    return await query()
  } catch (error) {
    // Normalise the error message
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

    // Downgrade common connection issues to a harmless warning
    if (message.includes("connection") || message.includes("network") || message.includes("closed")) {
      console.warn("Database unreachable - falling back to default data")
    } else {
      // For other SQL errors keep the details (still warn, not error)
      console.warn("Database query failed, using fallback:", error)
    }

    return fallback
  }
}

// Database query helpers with comprehensive error handling
export async function getPackages(filters?: {
  destination?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
}) {
  return safeQuery(async () => {
    if (filters?.featured !== undefined) {
      return await sql!`
        SELECT p.*, d.name as destination_name, d.country
        FROM packages p
        LEFT JOIN destinations d ON p.destination_id = d.id
        WHERE p.featured = ${filters.featured}
        ORDER BY p.created_at DESC
      `
    }

    // Default query for all packages
    return await sql!`
      SELECT p.*, d.name as destination_name, d.country
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      ORDER BY p.featured DESC, p.created_at DESC
    `
  }, [])
}

export async function getPackageById(id: number) {
  return safeQuery(async () => {
    const result = await sql!`
      SELECT p.*, d.name as destination_name, d.country
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      WHERE p.id = ${id}
    `
    return result[0] || null
  }, null)
}

// Enhanced version with more package details for booking
export async function getPackageForBooking(id: number) {
  return safeQuery(async () => {
    const result = await sql!`
      SELECT 
        p.*,
        d.name as destination_name,
        d.country,
        d.description as destination_description
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      WHERE p.id = ${id}
    `

    if (result[0]) {
      // Transform the data to match the booking page expectations
      const pkg = result[0]
      return {
        id: pkg.id,
        title: pkg.title,
        description: pkg.description,
        detailed_description: pkg.detailed_description,
        price: pkg.price ? Number(pkg.price) : null,
        price_text: pkg.price_text,
        pricing_type: pkg.pricing_type || "fixed",
        currency: pkg.currency || "USD",
        duration: `${pkg.duration_days} days`,
        duration_days: pkg.duration_days,
        max_participants: pkg.max_participants,
        difficulty_level: "Moderate", // Default value
        includes: pkg.included || [],
        excludes: pkg.excluded || [],
        images: pkg.gallery_images || [pkg.image_url],
        image_url: pkg.image_url,
        gallery_images: pkg.gallery_images || [],
        location: `${pkg.destination_name}, ${pkg.country}`,
        destination_name: pkg.destination_name,
        country: pkg.country,
        featured: pkg.featured,
        itinerary: pkg.itinerary || {},
        optional_activities: pkg.optional_activities || [],
        view_count: pkg.view_count || 0,
      }
    }

    return null
  }, null)
}

export async function incrementPackageViews(id: number) {
  return safeQuery(async () => {
    await sql!`
      UPDATE packages
      SET view_count = view_count + 1
      WHERE id = ${id}
    `
  }, undefined)
}

export async function getDestinations() {
  return safeQuery(async () => {
    return await sql!`
      SELECT d.*, COUNT(p.id) as package_count
      FROM destinations d
      LEFT JOIN packages p ON d.id = p.destination_id
      GROUP BY d.id
      ORDER BY d.featured DESC, d.name
    `
  }, [])
}

export async function getTestimonials(featured = false) {
  return safeQuery(async () => {
    if (featured) {
      return await sql!`
        SELECT * FROM testimonials
        WHERE featured = true AND approved = true
        ORDER BY created_at DESC
      `
    }
    return await sql!`
      SELECT * FROM testimonials
      WHERE approved = true
      ORDER BY created_at DESC
    `
  }, [])
}

export async function createInquiry(data: {
  name: string
  email: string
  phone?: string
  package_id?: number
  message: string
  preferred_date?: string
  participants?: number
}) {
  if (!sql) {
    throw new Error("Database not configured. Please check your database connection.")
  }

  try {
    const result = await sql!`
      INSERT INTO inquiries (name, email, phone, package_id, message, preferred_date, participants)
      VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.package_id || null},
              ${data.message}, ${data.preferred_date || null}, ${data.participants || null})
      RETURNING id
    `
    return result[0]
  } catch (error) {
    console.error("Error creating inquiry:", error)
    throw error
  }
}

// Updated function to get site settings
export async function getSiteSettings() {
  return safeQuery(async () => {
    const settings = await sql!`
      SELECT setting_key, setting_value 
      FROM site_settings
    `

    // Convert to object format
    const settingsObject: Record<string, string> = {}
    settings.forEach((setting: any) => {
      try {
        // Parse JSON value and remove quotes if it's a simple string
        const parsed = JSON.parse(setting.setting_value)
        settingsObject[setting.setting_key] = parsed
      } catch {
        // If parsing fails, use the raw value
        settingsObject[setting.setting_key] = setting.setting_value
      }
    })

    // Merge with defaults to ensure all required settings exist
    return { ...getDefaultSettings(), ...settingsObject }
  }, getDefaultSettings())
}

// Default settings fallback
function getDefaultSettings() {
  return {
    site_name: "Travel Connect Expeditions",
    site_description: "Experience unforgettable safari adventures across East and Southern Africa",
    hero_title: "Discover Africa's Wild Heart",
    hero_subtitle:
      "Experience unforgettable safari adventures with our expert guides and carefully crafted itineraries.",
    hero_cta_text: "Explore Safari Packages",
    hero_background_image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
    primary_color: "#f59e0b",
    secondary_color: "#d97706",
    accent_color: "#92400e",
    phone: "+1 (555) 123-4567",
    email: "info@travelconnectexpeditions.com",
    address: "123 Safari Street, Adventure City, AC 12345",
    whatsapp_number: "+1234567890",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    about_story_title: "Welcome to Travel Connect Expeditions",
    about_story_content:
      "We specialize in creating extraordinary safari experiences across East and Southern Africa. Our expert guides and carefully crafted itineraries ensure you witness Africa's incredible wildlife in their natural habitat.",
    footer_description:
      "Creating extraordinary safari experiences across East and Southern Africa with expert guides and carefully crafted itineraries.",
    copyright_text: "© 2024 Travel Connect Expeditions. All rights reserved.",
  }
}

// Keep the old function for backward compatibility
export async function getContent(page: string, section: string) {
  try {
    const settings = await getSiteSettings()

    // Map old content structure to new settings
    if (page === "homepage" && section === "hero") {
      return {
        title: settings.hero_title || "Discover Africa's Wild Beauty",
        subtitle:
          settings.hero_subtitle ||
          "Experience unforgettable safari adventures with our expert guides and carefully crafted itineraries.",
        cta: settings.hero_cta_text || "Explore Safari Packages",
      }
    }

    if (page === "homepage" && section === "intro") {
      return {
        title: settings.about_story_title || "Welcome to Travel Connect Expeditions",
        description:
          settings.about_story_content ||
          "We specialize in creating extraordinary safari experiences across East and Southern Africa. Our expert guides and carefully crafted itineraries ensure you witness Africa's incredible wildlife in their natural habitat.",
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching content:", error)
    return null
  }
}

// Database setup check function
export async function checkDatabaseSetup() {
  if (!sql) {
    return {
      isSetup: false,
      tables: {},
      missingTables: ["all"],
      error: "DATABASE_URL environment variable not set or invalid",
    }
  }

  try {
    const requiredTables = ["users", "packages", "destinations", "inquiries", "testimonials", "site_settings"]
    const tableStatus: Record<string, boolean> = {}

    // Try to check each table
    for (const table of requiredTables) {
      try {
        const result = await sql!`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${table}
          );
        `
        tableStatus[table] = result[0]?.exists || false
      } catch (error) {
        console.error(`Error checking table ${table}:`, error)
        tableStatus[table] = false
      }
    }

    const allTablesExist = Object.values(tableStatus).every((exists) => exists)

    return {
      isSetup: allTablesExist,
      tables: tableStatus,
      missingTables: requiredTables.filter((table) => !tableStatus[table]),
    }
  } catch (error) {
    console.error("Error checking database setup:", error)
    return {
      isSetup: false,
      tables: {},
      missingTables: ["unknown"],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Simplified dashboard statistics function that doesn't fail completely
export async function getDashboardStats() {
  // Initialize default stats
  const defaultStats = {
    totalPackages: 0,
    totalDestinations: 0,
    totalUsers: 0,
    totalInquiries: 0,
    totalBookings: 0,
    totalTestimonials: 0,
    totalReviews: 0,
    recentInquiries: [] as any[],
    recentReviews: [] as any[],
    pendingBookings: 0,
    featuredPackages: 0,
    databaseStatus: "not_configured" as string,
  }

  // Return default stats immediately if database is not configured
  if (!sql) {
    console.warn("Database not configured, returning default dashboard stats")
    return defaultStats
  }

  // Initialize stats with connected status (optimistic)
  const stats = {
    ...defaultStats,
    databaseStatus: "connected",
  }

  // Try each query individually and continue even if some fail
  const queries = [
    {
      name: "packages",
      query: async () => {
        const packagesResult = await sql!`SELECT COUNT(*) as count FROM packages`
        stats.totalPackages = Number.parseInt(packagesResult[0]?.count || "0")

        const featuredResult = await sql!`SELECT COUNT(*) as count FROM packages WHERE featured = true`
        stats.featuredPackages = Number.parseInt(featuredResult[0]?.count || "0")
      },
    },
    {
      name: "destinations",
      query: async () => {
        const destinationsResult = await sql!`SELECT COUNT(*) as count FROM destinations`
        stats.totalDestinations = Number.parseInt(destinationsResult[0]?.count || "0")
      },
    },
    {
      name: "users",
      query: async () => {
        const usersResult = await sql!`SELECT COUNT(*) as count FROM users`
        stats.totalUsers = Number.parseInt(usersResult[0]?.count || "0")
      },
    },
    {
      name: "inquiries",
      query: async () => {
        const inquiriesResult = await sql!`SELECT COUNT(*) as count FROM inquiries`
        stats.totalInquiries = Number.parseInt(inquiriesResult[0]?.count || "0")

        // Get recent inquiries with package information
        const recentInquiriesResult = await sql!`
          SELECT i.*, p.title as package_title
          FROM inquiries i
          LEFT JOIN packages p ON i.package_id = p.id
          ORDER BY i.created_at DESC
          LIMIT 5
        `
        stats.recentInquiries = recentInquiriesResult || []
      },
    },
    {
      name: "bookings",
      query: async () => {
        const bookingsResult = await sql!`SELECT COUNT(*) as count FROM bookings`
        stats.totalBookings = Number.parseInt(bookingsResult[0]?.count || "0")

        const pendingResult = await sql!`SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'`
        stats.pendingBookings = Number.parseInt(pendingResult[0]?.count || "0")
      },
    },
    {
      name: "testimonials",
      query: async () => {
        const testimonialsResult = await sql!`SELECT COUNT(*) as count FROM testimonials`
        stats.totalTestimonials = Number.parseInt(testimonialsResult[0]?.count || "0")
      },
    },
    {
      name: "reviews",
      query: async () => {
        const reviewsResult = await sql!`SELECT COUNT(*) as count FROM reviews`
        stats.totalReviews = Number.parseInt(reviewsResult[0]?.count || "0")

        // Get recent reviews with user information
        const recentReviewsResult = await sql!`
          SELECT r.*, u.name as user_name, p.title as package_title
          FROM reviews r
          LEFT JOIN users u ON r.user_id = u.id
          LEFT JOIN packages p ON r.package_id = p.id
          ORDER BY r.created_at DESC
          LIMIT 5
        `
        stats.recentReviews = recentReviewsResult || []
      },
    },
  ]

  let hasAnyError = false
  let connectionError = false

  // Execute all queries with individual error handling
  for (const { name, query } of queries) {
    try {
      await query()
    } catch (error) {
      console.error(`Error fetching ${name} stats:`, error)
      hasAnyError = true

      // Check if this is a connection error
      if (
        error instanceof Error &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("network") ||
          error.message.includes("connection"))
      ) {
        connectionError = true
      }
    }
  }

  // Update database status based on errors
  if (connectionError) {
    stats.databaseStatus = "connection_failed"
  } else if (hasAnyError) {
    stats.databaseStatus = "partial_error"
  }

  return stats
}
