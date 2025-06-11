import { requireAuth } from "@/lib/auth-system"
import { getIncomeSources, getBudgetCategories } from "@/lib/data-operations"
import BudgetPlannerClient from "@/components/budget-planner-client"

export default async function BudgetPlanner() {
  const user = await requireAuth()
  const [incomeSources, budgetCategories] = await Promise.all([getIncomeSources(user.id), getBudgetCategories(user.id)])

  return <BudgetPlannerClient initialIncomeSources={incomeSources} initialBudgetCategories={budgetCategories} />
}
