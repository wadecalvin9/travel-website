"use client"

import { useState, useEffect } from "react"

export interface Stats {
  totalPackages: number
  totalBookings: number
  totalUsers: number
  totalDestinations: number
  totalReviews: number
  averageRating: number
  monthlyBookings: number
  yearlyRevenue: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError("Failed to fetch stats")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
