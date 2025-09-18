// Simple session storage - no cookies, no JWT, just browser storage
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export const ADMIN_USER: User = {
  id: "1",
  email: "admin@travelconnect.com",
  name: "Admin User",
  role: "admin",
}

export const DEMO_USER: User = {
  id: "2",
  email: "user@example.com",
  name: "Demo User",
  role: "user",
}

export function validateCredentials(email: string, password: string): User | null {
  if (email === "admin@travelconnect.com" && password === "admin123") {
    return ADMIN_USER
  }
  if (email === "user@example.com" && password === "password123") {
    return DEMO_USER
  }
  return null
}

export function createUser(userData: {
  name: string
  email: string
  password: string
  phone?: string
}): User {
  // In a real app, this would hash the password and save to database
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: "user",
  }

  // For demo purposes, we'll just return the user
  // In reality, you'd save to database and return the created user
  return newUser
}

// Simple browser storage functions
export function saveUserSession(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("travel-connect-user", JSON.stringify(user))
  }
}

export function getUserSession(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("travel-connect-user")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearUserSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("travel-connect-user")
  }
}
