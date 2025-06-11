// Environment configuration using available variables
export const envConfig = {
  // Database configuration - using KONLY variables as primary
  database: {
    url:
      process.env.KONLY_DATABASE_URL ||
      process.env.KONLY_POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      (() => {
        throw new Error("No database URL found in environment variables")
      })(),

    host: process.env.KONLY_POSTGRES_HOST || process.env.POSTGRES_HOST || "",
    user: process.env.KONLY_POSTGRES_USER || process.env.KONLY_POSTGRES_USERNAME || process.env.POSTGRES_USER || "",
    password: process.env.KONLY_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD || "",
    database: process.env.KONLY_POSTGRES_DATABASE || process.env.POSTGRES_DATABASE || "",
  },

  // Application configuration
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    customKey: process.env.CUSTOM_KEY || "default-key",
    vercelUrl: process.env.VERCEL_URL || "",
    nextAuthUrl:
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  },

  // Security configuration
  security: {
    sessionSecret:
      process.env.SESSION_SECRET ||
      process.env.VERCEL_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "fallback-secret-change-in-production",
    jwtSecret: process.env.JWT_SECRET || process.env.CUSTOM_KEY || "jwt-fallback-secret",
  },

  // Strapi configuration (if needed)
  strapi: {
    url: process.env.KONLY_NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "",
    graphqlUrl: process.env.KONLY_NEXT_PUBLIC_STRAPI_GRAPHQL_URL || process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL || "",
    secretKey: process.env.KONLY_STRAPI_SECRET_GRAPHQL || process.env.STRAPI_SECRET_GRAPHQL_KEY || "",
  },

  // Feature flags
  features: {
    useStrapi: !!(process.env.KONLY_NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL),
    useUpscale: !!process.env.KONLY_PROJECT_UPSCALE,
    useSupabase: !!process.env.KONLY_SUPABASE,
  },
}

// Validation functions
export function validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required database configuration
  if (!envConfig.database.url) {
    errors.push("Database URL is required (KONLY_DATABASE_URL, KONLY_POSTGRES_URL, DATABASE_URL, or POSTGRES_URL)")
  }

  // Validate database URL format
  if (envConfig.database.url && !envConfig.database.url.startsWith("postgresql://")) {
    errors.push("Database URL must be a valid PostgreSQL connection string")
  }

  // Check security configuration
  if (
    envConfig.security.sessionSecret === "fallback-secret-change-in-production" &&
    envConfig.app.nodeEnv === "production"
  ) {
    warnings.push("Using fallback session secret in production - set SESSION_SECRET, VERCEL_SECRET, or NEXTAUTH_SECRET")
  }

  // Check custom key
  if (!envConfig.app.customKey || envConfig.app.customKey === "default-key") {
    warnings.push("CUSTOM_KEY not set or using default value")
  }

  return { valid: errors.length === 0, errors, warnings }
}

// Helper functions
export function isDevelopment(): boolean {
  return envConfig.app.nodeEnv === "development"
}

export function isProduction(): boolean {
  return envConfig.app.nodeEnv === "production"
}

export function isVercel(): boolean {
  return !!envConfig.app.vercelUrl
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironment()

  console.log("🔧 Environment Configuration:", {
    nodeEnv: envConfig.app.nodeEnv,
    databaseConfigured: !!envConfig.database.url,
    customKeySet: envConfig.app.customKey !== "default-key",
    isVercel: isVercel(),
    strapiEnabled: envConfig.features.useStrapi,
    upscaleEnabled: envConfig.features.useUpscale,
    supabaseEnabled: envConfig.features.useSupabase,
    validationStatus: validation.valid ? "✅ Valid" : "❌ Invalid",
    errors: validation.errors,
    warnings: validation.warnings,
  })
}
