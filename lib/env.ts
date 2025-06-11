// Environment variable validation and configuration
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,

  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXTAUTH_URL:
    process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",

  // Security
  SESSION_SECRET: process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET,

  // Vercel specific
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
} as const

// Validation function
export function validateEnvironment() {
  const required = ["DATABASE_URL"] as const
  const missing = required.filter((key) => !env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

// Development helper
export function isDevelopment() {
  return env.NODE_ENV === "development"
}

export function isProduction() {
  return env.NODE_ENV === "production"
}

export function isVercel() {
  return !!env.VERCEL_URL
}
