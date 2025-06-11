import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Clean up expired sessions
    await sql`DELETE FROM sessions WHERE expires_at < NOW()`

    return NextResponse.json({ success: true, message: "Sessions cleaned up" })
  } catch (error) {
    console.error("Session cleanup error:", error)
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
