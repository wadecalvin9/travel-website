import { sql, safeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/session"
import type { UserProfile } from "@/types/profile"
import type { AccountType } from "@/types"

export interface User {
  id: number
  email: string
  name: string
  role: string
  account_type?: AccountType
}

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  return safeQuery(async () => {
    if (!sql) {
      throw new Error("Database not configured")
    }

    const result =
      await sql`SELECT id, email, name, role, account_type, password_hash FROM users WHERE email = ${email}`
    const user = result[0]

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        account_type: user.account_type || "standard",
      }
    }
    return null
  }, null)
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<User> {
  if (!sql) {
    throw new Error("Database not configured. Please check your database connection.")
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)

  // Create user with only the fields that exist in the database
  const result = await sql`
    INSERT INTO users (name, email, password_hash, account_type)
    VALUES (${userData.name}, ${userData.email}, ${hashedPassword}, 'standard')
    RETURNING id, name, email, role, account_type
  `

  return result[0]
}

export async function getLoggedInUser(): Promise<User | null> {
  const session = await getSession()
  if (session.userId && session.userEmail && session.userName && session.userRole) {
    return {
      id: session.userId,
      email: session.userEmail,
      name: session.userName,
      role: session.userRole,
      account_type: session.userAccountType || "standard",
    }
  }
  return null
}

export async function getUserProfileFromDB(userId: number): Promise<UserProfile | null> {
  return safeQuery(async () => {
    if (!sql) {
      return null
    }

    const result = await sql`
      SELECT 
        id, email, name, role, account_type, phone, date_of_birth as "dateOfBirth", 
        nationality, passport_number as "passportNumber", 
        emergency_contact as "emergencyContact", travel_preferences as "travelPreferences",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${userId}
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]

    // Parse JSON fields safely
    let emergencyContact = {
      name: "",
      phone: "",
      relationship: "",
    }

    let travelPreferences = {
      accommodationType: "mid-range" as const,
      groupSize: "couple" as const,
      activityLevel: "moderate" as const,
      interests: [] as string[],
    }

    try {
      if (user.emergencyContact) {
        emergencyContact =
          typeof user.emergencyContact === "string" ? JSON.parse(user.emergencyContact) : user.emergencyContact
      }
    } catch (e) {
      console.warn("Failed to parse emergency contact JSON:", e)
    }

    try {
      if (user.travelPreferences) {
        travelPreferences =
          typeof user.travelPreferences === "string" ? JSON.parse(user.travelPreferences) : user.travelPreferences
      }
    } catch (e) {
      console.warn("Failed to parse travel preferences JSON:", e)
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || "",
      nationality: user.nationality || "",
      passportNumber: user.passportNumber || "",
      emergencyContact,
      travelPreferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserProfile
  }, null)
}

export async function updateUserProfileInDB(
  userId: number,
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> {
  return safeQuery(async () => {
    if (!sql) {
      console.error("Database not configured")
      return null
    }

    console.log("Updating user profile in DB:", { userId, updates })

    // Get current profile first
    const currentProfile = await getUserProfileFromDB(userId)
    if (!currentProfile) {
      console.error("Current profile not found for user:", userId)
      return null
    }

    // Use the Neon SQL template syntax instead of unsafe
    try {
      let result

      if (updates.name !== undefined) {
        result = await sql`
          UPDATE users 
          SET name = ${updates.name}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.phone !== undefined) {
        result = await sql`
          UPDATE users 
          SET phone = ${updates.phone}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.dateOfBirth !== undefined) {
        result = await sql`
          UPDATE users 
          SET date_of_birth = ${updates.dateOfBirth}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.nationality !== undefined) {
        result = await sql`
          UPDATE users 
          SET nationality = ${updates.nationality}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.passportNumber !== undefined) {
        result = await sql`
          UPDATE users 
          SET passport_number = ${updates.passportNumber}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.emergencyContact !== undefined) {
        result = await sql`
          UPDATE users 
          SET emergency_contact = ${JSON.stringify(updates.emergencyContact)}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      if (updates.travelPreferences !== undefined) {
        result = await sql`
          UPDATE users 
          SET travel_preferences = ${JSON.stringify(updates.travelPreferences)}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId} 
          RETURNING *
        `
      }

      // If multiple fields need to be updated, do them all at once
      if (Object.keys(updates).length > 1) {
        const updateFields = []
        const values = []

        if (updates.name !== undefined) {
          updateFields.push("name")
          values.push(updates.name)
        }
        if (updates.phone !== undefined) {
          updateFields.push("phone")
          values.push(updates.phone)
        }
        if (updates.dateOfBirth !== undefined) {
          updateFields.push("date_of_birth")
          values.push(updates.dateOfBirth)
        }
        if (updates.nationality !== undefined) {
          updateFields.push("nationality")
          values.push(updates.nationality)
        }
        if (updates.passportNumber !== undefined) {
          updateFields.push("passport_number")
          values.push(updates.passportNumber)
        }
        if (updates.emergencyContact !== undefined) {
          updateFields.push("emergency_contact")
          values.push(JSON.stringify(updates.emergencyContact))
        }
        if (updates.travelPreferences !== undefined) {
          updateFields.push("travel_preferences")
          values.push(JSON.stringify(updates.travelPreferences))
        }

        // Build a single update query for all fields
        const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")
        const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`
        values.push(userId)

        result = await sql.unsafe(query, values)
      }

      if (!result || result.length === 0) {
        console.error("Update query returned no results")
        return null
      }

      // Return the updated profile
      return await getUserProfileFromDB(userId)
    } catch (error) {
      console.error("Database update error:", error)
      return null
    }
  }, null)
}

