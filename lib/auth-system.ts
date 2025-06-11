import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { executeQuery, initializeSchema } from "./database"
import { envConfig } from "./env-config"

export type User = {
  id: number
  email: string
  name: string
}

export type Session = {
  id: string
  userId: number
  expiresAt: Date
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = envConfig.app.nodeEnv === "production" ? 12 : 10
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Session management
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex")
}

export async function createSession(userId: number): Promise<string> {
  await initializeSchema()

  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await executeQuery("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [
    sessionToken,
    userId,
    expiresAt,
  ])

  return sessionToken
}

export async function validateSession(sessionToken: string): Promise<{ user: User; session: Session } | null> {
  try {
    const result = await executeQuery<{
      session_id: string
      user_id: number
      expires_at: string
      id: number
      email: string
      name: string
    }>(
      `SELECT 
        s.id as session_id,
        s.user_id,
        s.expires_at,
        u.id,
        u.email,
        u.name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionToken],
    )

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return {
      user: {
        id: row.id,
        email: row.email,
        name: row.name,
      },
      session: {
        id: row.session_id,
        userId: row.user_id,
        expiresAt: new Date(row.expires_at),
      },
    }
  } catch (error) {
    console.error("❌ Session validation failed:", error)
    return null
  }
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  try {
    await executeQuery("DELETE FROM sessions WHERE id = $1", [sessionToken])
  } catch (error) {
    console.error("❌ Session invalidation failed:", error)
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await executeQuery("DELETE FROM sessions WHERE expires_at < NOW()")
  } catch (error) {
    console.error("❌ Session cleanup failed:", error)
  }
}

// User management
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) return null

    const sessionData = await validateSession(sessionToken)
    return sessionData?.user || null
  } catch (error) {
    console.error("❌ Get current user failed:", error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  await initializeSchema()

  // Validate input
  if (!name?.trim() || !email?.trim() || !password) {
    throw new Error("All fields are required")
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long")
  }

  // Check if user exists
  const existingUser = await executeQuery<{ id: number }>("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase().trim(),
  ])

  if (existingUser.length > 0) {
    throw new Error("User already exists")
  }

  // Create user
  const passwordHash = await hashPassword(password)
  const result = await executeQuery<User>(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name.trim(), email.toLowerCase().trim(), passwordHash],
  )

  return result[0]
}

export async function authenticateUser(email: string, password: string): Promise<User> {
  await initializeSchema()

  if (!email?.trim() || !password) {
    throw new Error("Email and password are required")
  }

  // Find user
  const result = await executeQuery<{
    id: number
    email: string
    name: string
    password_hash: string
  }>("SELECT id, email, name, password_hash FROM users WHERE email = $1", [email.toLowerCase().trim()])

  const user = result[0]
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
