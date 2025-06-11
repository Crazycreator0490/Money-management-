import { requireAuth } from "@/lib/auth"
import { getExpenses } from "@/lib/db"
import ExpenseTrackerClient from "@/components/expense-tracker-client"

export default async function ExpenseTracker() {
  const user = await requireAuth()
  const expenses = await getExpenses(user.id)

  return <ExpenseTrackerClient initialExpenses={expenses} />
}
