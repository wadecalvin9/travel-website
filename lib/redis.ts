import { Redis } from "@upstash/redis"

let redis: Redis | null = null

function getRedisClient(): Redis {
  if (!redis) {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      throw new Error("Upstash Redis environment variables are not set")
    }

    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }

  return redis
}

// Cache keys
export const CACHE_KEYS = {
  FEATURED_PACKAGES: "featured_packages",
  POPULAR_PACKAGES: "popular_packages",
  TESTIMONIALS: "testimonials",
  DESTINATIONS: "destinations",
  PACKAGE_VIEWS: (id: number) => `package_views:${id}`,
}

// Cache helpers
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient()
    const data = await client.get(key)
    return data as T
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCachedData(key: string, data: any, ttl = 3600) {
  try {
    const client = getRedisClient()
    await client.setex(key, ttl, JSON.stringify(data))
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export async function incrementViews(packageId: number) {
  try {
    const client = getRedisClient()
    const key = CACHE_KEYS.PACKAGE_VIEWS(packageId)
    await client.incr(key)
  } catch (error) {
    console.error("Redis incr error:", error)
  }
}

// Pub/Sub for real-time notifications
export async function publishInquiry(inquiry: any) {
  try {
    const client = getRedisClient()
    await client.publish("new_inquiry", JSON.stringify(inquiry))
  } catch (error) {
    console.error("Redis publish error:", error)
  }
}
