import { NextResponse } from "next/server"
import { runMigrations } from "@/lib/db-init"
import { checkNeonConnection } from "@/lib/neon-client"
import { validateEnvironment } from "@/lib/env"

export async function POST() {
  try {
    console.log("🚀 Starting deployment verification...")

    // Step 1: Validate environment
    console.log("1️⃣ Validating environment variables...")
    const envValidation = validateEnvironment()
    if (!envValidation.valid) {
      throw new Error(`Environment validation failed: ${envValidation.errors.join(", ")}`)
    }
    console.log("✅ Environment variables validated")

    // Step 2: Check database connection
    console.log("2️⃣ Checking database connection...")
    const dbHealth = await checkNeonConnection()
    if (!dbHealth.healthy) {
      throw new Error(`Database connection failed: ${dbHealth.error}`)
    }
    console.log("✅ Database connection verified")

    // Step 3: Run migrations
    console.log("3️⃣ Running database migrations...")
    await runMigrations()
    console.log("✅ Database migrations completed")

    // Step 4: Final health check
    console.log("4️⃣ Final health check...")
    const finalCheck = await checkNeonConnection()
    if (!finalCheck.healthy) {
      throw new Error("Final health check failed")
    }
    console.log("✅ Final health check passed")

    console.log("🎉 Deployment verification completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Deployment verification completed successfully",
      timestamp: new Date().toISOString(),
      checks: {
        environment: "✅ Passed",
        database: "✅ Connected",
        migrations: "✅ Completed",
        finalCheck: "✅ Passed",
      },
    })
  } catch (error) {
    console.error("❌ Deployment verification failed:", error)

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
    message: "Use POST method to run deployment verification",
    endpoints: {
      verify: "POST /api/verify-deployment",
      health: "GET /api/health",
    },
  })
}
