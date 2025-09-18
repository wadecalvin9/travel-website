import type { UserProfile, Booking, Review } from "@/types/profile"

// Mock data for demonstration
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    userId: "1",
    packageId: 1,
    packageTitle: "Great Migration Safari",
    packageImage: "/placeholder.svg?height=200&width=300",
    status: "confirmed",
    bookingDate: "2024-05-15",
    travelDate: "2024-08-20",
    participants: 2,
    totalAmount: 4998,
    specialRequests: "Vegetarian meals preferred",
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
  },
  {
    id: "booking-2",
    userId: "1",
    packageId: 2,
    packageTitle: "Big Five Adventure",
    packageImage: "/placeholder.svg?height=200&width=300",
    status: "completed",
    bookingDate: "2024-03-10",
    travelDate: "2024-06-15",
    participants: 1,
    totalAmount: 1899,
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-06-20T09:00:00Z",
  },
]

const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    userId: "1",
    packageId: 2,
    packageTitle: "Big Five Adventure",
    rating: 5,
    comment:
      "Absolutely incredible experience! The guides were knowledgeable and we saw all the Big Five. The accommodations were excellent and the food was amazing. Would definitely book again!",
    images: ["/placeholder.svg?height=200&width=300"],
    createdAt: "2024-06-22T16:45:00Z",
    approved: true,
  },
]

export function getUserProfile(userId: string): UserProfile | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(`profile-${userId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return

  localStorage.setItem(`profile-${profile.id}`, JSON.stringify(profile))
}

export function getUserBookings(userId: string): Booking[] {
  // In a real app, this would fetch from an API
  return MOCK_BOOKINGS.filter((booking) => booking.userId === userId)
}

export function getUserReviews(userId: string): Review[] {
  // In a real app, this would fetch from an API
  return MOCK_REVIEWS.filter((review) => review.userId === userId)
}

export function createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would save to an API
  MOCK_BOOKINGS.push(newBooking)
  return newBooking
}

export function createReview(review: Omit<Review, "id" | "createdAt" | "approved">): Review {
  const newReview: Review = {
    ...review,
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
    approved: false,
  }

  // In a real app, this would save to an API
  MOCK_REVIEWS.push(newReview)
  return newReview
}
