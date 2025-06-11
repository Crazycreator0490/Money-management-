import { NextResponse } from "next/server"
import { checkNeonConnection, getConnectionInfo } from "@/lib/neon-client"
import { getInitializationStatus } from "@/lib/db-init"
import { env, validateEnvironment } from "@/lib/env"

export async function GET() {
  const startTime = Date.now()

  try {
    console.log("🔍 Starting comprehensive health check...")

    // Environment validation
    const envValidation = validateEnvironment()

    // Database connection check
    const dbHealth = await checkNeonConnection()

    // Connection info
    const connectionInfo = await getConnectionInfo()

    // Database initialization status
    const initStatus = getInitializationStatus()

    const responseTime = Date.now() - startTime

    const health = {
      status: dbHealth.healthy && envValidation.valid ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime,

      environment: {
        validation: envValidation,
        nodeEnv: env.NODE_ENV,
        isVercel: !!env.VERCEL_URL,
        vercelEnv: env.VERCEL_ENV || "not-set",
      },

      database: {
        healthy: dbHealth.healthy,
        latency: dbHealth.latency,
        error: dbHealth.error,
        details: dbHealth.details,
        initialization: initStatus,
      },

      connection: connectionInfo,

      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version: process.version,
      },
    }

    console.log("✅ Health check completed:", {
      status: health.status,
      responseTime: health.responseTime,
      dbHealthy: dbHealth.healthy,
    })

    return NextResponse.json(health, {
      status: health.status === "healthy" ? 200 : 503,
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error("❌ Health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      { status: 500 },
    )
  }
}
