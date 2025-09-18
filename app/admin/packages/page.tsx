"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useCallback } from "react"
import type { Package } from "@/types"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Trash, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const fetchPackages = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true)
      const res = await fetch("/api/packages", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (res.ok) {
        const data = await res.json()
        setPackages(data)
      } else {
        toast.error("Failed to fetch packages")
      }
    } catch (err) {
      console.error("Error fetching packages:", err)
      toast.error("Error loading packages")
    } finally {
      setLoading(false)
      if (showRefreshIndicator) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // Auto-refresh every 30 seconds when page is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPackages()
      }
    }

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchPackages()
      }
    }, 30000)

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchPackages])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) {
      return
    }

    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        // Immediately update local state
        setPackages(packages.filter((pkg) => pkg.id !== id))
        toast.success("Package deleted successfully")
        // Refresh data to ensure consistency
        setTimeout(() => fetchPackages(), 500)
      } else {
        toast.error("Failed to delete package")
      }
    } catch (error) {
      console.error("Error deleting package:", error)
      toast.error("Error deleting package")
    }
  }

  const handleRefresh = () => {
    fetchPackages(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Packages</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/packages/new">Add Package</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>A list of your packages. Auto-refreshes every 30 seconds.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.id}</TableCell>
                <TableCell className="font-medium">{pkg.title}</TableCell>
                <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                <TableCell>${pkg.price}</TableCell>
                <TableCell>{pkg.duration_days} days</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/packages/${pkg.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-gray-500">No packages found</p>
                <Button asChild className="mt-2">
                  <Link href="/admin/packages/new">Create your first package</Link>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
