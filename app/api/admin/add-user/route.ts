import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hashPassword } from "@/lib/auth"
import { ensureTablesExist } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Ensure database tables exist
    await ensureTablesExist()

    const email = "jinuthomas6985@gmail.com"
    const password = "Antonyoyo"
    const name = "Jinu Thomas"

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING id, name, email
    `

    return NextResponse.json({
      success: true,
      message: "User added successfully",
      user: {
        email: result[0].email,
        name: result[0].name,
      },
    })
  } catch (error) {
    console.error("Error adding user:", error)
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 })
  }
}
