"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Search, ArrowLeft, Mail, Calendar, Shield, User, Crown, Star } from "lucide-react"
import Link from "next/link"

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  account_type: string
  phone?: string
  created_at: string
  booking_count: number
  review_count: number
}

export default function AdminUsersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/auth/signin")
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update user role error:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const updateAccountType = async (userId: number, newAccountType: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_type: newAccountType }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account type updated successfully",
        })
        setUsers(users.map((u) => (u.id === userId ? { ...u, account_type: newAccountType } : u)))
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update account type",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update account type error:", error)
      toast({
        title: "Error",
        description: "Failed to update account type",
        variant: "destructive",
      })
    }
  }

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case "premium":
        return <Star className="h-3 w-3 mr-1" />
      case "vip":
        return <Crown className="h-3 w-3 mr-1" />
      default:
        return <User className="h-3 w-3 mr-1" />
    }
  }

  const getAccountTypeBadgeVariant = (accountType: string) => {
    switch (accountType) {
      case "premium":
        return "default"
      case "vip":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesAccountType = accountTypeFilter === "all" || u.account_type === accountTypeFilter

    return matchesSearch && matchesRole && matchesAccountType
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600">View and manage user accounts and privileges</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Account Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <Card key={u.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{u.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Mail className="h-4 w-4" />
                          {u.email}
                        </div>
                        {u.phone && <p className="text-sm text-gray-600 mb-2">Phone: {u.phone}</p>}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mb-2">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          <Shield className="h-3 w-3 mr-1" />
                          {u.role}
                        </Badge>
                        <Badge variant={getAccountTypeBadgeVariant(u.account_type || "standard")}>
                          {getAccountTypeIcon(u.account_type || "standard")}
                          {(u.account_type || "standard").charAt(0).toUpperCase() +
                            (u.account_type || "standard").slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{u.booking_count || 0} bookings</p>
                        <p>{u.review_count || 0} reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Select value={u.role} onValueChange={(role) => updateUserRole(u.id, role)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={u.account_type || "standard"}
                      onValueChange={(accountType) => updateAccountType(u.id, accountType)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${u.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== "all" || accountTypeFilter !== "all"
                    ? "No users match your search criteria."
                    : "No users have registered yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
