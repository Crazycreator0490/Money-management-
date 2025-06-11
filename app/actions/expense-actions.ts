"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth"
import { createExpense } from "@/lib/db"

export async function addExpense(amount: number, description: string, category: string, expenseDate: string) {
  const user = await requireAuth()
  await createExpense(user.id, amount, description, category, expenseDate)
  revalidatePath("/expense-tracker")
}
