"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { UserProfile, Booking, Review } from "@/types/profile"

export function useProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProfileData = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setBookings([])
      setReviews([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [profileRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/bookings"),
        fetch("/api/reviews"),
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      } else {
        console.error("Failed to fetch profile:", await profileRes.text())
        setProfile(null)
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      } else {
        console.error("Failed to fetch bookings:", await bookingsRes.text())
        setBookings([])
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
      } else {
        console.error("Failed to fetch reviews:", await reviewsRes.text())
        setReviews([])
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
      setProfile(null)
      setBookings([])
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      fetchProfileData()
    }
  }, [authLoading, fetchProfileData])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error("No user logged in")
      return false
    }

    try {
      console.log("Updating profile with:", updates)

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        console.log("Profile updated successfully:", updatedProfile)
        setProfile(updatedProfile)
        return true
      } else {
        const errorData = await response.json()
        console.error("Failed to update profile:", errorData)
        return false
      }
    } catch (error) {
      console.error("Network error updating profile:", error)
      return false
    }
  }

  const createBooking = async (
    bookingData: Omit<Booking, "id" | "userId" | "status" | "bookingDate" | "createdAt" | "updatedAt">,
  ) => {
    if (!user) return null

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const newBooking = await response.json()
        setBookings((prev) => [newBooking, ...prev])
        return newBooking
      } else {
        const errorData = await response.json()
        console.error("Failed to create booking:", errorData.error)
        return null
      }
    } catch (error) {
      console.error("Network error creating booking:", error)
      return null
    }
  }

  const createReview = async (reviewData: Omit<Review, "id" | "userId" | "createdAt" | "approved">) => {
    if (!user) return null

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews((prev) => [newReview, ...prev])
        return newReview
      } else {
        const errorData = await response.json()
        console.error("Failed to create review:", errorData.error)
        return null
      }
    } catch (error) {
      console.error("Network error creating review:", error)
      return null
    }
  }

  return {
    profile,
    bookings,
    reviews,
    loading,
    updateProfile,
    createBooking,
    createReview,
    refreshData: fetchProfileData,
  }
}
