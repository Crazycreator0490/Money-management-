export interface Expense {
  id: number
  amount: number
  description: string
  category: string
  expense_date: string
  created_at: string
}

export interface SavingsGoal {
  id: number
  goal_name: string
  target_amount: number
  current_amount: number
  monthly_contribution: number
  target_date: string | null
}

export interface IncomeSource {
  id: number
  name: string
  amount: number
}

export interface BudgetCategory {
  id: number
  name: string
  planned_amount: number
  actual_amount: number
  color: string
}

export interface BudgetTemplate {
  name: string
  description: string
  income: Array<{
    name: string
    amount: number
  }>
  categories: Array<{
    name: string
    amount: number
    percentage: number
  }>
}
