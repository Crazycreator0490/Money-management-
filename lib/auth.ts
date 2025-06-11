import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { executeQuery } from "./neon-client"
import { ensureTablesExist } from "./db-init"
import { env } from "./env"

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

// Enhanced password hashing with configurable rounds
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = env.NODE_ENV === "production" ? 12 : 10
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex")
}

export async function createSession(userId: number): Promise<string> {
  try {
    await ensureTablesExist()

    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await executeQuery`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionToken}, ${userId}, ${expiresAt})
    `

    return sessionToken
  } catch (error) {
    console.error("Session creation error:", error)
    throw new Error("Failed to create session")
  }
}

export async function validateSession(sessionToken: string): Promise<{ user: User; session: Session } | null> {
  try {
    await ensureTablesExist()

    const result = await executeQuery<{
      session_id: string
      user_id: number
      expires_at: string
      id: number
      email: string
      name: string
    }>`
      SELECT 
        s.id as session_id,
        s.user_id,
        s.expires_at,
        u.id,
        u.email,
        u.name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${sessionToken} AND s.expires_at > NOW()
    `

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
    console.error("Session validation error:", error)
    return null
  }
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  try {
    await ensureTablesExist()
    await executeQuery`DELETE FROM sessions WHERE id = ${sessionToken}`
  } catch (error) {
    console.error("Session invalidation error:", error)
    // Don't throw here as logout should always succeed
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await ensureTablesExist()
    const result = await executeQuery<{ count: number }>`
      DELETE FROM sessions WHERE expires_at < NOW()
      RETURNING COUNT(*) as count
    `
    console.log(`Cleaned up ${result[0]?.count || 0} expired sessions`)
  } catch (error) {
    console.error("Session cleanup error:", error)
  }
}

export async function getUser(userId: number): Promise<User | null> {
  try {
    await ensureTablesExist()
    const result = await executeQuery<User>`
      SELECT id, email, name FROM users WHERE id = ${userId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) return null

    const sessionData = await validateSession(sessionToken)
    return sessionData?.user || null
  } catch (error) {
    console.error("Get current user error:", error)
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

// Enhanced user creation with validation
export async function createUser(name: string, email: string, password: string): Promise<User> {
  try {
    await ensureTablesExist()

    // Validate input
    if (!name?.trim() || !email?.trim() || !password) {
      throw new Error("All fields are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Check if user already exists
    const existingUser = await executeQuery<{ id: number }>`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}
    `

    if (existingUser.length > 0) {
      throw new Error("User already exists")
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)

    const result = await executeQuery<User>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${passwordHash})
      RETURNING id, name, email
    `

    return result[0]
  } catch (error) {
    console.error("User creation error:", error)
    throw error
  }
}

// Enhanced user authentication
export async function authenticateUser(email: string, password: string): Promise<User> {
  try {
    await ensureTablesExist()

    if (!email?.trim() || !password) {
      throw new Error("Email and password are required")
    }

    // Find user
    const result = await executeQuery<{
      id: number
      email: string
      name: string
      password_hash: string
    }>`
      SELECT id, email, name, password_hash 
      FROM users 
      WHERE email = ${email.toLowerCase().trim()}
    `

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
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}
