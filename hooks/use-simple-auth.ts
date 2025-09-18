"use client"

import { useState, useEffect } from "react"
import { saveUserSession, getUserSession, clearUserSession, validateCredentials, type User } from "@/lib/auth"

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = getUserSession()
    setUser(savedUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const validUser = validateCredentials(email, password)

    if (validUser) {
      setUser(validUser)
      saveUserSession(validUser)
      return { success: true }
    } else {
      return { success: false, error: "Invalid credentials" }
    }
  }

  const signOut = () => {
    setUser(null)
    clearUserSession()
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAdmin: user?.role === "admin",
  }
}
