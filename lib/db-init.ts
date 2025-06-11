import { executeQuery, checkNeonConnection } from "./neon-client"

export async function ensureTablesExist(): Promise<void> {
  try {
    // First check if we can connect to the database
    const healthCheck = await checkNeonConnection()
    if (!healthCheck.healthy) {
      throw new Error(`Database connection failed: ${healthCheck.error}`)
    }

    // Check if users table exists
    const result = await executeQuery<{ exists: boolean }>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `

    const tablesExist = result[0]?.exists

    if (!tablesExist) {
      console.log("Creating database tables...")
      await createAllTables()
      console.log("Database tables created successfully!")
    } else {
      console.log("Database tables already exist")
    }
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
    throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function createAllTables(): Promise<void> {
  // Create users table
  await executeQuery`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create sessions table
  await executeQuery`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create income sources table
  await executeQuery`
    CREATE TABLE IF NOT EXISTS income_sources (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create budget categories table
  await executeQuery`
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
  `

  // Create expenses table
  await executeQuery`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      description VARCHAR(500) NOT NULL,
      category VARCHAR(100) NOT NULL,
      expense_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create savings goals table
  await executeQuery`
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
  `

  // Create user progress table
  await executeQuery`
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
  `

  // Create indexes
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_income_sources_user_id ON income_sources(user_id)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id)`
  await executeQuery`CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)`
}

// Database migration system
export async function runMigrations(): Promise<void> {
  try {
    // Create migrations table if it doesn't exist
    await executeQuery`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // List of migrations to run
    const migrations = [
      {
        name: "001_initial_tables",
        sql: () => ensureTablesExist(),
      },
      {
        name: "002_add_indexes",
        sql: async () => {
          // Additional indexes can be added here
          console.log("Indexes migration completed")
        },
      },
    ]

    for (const migration of migrations) {
      const existing = await executeQuery<{ name: string }>`
        SELECT name FROM migrations WHERE name = ${migration.name}
      `

      if (existing.length === 0) {
        console.log(`Running migration: ${migration.name}`)
        await migration.sql()
        await executeQuery`
          INSERT INTO migrations (name) VALUES (${migration.name})
        `
        console.log(`Migration completed: ${migration.name}`)
      }
    }
  } catch (error) {
    console.error("Migration failed:", error)
    throw error
  }
}
