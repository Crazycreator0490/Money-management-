import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, cleanupExpiredSessions } from "@/lib/auth-system"
import { envConfig } from "@/lib/env-config"

export async function POST(request: NextRequest) {
  try {
    // Cleanup expired sessions periodically
    if (Math.random() < 0.1) {
      cleanupExpiredSessions().catch(console.error)
    }

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    // Create session
    const sessionToken = await createSession(user.id)

    // Prepare response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    // Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: envConfig.app.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof Error && error.message === "Invalid credentials") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
  }
}
