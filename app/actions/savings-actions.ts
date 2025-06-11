"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth"
import { createSavingsGoal } from "@/lib/db"

export async function addSavingsGoal(goalName: string, targetAmount: number, monthlyContribution: number) {
  const user = await requireAuth()
  await createSavingsGoal(user.id, goalName, targetAmount, monthlyContribution)
  revalidatePath("/savings-calculator")
}
