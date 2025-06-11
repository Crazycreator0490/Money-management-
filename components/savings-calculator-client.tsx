"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Calculator, Target } from "lucide-react"
import { addSavingsGoal } from "@/app/actions/savings-actions"
import type { SavingsGoal } from "@/lib/db"

type SavingsCalculatorClientProps = {
  initialSavingsGoals: SavingsGoal[]
}

export default function SavingsCalculatorClient({ initialSavingsGoals }: SavingsCalculatorClientProps) {
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals)
  const [goalAmount, setGoalAmount] = useState("")
  const [monthlySavings, setMonthlySavings] = useState("")
  const [goalName, setGoalName] = useState("")
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    const goal = Number.parseFloat(goalAmount)
    const monthly = Number.parseFloat(monthlySavings)

    if (goal > 0 && monthly > 0) {
      const months = Math.ceil(goal / monthly)
      setEstimatedTime(months)
    }
  }

  const handleSaveGoal = async () => {
    if (!goalName || !goalAmount || !monthlySavings) return

    const newGoal: SavingsGoal = {
      id: Date.now(),
      goal_name: goalName,
      target_amount: Number.parseFloat(goalAmount),
      current_amount: 0,
      monthly_contribution: Number.parseFloat(monthlySavings),
      target_date: null,
    }

    setSavingsGoals([newGoal, ...savingsGoals])

    startTransition(async () => {
      await addSavingsGoal(goalName, Number.parseFloat(goalAmount), Number.parseFloat(monthlySavings))
    })

    setGoalName("")
    setGoalAmount("")
    setMonthlySavings("")
    setEstimatedTime(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Savings Goal Calculator</h1>
        <p className="text-gray-600">
          Calculate how long it will take to reach your savings goals and track your progress.
        </p>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Saving goal...</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Calculate Savings Timeline</h2>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name (Optional)
            </label>
            <input
              id="goalName"
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="input"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Goal Amount (AED)
              </label>
              <input
                id="goalAmount"
                type="number"
                min="1"
                step="1"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="input"
                placeholder="10000"
                required
              />
            </div>

            <div>
              <label htmlFor="monthlySavings" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Savings (AED)
              </label>
              <input
                id="monthlySavings"
                type="number"
                min="1"
                step="1"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
                className="input"
                placeholder="500"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Calculator size={18} />
            <span>Calculate Time</span>
          </button>
        </form>

        {estimatedTime !== null && (
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800">Estimated Time:</h3>
            <div className="mt-2 text-center">
              <p className="text-3xl font-bold text-blue-700">{estimatedTime} months</p>
              <p className="text-sm text-blue-600 mt-1">
                ({Math.floor(estimatedTime / 12)} years and {estimatedTime % 12} months)
              </p>
            </div>

            {goalName && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSaveGoal}
                  className="btn btn-primary flex items-center gap-2 mx-auto"
                  disabled={isPending}
                >
                  <Target size={18} />
                  <span>Save This Goal</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Saved Goals */}
      {savingsGoals.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target size={20} />
            Your Savings Goals
          </h2>

          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const progressPercentage = (goal.current_amount / goal.target_amount) * 100
              const remainingAmount = goal.target_amount - goal.current_amount
              const monthsRemaining = Math.ceil(remainingAmount / goal.monthly_contribution)

              return (
                <div
                  key={goal.id}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-green-800">{goal.goal_name}</h3>
                      <p className="text-sm text-green-600">
                        Monthly contribution: {goal.monthly_contribution.toFixed(2)} AED
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-800">
                        {goal.current_amount.toFixed(2)} / {goal.target_amount.toFixed(2)} AED
                      </p>
                      <p className="text-sm text-green-600">{progressPercentage.toFixed(1)}% complete</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="h-3 bg-green-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-green-700">
                    <span>Remaining: {remainingAmount.toFixed(2)} AED</span>
                    <span>{monthsRemaining > 0 ? `${monthsRemaining} months to go` : "Goal achieved! 🎉"}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Savings Tips */}
      <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">💡 Savings Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Start with small, achievable goals to build momentum</li>
          <li>• Automate your savings to make it effortless</li>
          <li>• Review and adjust your goals regularly</li>
          <li>• Consider high-yield savings accounts for better returns</li>
          <li>• Track your progress to stay motivated</li>
        </ul>
      </div>
    </div>
  )
}
