"use client"
import { requireAuth } from "@/lib/auth"
import { getExpenses } from "@/lib/db"
import ExpenseTrackerClient from "@/components/expense-tracker-client"

type Expense = {
  id: number
  amount: number
  description: string
  category: string
  date: string
}

export default async function ExpenseTracker() {
  const user = await requireAuth()
  const expenses = await getExpenses(user.id)

  return <ExpenseTrackerClient initialExpenses={expenses} />
}
