"use client"

import { useState, useEffect } from "react"

export interface Package {
  id: string
  title: string
  description: string
  price: number
  duration: string
  location: string
  image: string
  featured: boolean
  category: string
  includes: string[]
  excludes: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
  }>
  createdAt: string
  updatedAt: string
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/packages")
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      } else {
        setError("Failed to fetch packages")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error fetching packages:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedPackages = () => {
    return packages.filter((pkg) => pkg.featured)
  }

  const getPackagesByCategory = (category: string) => {
    return packages.filter((pkg) => pkg.category === category)
  }

  return {
    packages,
    loading,
    error,
    refetch: fetchPackages,
    getFeaturedPackages,
    getPackagesByCategory,
  }
}
