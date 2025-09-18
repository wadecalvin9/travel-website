// types/index.ts
/* -------------------------------------------------------------------------- */
/*                                CORE MODELS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Single travel package / tour.
 */
export interface Package {
  id: number
  title: string
  description: string
  detailed_description: string
  /* ---------------------------------------------------------------------- */
  /* Flexible pricing                                                       */
  /* ---------------------------------------------------------------------- */
  /**
   * Numerical price when `pricing_type` is `"fixed"`. `null` if custom text.
   */
  price: number | null
  /**
   * Custom pricing text (e.g. `"On Request"`, `"TBA"`). `null` if fixed price.
   */
  price_text: string | null
  /**
   * `"fixed"` – uses numeric `price`
   * `"custom"` – shows `price_text`
   */
  pricing_type: "fixed" | "custom"
  /**
   * 3-letter ISO currency code (USD, EUR …).
   * Only relevant when `pricing_type` is `"fixed"`.
   */
  currency: CurrencyCode

  duration_days: number
  max_participants: number

  /* ---------------------------------------------------------------------- */
  /* Media                                                                   */
  /* ---------------------------------------------------------------------- */
  image_url: string
  gallery_images?: string[]

  /* ---------------------------------------------------------------------- */
  /* Relations                                                               */
  /* ---------------------------------------------------------------------- */
  destination_id: number
  destination_name?: string
  country?: string

  /* ---------------------------------------------------------------------- */
  /* Misc                                                                    */
  /* ---------------------------------------------------------------------- */
  included: string[]
  excluded: string[]
  itinerary: Record<string, string>
  featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

/**
 * Destination / location that hosts packages.
 */
export interface Destination {
  id: number
  name: string
  description: string
  image_url: string
  country: string
  featured: boolean
  package_count?: number
  created_at: string
  updated_at: string
}

/**
 * Customer testimonial.
 */
export interface Testimonial {
  id: number
  name: string
  email?: string
  rating: number
  comment: string
  image_url?: string
  featured: boolean
  approved: boolean
  created_at: string
  updated_at: string
}

/**
 * Inquiry / lead submitted by a visitor.
 */
export interface Inquiry {
  id: number
  name: string
  email: string
  phone?: string
  package_id?: number
  message: string
  preferred_date?: string
  participants?: number
  status: string
  created_at: string
  updated_at: string
}

/**
 * Application user / admin.
 */
export interface User {
  id: number
  email: string
  name: string
  role: string
  account_type?: AccountType
  created_at: string
  updated_at: string
}

/* -------------------------------------------------------------------------- */
/*                            ACCOUNT-TYPE HELPERS                            */
/* -------------------------------------------------------------------------- */

export type AccountType = "standard" | "premium" | "vip"

export interface AccountTypeFeatures {
  directBooking: boolean
  accommodationBooking: boolean
  prioritySupport: boolean
  discounts: number
  advancedFeatures: boolean
}

/* -------------------------------------------------------------------------- */
/*                              CURRENCY HELPERS                              */
/* -------------------------------------------------------------------------- */

/**
 * List of currencies supported by the UI.
 * Feel free to extend as needed – just keep the `code` & `symbol`.
 */
export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
] as const

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"]
