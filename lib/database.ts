import { neon } from "@neondatabase/serverless"
import { envConfig, validateEnvironment, logEnvironmentStatus } from "./env-config"

// Global database client
let dbClient: ReturnType<typeof neon> | null = null
let isInitialized = false

// Initialize database client
function initializeDatabase(): ReturnType<typeof neon> {
  if (dbClient && isInitialized) {
    return dbClient
  }

  try {
    // Validate environment first
    const validation = validateEnvironment()
    if (!validation.valid) {
      throw new Error(`Environment validation failed: ${validation.errors.join(", ")}`)
    }

    logEnvironmentStatus()

    // Create database client
    dbClient = neon(envConfig.database.url, {
      fullResults: true,
      arrayMode: false,
    })

    isInitialized = true
    console.log("✅ Database client initialized successfully")
    return dbClient
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    throw error
  }
}

// Execute database query with error handling
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const sql = initializeDatabase()
      const result = await sql(query, params)

      if (envConfig.app.nodeEnv === "development") {
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

      // Don't retry on syntax errors
      if (lastError.message.toLowerCase().includes("syntax error")) {
        break
      }

      // Wait before retry
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Database operation failed after ${maxRetries} attempts: ${lastError?.message}`)
}

// Health check
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  latency?: number
  error?: string
  details?: any
}> {
  const startTime = Date.now()

  try {
    const result = await executeQuery("SELECT 1 as health_check, NOW() as server_time")
    const latency = Date.now() - startTime

    return {
      healthy: true,
      latency,
      details: {
        serverTime: result[0]?.server_time,
        databaseUrl: envConfig.database.url.replace(/:[^:@]*@/, ":***@"),
      },
    }
  } catch (error) {
    const latency = Date.now() - startTime
    return {
      healthy: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: { latency },
    }
  }
}

// Initialize database schema
export async function initializeSchema(): Promise<void> {
  console.log("🏗️ Initializing database schema...")

  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Sessions table
    `CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Income sources table
    `CREATE TABLE IF NOT EXISTS income_sources (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Budget categories table
    `CREATE TABLE IF NOT EXISTS budget_categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      planned_amount DECIMAL(10,2) NOT NULL,
      actual_amount DECIMAL(10,2) DEFAULT 0,
      color VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Expenses table
    `CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      description VARCHAR(500) NOT NULL,
      category VARCHAR(100) NOT NULL,
      expense_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Savings goals table
    `CREATE TABLE IF NOT EXISTS savings_goals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      goal_name VARCHAR(255) NOT NULL,
      target_amount DECIMAL(10,2) NOT NULL,
      current_amount DECIMAL(10,2) DEFAULT 0,
      monthly_contribution DECIMAL(10,2) NOT NULL,
      target_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ]

  // Create tables
  for (const tableSQL of tables) {
    await executeQuery(tableSQL)
  }

  // Create indexes
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)",
    "CREATE INDEX IF NOT EXISTS idx_income_sources_user_id ON income_sources(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date)",
    "CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id)",
  ]

  for (const indexSQL of indexes) {
    await executeQuery(indexSQL)
  }

  console.log("✅ Database schema initialized successfully")
}
