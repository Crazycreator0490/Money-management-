import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, cleanupExpiredSessions } from "@/lib/auth"
import { runMigrations } from "@/lib/db-init"
import { isProduction } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    // Ensure database is ready
    await runMigrations()

    // Cleanup expired sessions periodically
    if (Math.random() < 0.1) {
      // 10% chance
      cleanupExpiredSessions().catch(console.error)
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { email, password } = body

    // Validate required fields
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
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

    // Set secure session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      if (error.message.includes("required")) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
  }
}
