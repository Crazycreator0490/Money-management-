"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-system"
import {
  createIncomeSource,
  deleteIncomeSource,
  createBudgetCategory,
  updateBudgetCategoryActual,
  deleteBudgetCategory,
  createBulkIncomeAndCategories,
} from "@/lib/data-operations"

export async function addIncomeSource(name: string, amount: number) {
  const user = await requireAuth()
  await createIncomeSource(user.id, name, amount)
  revalidatePath("/budget-planner")
}

export async function removeIncomeSource(id: number) {
  const user = await requireAuth()
  await deleteIncomeSource(user.id, id)
  revalidatePath("/budget-planner")
}

export async function addBudgetCategory(name: string, plannedAmount: number, color: string) {
  const user = await requireAuth()
  await createBudgetCategory(user.id, name, plannedAmount, color)
  revalidatePath("/budget-planner")
}

export async function updateCategoryActual(id: number, actualAmount: number) {
  const user = await requireAuth()
  await updateBudgetCategoryActual(user.id, id, actualAmount)
  revalidatePath("/budget-planner")
}

export async function removeBudgetCategory(id: number) {
  const user = await requireAuth()
  await deleteBudgetCategory(user.id, id)
  revalidatePath("/budget-planner")
}

export async function loadBudgetTemplate(
  incomes: Array<{ name: string; amount: number }>,
  categories: Array<{ name: string; amount: number; color: string }>,
) {
  const user = await requireAuth()
  await createBulkIncomeAndCategories(user.id, incomes, categories)
  revalidatePath("/budget-planner")
}
