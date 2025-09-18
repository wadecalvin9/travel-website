export interface UserProfile {
  id: number
  email: string
  name: string
  role: string
  phone?: string
  dateOfBirth?: string
  nationality?: string
  passportNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  travelPreferences?: {
    accommodationType: "budget" | "mid-range" | "luxury"
    groupSize: "solo" | "couple" | "small-group" | "large-group"
    activityLevel: "relaxed" | "moderate" | "active" | "adventurous"
    interests: string[]
  }
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: number
  userId: number
  packageId: number
  packageTitle: string
  packageImage: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  bookingDate: string
  travelDate: string
  participants: number
  totalAmount: number
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: number
  userId: number
  packageId: number
  packageTitle: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  approved: boolean
}
