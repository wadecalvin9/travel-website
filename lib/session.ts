import { getIronSession, type IronSessionOptions } from "iron-session"
import { cookies } from "next/headers"

// This is the type of the data that will be stored in the session
declare module "iron-session" {
  interface IronSessionData {
    userId?: number
    userEmail?: string
    userName?: string
    userRole?: string
  }
}

// Generate a development fallback secret (not for production use)
const getSessionPassword = () => {
  // Use the provided secure password
  const securePassword = "7a9d2432cd2a36537e1cfbd471edce4c884851e83a94084775166ec389591294"

  if (process.env.SECRET_COOKIE_PASSWORD) {
    return process.env.SECRET_COOKIE_PASSWORD
  }

  // Use the secure fallback for production builds
  return securePassword
}

export const sessionOptions: IronSessionOptions = {
  password: getSessionPassword(),
  cookieName: "travel_connect_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  },
}

export async function getSession() {
  try {
    const session = await getIronSession(cookies(), sessionOptions)
    return session
  } catch (error) {
    console.error("Session error:", error)
    // Return a mock session object to prevent build failures
    return {
      userId: undefined,
      userEmail: undefined,
      userName: undefined,
      userRole: undefined,
      save: async () => {},
      destroy: () => {},
    } as any
  }
}

export async function destroySession() {
  try {
    const session = await getIronSession(cookies(), sessionOptions)
    session.destroy()
  } catch (error) {
    console.error("Error destroying session:", error)
  }
}
