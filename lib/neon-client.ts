import { neon } from "@neondatabase/serverless"
import { env, validateEnvironment, logEnvironmentStatus } from "./env"

// Global client instance
let globalNeonClient: ReturnType<typeof neon> | null = null
let clientInitialized = false
let initializationError: Error | null = null

// Initialize client with comprehensive error handling
function initializeNeonClient(): ReturnType<typeof neon> {
  if (globalNeonClient && clientInitialized) {
    return globalNeonClient
  }

  if (initializationError) {
    throw initializationError
  }

  try {
    // Validate environment first
    const validation = validateEnvironment()
    if (!validation.valid) {
      throw new Error(`Environment validation failed: ${validation.errors.join(", ")}`)
    }

    logEnvironmentStatus()

    // Create Neon client with optimal settings
    globalNeonClient = neon(env.DATABASE_URL, {
      fullResults: true,
      arrayMode: false,
    })

    clientInitialized = true
    console.log("✅ Neon client initialized successfully")
    return globalNeonClient
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error("Unknown initialization error")
    console.error("❌ Neon client initialization failed:", initializationError.message)
    throw initializationError
  }
}

// Get client with lazy initialization
export function getNeonClient(): ReturnType<typeof neon> {
  return initializeNeonClient()
}

// Execute query with comprehensive error handling and retries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const sql = getNeonClient()
      const result = await sql(query, params)

      // Log successful query in development
      if (env.NODE_ENV === "development") {
        console.log(`✅ Query executed successfully (attempt ${attempt})`)
      }

      return result as T[]
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Query attempt ${attempt} failed:`, {
        error: lastError.message,
        query: query.substring(0, 100) + "...",
        attempt,
      })

      // Don't retry on certain errors
      if (
        lastError.message.toLowerCase().includes("syntax error") ||
        lastError.message.toLowerCase().includes("permission denied") ||
        (lastError.message.toLowerCase().includes("relation") &&
          lastError.message.toLowerCase().includes("does not exist"))
      ) {
        console.error("❌ Non-retryable error detected, stopping retries")
        break
      }

      // Wait before retry with exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  const errorMessage = `Database operation failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`
  console.error("❌ Final error:", errorMessage)
  throw new Error(errorMessage)
}

// Health check with timeout and detailed diagnostics
export async function checkNeonConnection(): Promise<{
  healthy: boolean
  latency?: number
  error?: string
  details?: any
}> {
  const startTime = Date.now()

  try {
    console.log("🔍 Starting Neon connection health check...")

    // Test basic connectivity
    const result = await Promise.race([
      executeQuery("SELECT 1 as health_check, NOW() as server_time"),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000),
      ),
    ])

    const latency = Date.now() - startTime

    console.log("✅ Health check passed:", {
      latency: `${latency}ms`,
      serverTime: result[0]?.server_time,
    })

    return {
      healthy: true,
      latency,
      details: {
        serverTime: result[0]?.server_time,
        clientInitialized,
      },
    }
  } catch (error) {
    const latency = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    console.error("❌ Health check failed:", {
      error: errorMessage,
      latency: `${latency}ms`,
      clientInitialized,
    })

    return {
      healthy: false,
      error: errorMessage,
      details: {
        latency,
        clientInitialized,
        initializationError: initializationError?.message,
      },
    }
  }
}

// Get connection information for debugging
export async function getConnectionInfo(): Promise<{
  databaseUrl: string
  environment: string
  isVercel: boolean
  clientStatus: string
}> {
  return {
    databaseUrl: env.DATABASE_URL ? env.DATABASE_URL.replace(/:[^:@]*@/, ":***@") : "Not configured",
    environment: env.NODE_ENV,
    isVercel: !!env.VERCEL_URL,
    clientStatus: clientInitialized ? "initialized" : "not-initialized",
  }
}

// Reset client (useful for testing)
export function resetNeonClient(): void {
  globalNeonClient = null
  clientInitialized = false
  initializationError = null
  console.log("🔄 Neon client reset")
}
