import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"

// 1. Specify protected and public routes
const protectedRoutes = ["/admin", "/profile", "/profile/edit"]
const publicRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password", "/"]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const session = await getIronSession(req.cookies, sessionOptions)
  const user = session.userId
    ? { id: session.userId, email: session.userEmail, name: session.userName, role: session.userRole }
    : null

  // Redirect to signin if trying to access protected route without being logged in
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  // Redirect logged-in users from auth pages to their profile/dashboard
  if (isPublicRoute && user && path.startsWith("/auth")) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl))
    } else {
      return NextResponse.redirect(new URL("/profile", req.nextUrl))
    }
  }

  // Admin-specific protection
  if (path.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
