import { executeQuery, checkNeonConnection } from "./neon-client"

// Track initialization state
let tablesInitialized = false
let initializationPromise: Promise<void> | null = null

// Database schema definitions
const SCHEMA_DEFINITIONS = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  sessions: `
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  income_sources: `
    CREATE TABLE IF NOT EXISTS income_sources (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  budget_categories: `
    CREATE TABLE IF NOT EXISTS budget_categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      planned_amount DECIMAL(10,2) NOT NULL,
      actual_amount DECIMAL(10,2) DEFAULT 0,
      color VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  expenses: `
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      description VARCHAR(500) NOT NULL,
      category VARCHAR(100) NOT NULL,
      expense_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  savings_goals: `
    CREATE TABLE IF NOT EXISTS savings_goals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      goal_name VARCHAR(255) NOT NULL,
      target_amount DECIMAL(10,2) NOT NULL,
      current_amount DECIMAL(10,2) DEFAULT 0,
      monthly_contribution DECIMAL(10,2) NOT NULL,
      target_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  user_progress: `
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      milestone_name VARCHAR(255) NOT NULL,
      milestone_description TEXT,
      progress_percentage INTEGER DEFAULT 0,
      is_current BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
}

const INDEX_DEFINITIONS = [
  "CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)",
  "CREATE INDEX IF NOT EXISTS idx_income_sources_user_id ON income_sources(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date)",
  "CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)",
]

// Check if tables exist
async function checkTablesExist(): Promise<boolean> {
  try {
    const result = await executeQuery<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as exists`,
      [],
    )
    return result[0]?.exists || false
  } catch (error) {
    console.error("❌ Error checking if tables exist:", error)
    return false
  }
}

// Create all tables and indexes
async function createDatabaseSchema(): Promise<void> {
  console.log("🏗️ Creating database schema...")

  try {
    // Create tables in dependency order
    const tableOrder = [
      "users",
      "sessions",
      "income_sources",
      "budget_categories",
      "expenses",
      "savings_goals",
      "user_progress",
    ]

    for (const tableName of tableOrder) {
      console.log(`📋 Creating table: ${tableName}`)
      await executeQuery(SCHEMA_DEFINITIONS[tableName as keyof typeof SCHEMA_DEFINITIONS], [])
    }

    // Create indexes
    console.log("📊 Creating indexes...")
    for (const indexSQL of INDEX_DEFINITIONS) {
      await executeQuery(indexSQL, [])
    }

    console.log("✅ Database schema created successfully")
  } catch (error) {
    console.error("❌ Error creating database schema:", error)
    throw error
  }
}

// Main initialization function with singleton pattern
export async function ensureTablesExist(): Promise<void> {
  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise
  }

  // Return immediately if already initialized
  if (tablesInitialized) {
    return Promise.resolve()
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log("🔍 Checking database connection...")

      // First, verify we can connect to the database
      const healthCheck = await checkNeonConnection()
      if (!healthCheck.healthy) {
        throw new Error(`Database connection failed: ${healthCheck.error}`)
      }

      console.log("✅ Database connection verified")

      // Check if tables already exist
      const tablesExist = await checkTablesExist()

      if (!tablesExist) {
        console.log("📋 Tables do not exist, creating schema...")
        await createDatabaseSchema()
      } else {
        console.log("✅ Database tables already exist")
      }

      tablesInitialized = true
      console.log("🎉 Database initialization completed successfully")
    } catch (error) {
      console.error("❌ Database initialization failed:", error)
      // Reset state on failure
      tablesInitialized = false
      initializationPromise = null
      throw error
    }
  })()

  return initializationPromise
}

// Migration system for schema updates
export async function runMigrations(): Promise<void> {
  try {
    console.log("🔄 Running database migrations...")

    // Ensure basic tables exist first
    await ensureTablesExist()

    // Create migrations table
    await executeQuery(
      `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
      [],
    )

    // Define migrations
    const migrations = [
      {
        name: "001_initial_schema",
        description: "Create initial database schema",
        sql: async () => {
          // This is handled by ensureTablesExist()
          console.log("✅ Initial schema migration completed")
        },
      },
      {
        name: "002_add_indexes",
        description: "Add performance indexes",
        sql: async () => {
          // Indexes are created in ensureTablesExist()
          console.log("✅ Indexes migration completed")
        },
      },
    ]

    // Run migrations
    for (const migration of migrations) {
      const existing = await executeQuery<{ name: string }>("SELECT name FROM migrations WHERE name = $1", [
        migration.name,
      ])

      if (existing.length === 0) {
        console.log(`🔄 Running migration: ${migration.name}`)
        await migration.sql()
        await executeQuery("INSERT INTO migrations (name) VALUES ($1)", [migration.name])
        console.log(`✅ Migration completed: ${migration.name}`)
      } else {
        console.log(`⏭️ Migration already applied: ${migration.name}`)
      }
    }

    console.log("🎉 All migrations completed successfully")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

// Reset initialization state (useful for testing)
export function resetInitializationState(): void {
  tablesInitialized = false
  initializationPromise = null
  console.log("🔄 Database initialization state reset")
}

// Get initialization status
export function getInitializationStatus(): {
  initialized: boolean
  inProgress: boolean
} {
  return {
    initialized: tablesInitialized,
    inProgress: !!initializationPromise && !tablesInitialized,
  }
}
