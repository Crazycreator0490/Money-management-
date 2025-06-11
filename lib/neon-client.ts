import { neon } from "@neondatabase/serverless"
import { env, validateEnvironment } from "./env"

// Validate environment on module load
validateEnvironment()

// Create a singleton Neon client with proper configuration
let neonClient: ReturnType<typeof neon> | null = null

export function getNeonClient() {
  if (!neonClient) {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    try {
      neonClient = neon(env.DATABASE_URL, {
        fullResults: true,
        arrayMode: false,
        // Connection pooling configuration
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      })
    } catch (error) {
      console.error("Failed to initialize Neon client:", error)
      throw new Error("Database connection initialization failed")
    }
  }

  return neonClient
}

// Helper function for database operations with comprehensive error handling
export async function executeQuery<T = any>(query: TemplateStringsArray, ...values: any[]): Promise<T[]> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const sql = getNeonClient()
      const result = await sql(query, ...values)
      return result as T[]
    } catch (error) {
      lastError = error as Error
      console.error(`Database query attempt ${attempt} failed:`, error)

      // Don't retry on certain errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()
        if (
          errorMessage.includes("syntax error") ||
          errorMessage.includes("permission denied") ||
          (errorMessage.includes("relation") && errorMessage.includes("does not exist"))
        ) {
          break
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  throw new Error(`Database operation failed after ${maxRetries} attempts: ${lastError?.message}`)
}

// Health check function with timeout
export async function checkNeonConnection(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
  const startTime = Date.now()

  try {
    const sql = getNeonClient()
    await Promise.race([
      sql`SELECT 1 as health_check`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000)),
    ])

    const latency = Date.now() - startTime
    return { healthy: true, latency }
  } catch (error) {
    console.error("Neon connection check failed:", error)
    return {
      healthy: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Connection pool status
export async function getConnectionInfo(): Promise<{
  databaseUrl: string
  environment: string
  isVercel: boolean
}> {
  return {
    databaseUrl: env.DATABASE_URL ? env.DATABASE_URL.replace(/:[^:@]*@/, ":***@") : "Not configured",
    environment: env.NODE_ENV,
    isVercel: !!env.VERCEL_URL,
  }
}
