import { executeQuery } from "./neon-client"
import { ensureTablesExist } from "./db-init"

export type IncomeSource = {
  id: number
  name: string
  amount: number
}

export type BudgetCategory = {
  id: number
  name: string
  planned_amount: number
  actual_amount: number
  color: string
}

export type Expense = {
  id: number
  amount: number
  description: string
  category: string
  expense_date: string
  created_at: string
}

export type SavingsGoal = {
  id: number
  goal_name: string
  target_amount: number
  current_amount: number
  monthly_contribution: number
  target_date: string | null
}

// Helper function to ensure database is ready
async function ensureDbReady(): Promise<void> {
  try {
    await ensureTablesExist()
  } catch (error) {
    console.error("❌ Database not ready:", error)
    throw new Error("Database initialization failed. Please try again.")
  }
}

// Income Sources
export async function getIncomeSources(userId: number): Promise<IncomeSource[]> {
  await ensureDbReady()

  try {
    const result = await executeQuery<IncomeSource>(
      "SELECT id, name, amount FROM income_sources WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    )
    return result
  } catch (error) {
    console.error("❌ Error fetching income sources:", error)
    throw new Error("Failed to fetch income sources")
  }
}

export async function createIncomeSource(userId: number, name: string, amount: number): Promise<IncomeSource> {
  await ensureDbReady()

  try {
    const result = await executeQuery<IncomeSource>(
      "INSERT INTO income_sources (user_id, name, amount) VALUES ($1, $2, $3) RETURNING id, name, amount",
      [userId, name, amount],
    )
    return result[0]
  } catch (error) {
    console.error("❌ Error creating income source:", error)
    throw new Error("Failed to create income source")
  }
}

export async function deleteIncomeSource(userId: number, id: number): Promise<void> {
  await ensureDbReady()

  try {
    await executeQuery("DELETE FROM income_sources WHERE id = $1 AND user_id = $2", [id, userId])
  } catch (error) {
    console.error("❌ Error deleting income source:", error)
    throw new Error("Failed to delete income source")
  }
}

// Budget Categories
export async function getBudgetCategories(userId: number): Promise<BudgetCategory[]> {
  await ensureDbReady()

  try {
    const result = await executeQuery<BudgetCategory>(
      "SELECT id, name, planned_amount, actual_amount, color FROM budget_categories WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    )
    return result
  } catch (error) {
    console.error("❌ Error fetching budget categories:", error)
    throw new Error("Failed to fetch budget categories")
  }
}

export async function createBudgetCategory(
  userId: number,
  name: string,
  plannedAmount: number,
  color: string,
): Promise<BudgetCategory> {
  await ensureDbReady()

  try {
    const result = await executeQuery<BudgetCategory>(
      "INSERT INTO budget_categories (user_id, name, planned_amount, color) VALUES ($1, $2, $3, $4) RETURNING id, name, planned_amount, actual_amount, color",
      [userId, name, plannedAmount, color],
    )
    return result[0]
  } catch (error) {
    console.error("❌ Error creating budget category:", error)
    throw new Error("Failed to create budget category")
  }
}

export async function updateBudgetCategoryActual(userId: number, id: number, actualAmount: number): Promise<void> {
  await ensureDbReady()

  try {
    await executeQuery(
      "UPDATE budget_categories SET actual_amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3",
      [actualAmount, id, userId],
    )
  } catch (error) {
    console.error("❌ Error updating budget category:", error)
    throw new Error("Failed to update budget category")
  }
}

export async function deleteBudgetCategory(userId: number, id: number): Promise<void> {
  await ensureDbReady()

  try {
    await executeQuery("DELETE FROM budget_categories WHERE id = $1 AND user_id = $2", [id, userId])
  } catch (error) {
    console.error("❌ Error deleting budget category:", error)
    throw new Error("Failed to delete budget category")
  }
}

// Expenses
export async function getExpenses(userId: number, limit = 50): Promise<Expense[]> {
  await ensureDbReady()

  try {
    const result = await executeQuery<Expense>(
      "SELECT id, amount, description, category, expense_date, created_at FROM expenses WHERE user_id = $1 ORDER BY expense_date DESC, created_at DESC LIMIT $2",
      [userId, limit],
    )
    return result
  } catch (error) {
    console.error("❌ Error fetching expenses:", error)
    throw new Error("Failed to fetch expenses")
  }
}

export async function createExpense(
  userId: number,
  amount: number,
  description: string,
  category: string,
  expenseDate: string,
): Promise<Expense> {
  await ensureDbReady()

  try {
    const result = await executeQuery<Expense>(
      "INSERT INTO expenses (user_id, amount, description, category, expense_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, description, category, expense_date, created_at",
      [userId, amount, description, category, expenseDate],
    )
    return result[0]
  } catch (error) {
    console.error("❌ Error creating expense:", error)
    throw new Error("Failed to create expense")
  }
}

// Savings Goals
export async function getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
  await ensureDbReady()

  try {
    const result = await executeQuery<SavingsGoal>(
      "SELECT id, goal_name, target_amount, current_amount, monthly_contribution, target_date FROM savings_goals WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    )
    return result
  } catch (error) {
    console.error("❌ Error fetching savings goals:", error)
    throw new Error("Failed to fetch savings goals")
  }
}

export async function createSavingsGoal(
  userId: number,
  goalName: string,
  targetAmount: number,
  monthlyContribution: number,
): Promise<SavingsGoal> {
  await ensureDbReady()

  try {
    const result = await executeQuery<SavingsGoal>(
      "INSERT INTO savings_goals (user_id, goal_name, target_amount, monthly_contribution) VALUES ($1, $2, $3, $4) RETURNING id, goal_name, target_amount, current_amount, monthly_contribution, target_date",
      [userId, goalName, targetAmount, monthlyContribution],
    )
    return result[0]
  } catch (error) {
    console.error("❌ Error creating savings goal:", error)
    throw new Error("Failed to create savings goal")
  }
}

// Bulk operations for templates
export async function createBulkIncomeAndCategories(
  userId: number,
  incomes: Array<{ name: string; amount: number }>,
  categories: Array<{ name: string; amount: number; color: string }>,
): Promise<void> {
  await ensureDbReady()

  try {
    // Clear existing data
    await executeQuery("DELETE FROM income_sources WHERE user_id = $1", [userId])
    await executeQuery("DELETE FROM budget_categories WHERE user_id = $1", [userId])

    // Insert income sources
    for (const income of incomes) {
      await executeQuery("INSERT INTO income_sources (user_id, name, amount) VALUES ($1, $2, $3)", [
        userId,
        income.name,
        income.amount,
      ])
    }

    // Insert budget categories
    for (const category of categories) {
      await executeQuery(
        "INSERT INTO budget_categories (user_id, name, planned_amount, color) VALUES ($1, $2, $3, $4)",
        [userId, category.name, category.amount, category.color],
      )
    }
  } catch (error) {
    console.error("❌ Error creating bulk data:", error)
    throw new Error("Failed to load template data")
  }
}
