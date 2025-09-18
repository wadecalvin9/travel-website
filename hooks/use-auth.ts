"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/auth-utils"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      console.log("Fetching user from /api/auth/me")
      const response = await fetch("/api/auth/me")
      console.log("Response status:", response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log("User data received:", userData)
        setUser(userData.user)
      } else {
        console.log("Response not ok, setting user to null")
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || "Sign in failed" }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Network error or server unavailable" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })
      if (response.ok) {
        setUser(null)
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || "Sign out failed" }
      }
    } catch (error) {
      console.error("Sign out error:", error)
      return { success: false, error: "Network error or server unavailable" }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || "Sign up failed" }
      }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "Network error or server unavailable" }
    } finally {
      setLoading(false)
    }
  }

  const refreshAuth = useCallback(async () => {
    console.log("Manual auth refresh triggered")
    await fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    isAdmin: user?.role === "admin",
    refreshUser: fetchUser,
    refreshAuth,
  }
}
