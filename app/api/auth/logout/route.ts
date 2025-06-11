import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { invalidateSession } from "@/lib/auth-system"
import { envConfig } from "@/lib/env-config"

export async function POST() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (sessionToken) {
      await invalidateSession(sessionToken)
    }

    const response = NextResponse.json({ success: true })

    // Clear session cookie
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: envConfig.app.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)

    // Always return success for logout
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: envConfig.app.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  }
}
