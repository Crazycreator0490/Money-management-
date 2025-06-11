import { executeQuery, initializeSchema } from "./database"

// Type definitions
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

// Income Sources Operations
export async function getIncomeSources(userId: number): Promise<IncomeSource[]> {
  await initializeSchema()
  return await executeQuery<IncomeSource>(
    "SELECT id, name, amount FROM income_sources WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  )
}

export async function createIncomeSource(userId: number, name: string, amount: number): Promise<IncomeSource> {
  await initializeSchema()
  const result = await executeQuery<IncomeSource>(
    "INSERT INTO income_sources (user_id, name, amount) VALUES ($1, $2, $3) RETURNING id, name, amount",
    [userId, name, amount],
  )
  return result[0]
}

export async function deleteIncomeSource(userId: number, id: number): Promise<void> {
  await executeQuery("DELETE FROM income_sources WHERE id = $1 AND user_id = $2", [id, userId])
}

// Budget Categories Operations
export async function getBudgetCategories(userId: number): Promise<BudgetCategory[]> {
  await initializeSchema()
  return await executeQuery<BudgetCategory>(
    "SELECT id, name, planned_amount, actual_amount, color FROM budget_categories WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  )
}

export async function createBudgetCategory(
  userId: number,
  name: string,
  plannedAmount: number,
  color: string,
): Promise<BudgetCategory> {
  await initializeSchema()
  const result = await executeQuery<BudgetCategory>(
    "INSERT INTO budget_categories (user_id, name, planned_amount, color) VALUES ($1, $2, $3, $4) RETURNING id, name, planned_amount, actual_amount, color",
    [userId, name, plannedAmount, color],
  )
  return result[0]
}

export async function updateBudgetCategoryActual(userId: number, id: number, actualAmount: number): Promise<void> {
  await executeQuery("UPDATE budget_categories SET actual_amount = $1 WHERE id = $2 AND user_id = $3", [
    actualAmount,
    id,
    userId,
  ])
}

export async function deleteBudgetCategory(userId: number, id: number): Promise<void> {
  await executeQuery("DELETE FROM budget_categories WHERE id = $1 AND user_id = $2", [id, userId])
}

// Expenses Operations
export async function getExpenses(userId: number, limit = 50): Promise<Expense[]> {
  await initializeSchema()
  return await executeQuery<Expense>(
    "SELECT id, amount, description, category, expense_date, created_at FROM expenses WHERE user_id = $1 ORDER BY expense_date DESC, created_at DESC LIMIT $2",
    [userId, limit],
  )
}

export async function createExpense(
  userId: number,
  amount: number,
  description: string,
  category: string,
  expenseDate: string,
): Promise<Expense> {
  await initializeSchema()
  const result = await executeQuery<Expense>(
    "INSERT INTO expenses (user_id, amount, description, category, expense_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, description, category, expense_date, created_at",
    [userId, amount, description, category, expenseDate],
  )
  return result[0]
}

// Savings Goals Operations
export async function getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
  await initializeSchema()
  return await executeQuery<SavingsGoal>(
    "SELECT id, goal_name, target_amount, current_amount, monthly_contribution, target_date FROM savings_goals WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  )
}

export async function createSavingsGoal(
  userId: number,
  goalName: string,
  targetAmount: number,
  monthlyContribution: number,
): Promise<SavingsGoal> {
  await initializeSchema()
  const result = await executeQuery<SavingsGoal>(
    "INSERT INTO savings_goals (user_id, goal_name, target_amount, monthly_contribution) VALUES ($1, $2, $3, $4) RETURNING id, goal_name, target_amount, current_amount, monthly_contribution, target_date",
    [userId, goalName, targetAmount, monthlyContribution],
  )
  return result[0]
}

// Bulk operations for templates
export async function createBulkIncomeAndCategories(
  userId: number,
  incomes: Array<{ name: string; amount: number }>,
  categories: Array<{ name: string; amount: number; color: string }>,
): Promise<void> {
  await initializeSchema()

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
    await executeQuery("INSERT INTO budget_categories (user_id, name, planned_amount, color) VALUES ($1, $2, $3, $4)", [
      userId,
      category.name,
      category.amount,
      category.color,
    ])
  }
}
