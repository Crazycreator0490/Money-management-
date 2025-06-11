import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/database"
import { validateEnvironment, envConfig } from "@/lib/env-config"

export async function GET() {
  const startTime = Date.now()

  try {
    // Environment validation
    const envValidation = validateEnvironment()

    // Database health check
    const dbHealth = await checkDatabaseHealth()

    const responseTime = Date.now() - startTime

    const health = {
      status: dbHealth.healthy && envValidation.valid ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime,

      environment: {
        validation: envValidation,
        nodeEnv: envConfig.app.nodeEnv,
        isVercel: !!envConfig.app.vercelUrl,
        customKeyConfigured: envConfig.app.customKey !== "default-key",
        features: envConfig.features,
      },

      database: {
        healthy: dbHealth.healthy,
        latency: dbHealth.latency,
        error: dbHealth.error,
        details: dbHealth.details,
      },

      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version: process.version,
        platform: process.platform,
      },
    }

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
      },
      { status: 500 },
    )
  }
}
