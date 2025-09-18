"use client"

import { useState, useEffect } from "react"
import { Users, MapPin, Star, Calendar } from "lucide-react"

interface Stats {
  totalBookings: number
  totalDestinations: number
  averageRating: number
  yearsExperience: number
}

const defaultStats: Stats = {
  totalBookings: 0,
  totalDestinations: 0,
  averageRating: 0,
  yearsExperience: 0,
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats({ ...defaultStats, ...data })
        } else {
          setStats(defaultStats)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback stats
        setStats(defaultStats)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      icon: Users,
      value: loading ? "..." : stats.totalBookings.toLocaleString(),
      label: "Happy Travelers",
      suffix: "+",
    },
    {
      icon: MapPin,
      value: loading ? "..." : stats.totalDestinations.toString(),
      label: "Destinations",
      suffix: "+",
    },
    {
      icon: Star,
      value: loading ? "..." : stats.averageRating.toString(),
      label: "Average Rating",
      suffix: "/5",
    },
    {
      icon: Calendar,
      value: loading ? "..." : stats.yearsExperience.toString(),
      label: "Years Experience",
      suffix: "+",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600">Numbers that reflect our commitment to exceptional safari experiences</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {item.value}
                  <span className="text-green-600">{item.suffix}</span>
                </div>
                <div className="text-gray-600 font-medium">{item.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
