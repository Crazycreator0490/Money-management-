"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-system"
import { createSavingsGoal } from "@/lib/data-operations"

export async function addSavingsGoal(goalName: string, targetAmount: number, monthlyContribution: number) {
  const user = await requireAuth()
  await createSavingsGoal(user.id, goalName, targetAmount, monthlyContribution)
  revalidatePath("/savings-calculator")
}
