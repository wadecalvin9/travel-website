"use client"

import { useState, useEffect } from "react"

export interface Destination {
  id: string
  name: string
  description: string
  image: string
  country: string
  featured: boolean
  packageCount: number
  createdAt: string
  updatedAt: string
}

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data)
      } else {
        setError("Failed to fetch destinations")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error fetching destinations:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedDestinations = () => {
    return destinations.filter((dest) => dest.featured)
  }

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations,
    getFeaturedDestinations,
  }
}
