import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth-system"
import { envConfig } from "@/lib/env-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

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
    console.error("Registration error:", error)

    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
