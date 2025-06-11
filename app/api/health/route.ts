import { NextResponse } from "next/server"
import { checkNeonConnection, getConnectionInfo } from "@/lib/neon-client"
import { env } from "@/lib/env"

export async function GET() {
  try {
    const startTime = Date.now()

    // Check database connection
    const dbHealth = await checkNeonConnection()

    // Get connection info
    const connectionInfo = await getConnectionInfo()

    const responseTime = Date.now() - startTime

    const health = {
      status: dbHealth.healthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime,
      database: {
        healthy: dbHealth.healthy,
        latency: dbHealth.latency,
        error: dbHealth.error,
      },
      environment: {
        nodeEnv: env.NODE_ENV,
        isVercel: !!env.VERCEL_URL,
        vercelEnv: env.VERCEL_ENV,
      },
      connection: connectionInfo,
    }

    return NextResponse.json(health, {
      status: dbHealth.healthy ? 200 : 503,
    })
  } catch (error) {
    console.error("Health check error:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    )
  }
}
