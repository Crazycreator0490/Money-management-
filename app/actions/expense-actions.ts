"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-system"
import { createExpense } from "@/lib/data-operations"

export async function addExpense(amount: number, description: string, category: string, expenseDate: string) {
  const user = await requireAuth()
  await createExpense(user.id, amount, description, category, expenseDate)
  revalidatePath("/expense-tracker")
}
