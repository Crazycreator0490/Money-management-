import { neon } from "@neondatabase/serverless"
import { ensureTablesExist } from "./db-init"

const sql = neon(process.env.DATABASE_URL!)

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

// Income Sources
export async function getIncomeSources(userId: number): Promise<IncomeSource[]> {
  await ensureTablesExist()
  const result = await sql`
    SELECT id, name, amount FROM income_sources 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as IncomeSource[]
}

export async function createIncomeSource(userId: number, name: string, amount: number): Promise<IncomeSource> {
  await ensureTablesExist()
  const result = await sql`
    INSERT INTO income_sources (user_id, name, amount)
    VALUES (${userId}, ${name}, ${amount})
    RETURNING id, name, amount
  `
  return result[0] as IncomeSource
}

export async function deleteIncomeSource(userId: number, id: number): Promise<void> {
  await ensureTablesExist()
  await sql`
    DELETE FROM income_sources 
    WHERE id = ${id} AND user_id = ${userId}
  `
}

// Budget Categories
export async function getBudgetCategories(userId: number): Promise<BudgetCategory[]> {
  await ensureTablesExist()
  const result = await sql`
    SELECT id, name, planned_amount, actual_amount, color 
    FROM budget_categories 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as BudgetCategory[]
}

export async function createBudgetCategory(
  userId: number,
  name: string,
  plannedAmount: number,
  color: string,
): Promise<BudgetCategory> {
  await ensureTablesExist()
  const result = await sql`
    INSERT INTO budget_categories (user_id, name, planned_amount, color)
    VALUES (${userId}, ${name}, ${plannedAmount}, ${color})
    RETURNING id, name, planned_amount, actual_amount, color
  `
  return result[0] as BudgetCategory
}

export async function updateBudgetCategoryActual(userId: number, id: number, actualAmount: number): Promise<void> {
  await ensureTablesExist()
  await sql`
    UPDATE budget_categories 
    SET actual_amount = ${actualAmount}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function deleteBudgetCategory(userId: number, id: number): Promise<void> {
  await ensureTablesExist()
  await sql`
    DELETE FROM budget_categories 
    WHERE id = ${id} AND user_id = ${userId}
  `
}

// Expenses
export async function getExpenses(userId: number, limit = 50): Promise<Expense[]> {
  await ensureTablesExist()
  const result = await sql`
    SELECT id, amount, description, category, expense_date, created_at
    FROM expenses 
    WHERE user_id = ${userId} 
    ORDER BY expense_date DESC, created_at DESC
    LIMIT ${limit}
  `
  return result as Expense[]
}

export async function createExpense(
  userId: number,
  amount: number,
  description: string,
  category: string,
  expenseDate: string,
): Promise<Expense> {
  await ensureTablesExist()
  const result = await sql`
    INSERT INTO expenses (user_id, amount, description, category, expense_date)
    VALUES (${userId}, ${amount}, ${description}, ${category}, ${expenseDate})
    RETURNING id, amount, description, category, expense_date, created_at
  `
  return result[0] as Expense
}

// Savings Goals
export async function getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
  await ensureTablesExist()
  const result = await sql`
    SELECT id, goal_name, target_amount, current_amount, monthly_contribution, target_date
    FROM savings_goals 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as SavingsGoal[]
}

export async function createSavingsGoal(
  userId: number,
  goalName: string,
  targetAmount: number,
  monthlyContribution: number,
): Promise<SavingsGoal> {
  await ensureTablesExist()
  const result = await sql`
    INSERT INTO savings_goals (user_id, goal_name, target_amount, monthly_contribution)
    VALUES (${userId}, ${goalName}, ${targetAmount}, ${monthlyContribution})
    RETURNING id, goal_name, target_amount, current_amount, monthly_contribution, target_date
  `
  return result[0] as SavingsGoal
}

// Bulk operations for templates
export async function createBulkIncomeAndCategories(
  userId: number,
  incomes: Array<{ name: string; amount: number }>,
  categories: Array<{ name: string; amount: number; color: string }>,
): Promise<void> {
  await ensureTablesExist()

  // Clear existing data
  await sql`DELETE FROM income_sources WHERE user_id = ${userId}`
  await sql`DELETE FROM budget_categories WHERE user_id = ${userId}`

  // Insert income sources
  for (const income of incomes) {
    await sql`
      INSERT INTO income_sources (user_id, name, amount)
      VALUES (${userId}, ${income.name}, ${income.amount})
    `
  }

  // Insert budget categories
  for (const category of categories) {
    await sql`
      INSERT INTO budget_categories (user_id, name, planned_amount, color)
      VALUES (${userId}, ${category.name}, ${category.amount}, ${category.color})
    `
  }
}
