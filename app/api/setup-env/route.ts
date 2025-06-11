import { NextResponse } from "next/server"
import { validateEnvironment, getDatabaseConnectionDetails } from "@/lib/env"

export async function GET() {
  try {
    // Get environment validation
    const validation = validateEnvironment()

    // Get database connection details
    const dbDetails = getDatabaseConnectionDetails()

    // Check which environment variables are available
    const availableVars = {
      // Database URLs
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      KONLY_DATABASE_URL: !!process.env.KONLY_DATABASE_URL,
      KONLY_POSTGRES_URL: !!process.env.KONLY_POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,

      // Application
      NODE_ENV: !!process.env.NODE_ENV,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      VERCEL_URL: !!process.env.VERCEL_URL,

      // Security
      SESSION_SECRET: !!process.env.SESSION_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      VERCEL_SECRET: !!process.env.VERCEL_SECRET,

      // Custom
      CUSTOM_KEY: !!process.env.CUSTOM_KEY,

      // Database details
      POSTGRES_HOST: !!process.env.POSTGRES_HOST,
      POSTGRES_USER: !!process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
      POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,

      // Alternative database details
      KONLY_POSTGRES_HOST: !!process.env.KONLY_POSTGRES_HOST,
      KONLY_POSTGRES_USER: !!process.env.KONLY_POSTGRES_USER,
      KONLY_POSTGRES_USERNAME: !!process.env.KONLY_POSTGRES_USERNAME,
      KONLY_POSTGRES_PASSWORD: !!process.env.KONLY_POSTGRES_PASSWORD,
      KONLY_POSTGRES_DATABASE: !!process.env.KONLY_POSTGRES_DATABASE,
    }

    // Count configured variables
    const configuredCount = Object.values(availableVars).filter(Boolean).length
    const totalCount = Object.keys(availableVars).length

    // Determine setup status
    const hasDatabase =
      availableVars.DATABASE_URL ||
      availableVars.POSTGRES_URL ||
      availableVars.KONLY_DATABASE_URL ||
      availableVars.KONLY_POSTGRES_URL ||
      availableVars.POSTGRES_PRISMA_URL

    const hasBasicConfig = hasDatabase && availableVars.NODE_ENV

    const setupStatus = {
      ready: validation.valid && hasBasicConfig,
      hasDatabase,
      hasBasicConfig,
      configuredVariables: configuredCount,
      totalVariables: totalCount,
      completionPercentage: Math.round((configuredCount / totalCount) * 100),
    }

    // Recommendations
    const recommendations = []

    if (!hasDatabase) {
      recommendations.push("❌ Set a database URL (DATABASE_URL, POSTGRES_URL, or alternatives)")
    }

    if (!availableVars.CUSTOM_KEY) {
      recommendations.push("⚠️ Set CUSTOM_KEY for application security")
    }

    if (!availableVars.SESSION_SECRET && !availableVars.NEXTAUTH_SECRET && !availableVars.VERCEL_SECRET) {
      recommendations.push("⚠️ Set a session secret (SESSION_SECRET, NEXTAUTH_SECRET, or VERCEL_SECRET)")
    }

    if (!availableVars.NEXTAUTH_URL && !availableVars.VERCEL_URL) {
      recommendations.push("⚠️ Set NEXTAUTH_URL for proper authentication redirects")
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ All essential environment variables are configured!")
    }

    return NextResponse.json({
      status: setupStatus.ready ? "ready" : "needs-configuration",
      validation,
      setupStatus,
      availableVariables: availableVars,
      databaseDetails: dbDetails,
      recommendations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Environment setup check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
