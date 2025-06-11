import { NextResponse } from "next/server"
import { ensureTablesExist } from "@/lib/db-init"

export async function POST() {
  try {
    await ensureTablesExist()
    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureTablesExist()
    return NextResponse.json({ success: true, message: "Database tables verified" })
  } catch (error) {
    console.error("Database verification error:", error)
    return NextResponse.json({ error: "Database verification failed" }, { status: 500 })
  }
}
