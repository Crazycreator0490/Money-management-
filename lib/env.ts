// Environment variable validation and configuration
const requiredEnvVars = ["DATABASE_URL"] as const

// Get environment variables with proper fallbacks and multiple sources
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]
  if (value !== undefined) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${key}`)
}

// Try multiple database URL sources
function getDatabaseUrl(): string {
  const possibleSources = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.KONLY_DATABASE_URL,
    process.env.KONLY_POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
  ]

  for (const url of possibleSources) {
    if (url && url.trim()) {
      console.log("✅ Database URL found from environment variables")
      return url
    }
  }

  throw new Error(
    "No database URL found. Please set one of: DATABASE_URL, POSTGRES_URL, KONLY_DATABASE_URL, KONLY_POSTGRES_URL, or POSTGRES_PRISMA_URL",
  )
}

export const env = {
  // Database - try multiple possible variable names
  DATABASE_URL: getDatabaseUrl(),

  // Application
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  NEXTAUTH_URL:
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Security
  SESSION_SECRET:
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.VERCEL_SECRET ||
    "default-secret-change-in-production",

  // Vercel specific
  VERCEL_URL: process.env.VERCEL_URL || "",
  VERCEL_ENV: process.env.VERCEL_ENV || "",

  // Custom application key
  CUSTOM_KEY: process.env.CUSTOM_KEY || "default-custom-key",

  // Additional database connection details (if needed)
  POSTGRES_HOST: process.env.POSTGRES_HOST || process.env.KONLY_POSTGRES_HOST || "",
  POSTGRES_USER:
    process.env.POSTGRES_USER || process.env.KONLY_POSTGRES_USER || process.env.KONLY_POSTGRES_USERNAME || "",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || process.env.KONLY_POSTGRES_PASSWORD || "",
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || process.env.KONLY_POSTGRES_DATABASE || "",
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

    // Log available environment info (safe for production)
    console.log("🔍 Environment validation:", {
      databaseConfigured: !!env.DATABASE_URL,
      nodeEnv: env.NODE_ENV,
      isVercel: !!env.VERCEL_URL,
      customKeySet: !!env.CUSTOM_KEY,
    })

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
  const status = {
    NODE_ENV: env.NODE_ENV,
    DATABASE_CONFIGURED: !!env.DATABASE_URL,
    VERCEL: isVercel(),
    VERCEL_ENV: env.VERCEL_ENV || "not-set",
    CUSTOM_KEY_SET: !!env.CUSTOM_KEY,
    POSTGRES_HOST_SET: !!env.POSTGRES_HOST,
  }

  if (isDevelopment()) {
    console.log("🔧 Environment Status:", status)
  } else {
    console.log("✅ Production environment configured")
  }
}

// Get database connection details for debugging
export function getDatabaseConnectionDetails(): {
  host: string
  user: string
  database: string
  hasPassword: boolean
} {
  return {
    host: env.POSTGRES_HOST || "from-url",
    user: env.POSTGRES_USER || "from-url",
    database: env.POSTGRES_DATABASE || "from-url",
    hasPassword: !!env.POSTGRES_PASSWORD,
  }
}