export async function getUserBookingsFromDB(userId: number) {
  return safeQuery(async () => {
    if (!sql) {
      throw new Error("Database not configured")
    }

    const result = await sql`
      SELECT 
        id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
        package_image as "packageImage", status, booking_date as "bookingDate", 
        travel_date as "travelDate", participants, total_amount as "totalAmount", 
        special_requests as "specialRequests", created_at as "createdAt", updated_at as "updatedAt"
      FROM bookings 
      WHERE user_id = ${userId}
      ORDER BY booking_date DESC
    `
    return result
  }, [])
}

export async function getUserReviewsFromDB(userId: number) {
  return safeQuery(async () => {
    if (!sql) {
      throw new Error("Database not configured")
    }

    const result = await sql`
      SELECT 
        id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
        rating, comment, images, created_at as "createdAt", approved 
      FROM reviews 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return result
  }, [])
}

export async function createBookingInDB(data: {
  userId: number
  packageId: number
  packageTitle: string
  packageImage: string
  travelDate: string
  participants: number
  totalAmount: number
  specialRequests?: string
}) {
  if (!sql) {
    throw new Error("Database not configured. Please check your database connection.")
  }

  const result = await sql`
    INSERT INTO bookings (user_id, package_id, package_title, package_image, travel_date, participants, total_amount, special_requests)
    VALUES (${data.userId}, ${data.packageId}, ${data.packageTitle}, ${data.packageImage}, ${data.travelDate}, ${data.participants}, ${data.totalAmount}, ${data.specialRequests || null})
    RETURNING id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
              package_image as "packageImage", status, booking_date as "bookingDate", 
              travel_date as "travelDate", participants, total_amount as "totalAmount", 
              special_requests as "specialRequests", created_at as "createdAt", updated_at as "updatedAt"
  `
  return result[0]
}

export async function createReviewInDB(data: {
  userId: number
  packageId: number
  packageTitle: string
  rating: number
  comment: string
  images?: string[]
}) {
  if (!sql) {
    throw new Error("Database not configured. Please check your database connection.")
  }

  const result = await sql`
    INSERT INTO reviews (user_id, package_id, package_title, rating, comment, images)
    VALUES (${data.userId}, ${data.packageId}, ${data.packageTitle}, ${data.rating}, ${data.comment}, ${data.images || null})
    RETURNING id, user_id as "userId", package_id as "packageId", package_title as "packageTitle", 
              rating, comment, images, created_at as "createdAt", approved
  `
  return result[0]
}
