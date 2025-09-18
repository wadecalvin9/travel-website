"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { PackageCard } from "@/components/package-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import type { Package } from "@/types"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [destinationFilter, setDestinationFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [durationFilter, setDurationFilter] = useState("all")

  useEffect(() => {
    fetchPackages()
  }, [])

  useEffect(() => {
    filterPackages()
  }, [packages, searchTerm, destinationFilter, priceFilter, durationFilter])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      const data = await response.json()
      setPackages(data)
      setFilteredPackages(data)
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPackages = () => {
    let filtered = packages

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Destination filter
    if (destinationFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.destination_name?.toLowerCase().includes(destinationFilter.toLowerCase()))
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number)
      filtered = filtered.filter((pkg) => {
        if (max) {
          return pkg.price >= min && pkg.price <= max
        } else {
          return pkg.price >= min
        }
      })
    }

    // Duration filter
    if (durationFilter !== "all") {
      const [min, max] = durationFilter.split("-").map(Number)
      filtered = filtered.filter((pkg) => {
        if (max) {
          return pkg.duration_days >= min && pkg.duration_days <= max
        } else {
          return pkg.duration_days >= min
        }
      })
    }

    setFilteredPackages(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDestinationFilter("all")
    setPriceFilter("all")
    setDurationFilter("all")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading safari packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Safari Packages</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Discover our carefully curated safari experiences across Africa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Destination Filter */}
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="serengeti">Serengeti</SelectItem>
                  <SelectItem value="masai">Masai Mara</SelectItem>
                  <SelectItem value="kruger">Kruger</SelectItem>
                  <SelectItem value="okavango">Okavango</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3000">Over $3,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Duration Filter */}
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Durations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="1-3">1-3 days</SelectItem>
                  <SelectItem value="4-7">4-7 days</SelectItem>
                  <SelectItem value="8-14">8-14 days</SelectItem>
                  <SelectItem value="15">15+ days</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
          </p>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No packages found matching your criteria</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
