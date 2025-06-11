"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, Target, PiggyBank } from "lucide-react"
import type { SavingsGoal } from "@/lib/types"

export default function SavingsCalculatorClient() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [calculator, setCalculator] = useState({
    goalAmount: "",
    monthlySavings: "",
    currentSavings: "",
    estimatedTime: null as number | null,
  })
  const [newGoal, setNewGoal] = useState({
    goal_name: "",
    target_amount: "",
    monthly_contribution: "",
    current_amount: "",
  })

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    const goal = Number.parseFloat(calculator.goalAmount)
    const monthly = Number.parseFloat(calculator.monthlySavings)
    const current = Number.parseFloat(calculator.currentSavings) || 0

    if (goal > 0 && monthly > 0) {
      const remaining = Math.max(0, goal - current)
      const months = Math.ceil(remaining / monthly)
      setCalculator({ ...calculator, estimatedTime: months })
    }
  }

  const handleSaveGoal = () => {
    if (!newGoal.goal_name || !newGoal.target_amount || !newGoal.monthly_contribution) return

    const goal: SavingsGoal = {
      id: Date.now(),
      goal_name: newGoal.goal_name,
      target_amount: Number.parseFloat(newGoal.target_amount),
      current_amount: Number.parseFloat(newGoal.current_amount) || 0,
      monthly_contribution: Number.parseFloat(newGoal.monthly_contribution),
      target_date: null,
    }

    setSavingsGoals([...savingsGoals, goal])

    setNewGoal({
      goal_name: "",
      target_amount: "",
      monthly_contribution: "",
      current_amount: "",
    })
  }

  const updateGoalProgress = (id: number, newAmount: number) => {
    setSavingsGoals(savingsGoals.map((goal) => (goal.id === id ? { ...goal, current_amount: newAmount } : goal)))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Savings Calculator</h1>
        <p className="text-gray-600">
          Calculate how long it will take to reach your savings goals and track your progress.
        </p>
      </div>

      {/* Savings Calculator */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calculator className="text-blue-600" size={24} />
          Savings Time Calculator
        </h2>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Goal Amount ($)
              </label>
              <input
                id="goalAmount"
                type="number"
                min="1"
                step="0.01"
                value={calculator.goalAmount}
                onChange={(e) => setCalculator({ ...calculator, goalAmount: e.target.value })}
                className="input"
                placeholder="10000"
                required
              />
            </div>

            <div>
              <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 mb-1">
                Current Savings ($)
              </label>
              <input
                id="currentSavings"
                type="number"
                min="0"
                step="0.01"
                value={calculator.currentSavings}
                onChange={(e) => setCalculator({ ...calculator, currentSavings: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="monthlySavings" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Savings ($)
              </label>
              <input
                id="monthlySavings"
                type="number"
                min="1"
                step="0.01"
                value={calculator.monthlySavings}
                onChange={(e) => setCalculator({ ...calculator, monthlySavings: e.target.value })}
                className="input"
                placeholder="500"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Calculator size={16} />
            Calculate Time
          </button>
        </form>

        {calculator.estimatedTime !== null && (
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800">Estimated Time:</h3>
            <div className="mt-2 text-center">
              <p className="text-3xl font-bold text-blue-700">{calculator.estimatedTime} months</p>
              <p className="text-sm text-blue-600 mt-1">
                ({Math.floor(calculator.estimatedTime / 12)} years and {calculator.estimatedTime % 12} months)
              </p>
            </div>
            <div className="mt-4 text-sm text-blue-700">
              <p>
                💡 <strong>Tip:</strong> Consider increasing your monthly savings to reach your goal faster!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Savings Goal */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="text-green-600" size={24} />
          Create Savings Goal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              placeholder="Emergency Fund"
              value={newGoal.goal_name}
              onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="10000"
              value={newGoal.target_amount}
              onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="0"
              value={newGoal.current_amount}
              onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
            <input
              type="number"
              step="0.01"
              placeholder="500"
              value={newGoal.monthly_contribution}
              onChange={(e) => setNewGoal({ ...newGoal, monthly_contribution: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button onClick={handleSaveGoal} className="btn btn-primary w-full flex items-center justify-center gap-2">
              <Target size={16} />
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      {savingsGoals.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PiggyBank className="text-purple-600" size={24} />
            Your Savings Goals
          </h2>

          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100
              const remaining = goal.target_amount - goal.current_amount
              const monthsToGoal = Math.ceil(remaining / goal.monthly_contribution)

              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{goal.goal_name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="font-semibold">{progress.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>${goal.current_amount.toFixed(2)}</span>
                      <span>${goal.target_amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Update Current Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={goal.current_amount}
                        onChange={(e) => updateGoalProgress(goal.id, Number.parseFloat(e.target.value) || 0)}
                        className="input"
                      />
                    </div>

                    <div className="flex items-center">
                      <div>
                        <div className="text-sm text-gray-600">Remaining</div>
                        <div className="font-semibold text-red-600">${remaining.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div>
                        <div className="text-sm text-gray-600">Time to Goal</div>
                        <div className="font-semibold text-blue-600">
                          {remaining <= 0 ? "Goal Reached! 🎉" : `${monthsToGoal} months`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {remaining <= 0 && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded text-green-700">
                      🎉 Congratulations! You've reached your savings goal!
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {savingsGoals.length === 0 && (
        <div className="card text-center py-12">
          <PiggyBank className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No savings goals yet</h3>
          <p className="text-gray-500">Create your first savings goal to start tracking your progress.</p>
        </div>
      )}
    </div>
  )
}
