import { NextResponse } from "next/server"
import { initializeSchema } from "@/lib/database"
import { validateEnvironment } from "@/lib/env-config"

export async function POST() {
  try {
    console.log("🚀 Starting database initialization...")

    // Validate environment
    const validation = validateEnvironment()
    if (!validation.valid) {
      throw new Error(`Environment validation failed: ${validation.errors.join(", ")}`)
    }

    // Initialize database schema
    await initializeSchema()

    console.log("✅ Database initialization completed successfully")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to initialize database",
    endpoints: {
      initialize: "POST /api/init",
      health: "GET /api/health",
    },
  })
}
