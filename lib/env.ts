// Environment variable validation and configuration
const requiredEnvVars = ["DATABASE_URL"] as const
const optionalEnvVars = {
  NODE_ENV: "development",
  NEXTAUTH_URL: "",
  SESSION_SECRET: "fallback-secret-change-in-production",
  VERCEL_URL: "",
  VERCEL_ENV: "",
} as const

// Get environment variables with proper fallbacks
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]
  if (value !== undefined) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${key}`)
}

export const env = {
  // Database - try multiple possible variable names
  DATABASE_URL:
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    (() => {
      throw new Error("DATABASE_URL is required. Please set DATABASE_URL, NEON_DATABASE_URL, or POSTGRES_URL")
    })(),

  // Application
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  NEXTAUTH_URL:
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Security
  SESSION_SECRET: getEnvVar("SESSION_SECRET", process.env.NEXTAUTH_SECRET || "default-secret-change-in-production"),

  // Vercel specific
  VERCEL_URL: process.env.VERCEL_URL || "",
  VERCEL_ENV: process.env.VERCEL_ENV || "",
} as const

// Validation function
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    // Check required variables
    if (!env.DATABASE_URL) {
      errors.push("DATABASE_URL is required")
    }

    // Validate DATABASE_URL format
    if (env.DATABASE_URL && !env.DATABASE_URL.startsWith("postgresql://")) {
      errors.push("DATABASE_URL must be a valid PostgreSQL connection string")
    }

    return { valid: errors.length === 0, errors }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown validation error")
    return { valid: false, errors }
  }
}

// Development helpers
export function isDevelopment(): boolean {
  return env.NODE_ENV === "development"
}

export function isProduction(): boolean {
  return env.NODE_ENV === "production"
}

export function isVercel(): boolean {
  return !!env.VERCEL_URL
}

// Log environment status (safe for production)
export function logEnvironmentStatus(): void {
  if (isDevelopment()) {
    console.log("Environment Status:", {
      NODE_ENV: env.NODE_ENV,
      DATABASE_CONFIGURED: !!env.DATABASE_URL,
      VERCEL: isVercel(),
      VERCEL_ENV: env.VERCEL_ENV || "not-set",
    })
  }
}
