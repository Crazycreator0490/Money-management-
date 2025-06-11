import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"
import { runMigrations } from "@/lib/db-init"
import { isProduction } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    // Ensure database is ready
    await runMigrations()

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { name, email, password } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Create user
    const user = await createUser(name, email, password)

    // Create session
    const sessionToken = await createSession(user.id)

    // Prepare response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
    console.error("Registration error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }

      if (error.message.includes("required") || error.message.includes("characters")) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
