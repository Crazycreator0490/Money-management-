"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { PlusCircle, Trash2, PieChart, DollarSign } from "lucide-react"
import BudgetChart from "@/components/budget-chart"
import BudgetTemplates from "@/components/budget-templates"
import BudgetComparison from "@/components/budget-comparison"
import type { IncomeSource, BudgetCategory } from "@/lib/db"
import {
  addIncomeSource,
  removeIncomeSource,
  addBudgetCategory,
  updateCategoryActual,
  removeBudgetCategory,
  loadBudgetTemplate,
} from "@/app/actions/budget-actions"

type BudgetPlannerClientProps = {
  initialIncomeSources: IncomeSource[]
  initialBudgetCategories: BudgetCategory[]
}

export default function BudgetPlannerClient({
  initialIncomeSources,
  initialBudgetCategories,
}: BudgetPlannerClientProps) {
  const [incomeSources, setIncomeSources] = useState(initialIncomeSources)
  const [budgetCategories, setBudgetCategories] = useState(initialBudgetCategories)
  const [newIncomeName, setNewIncomeName] = useState("")
  const [newIncomeAmount, setNewIncomeAmount] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryAmount, setNewCategoryAmount] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Colors for budget categories
  const categoryColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-orange-500",
  ]

  // Calculate totals
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0)
  const totalBudgeted = budgetCategories.reduce((sum, category) => sum + category.planned_amount, 0)
  const totalSpent = budgetCategories.reduce((sum, category) => sum + category.actual_amount, 0)
  const remainingBudget = totalIncome - totalBudgeted
  const remainingActual = totalIncome - totalSpent

  // Add new income source
  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIncomeName || !newIncomeAmount) return

    startTransition(async () => {
      await addIncomeSource(newIncomeName, Number(newIncomeAmount))
      // Optimistically update UI
      const newIncome = {
        id: Date.now(),
        name: newIncomeName,
        amount: Number(newIncomeAmount),
      }
      setIncomeSources([...incomeSources, newIncome])
      setNewIncomeName("")
      setNewIncomeAmount("")
    })
  }

  // Remove income source
  const handleRemoveIncome = async (id: number) => {
    startTransition(async () => {
      await removeIncomeSource(id)
      setIncomeSources(incomeSources.filter((source) => source.id !== id))
    })
  }

  // Add new budget category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName || !newCategoryAmount) return

    const colorIndex = budgetCategories.length % categoryColors.length
    const color = categoryColors[colorIndex]

    startTransition(async () => {
      await addBudgetCategory(newCategoryName, Number(newCategoryAmount), color)
      // Optimistically update UI
      const newCategory = {
        id: Date.now(),
        name: newCategoryName,
        planned_amount: Number(newCategoryAmount),
        actual_amount: 0,
        color,
      }
      setBudgetCategories([...budgetCategories, newCategory])
      setNewCategoryName("")
      setNewCategoryAmount("")
    })
  }

  // Remove budget category
  const handleRemoveCategory = async (id: number) => {
    startTransition(async () => {
      await removeBudgetCategory(id)
      setBudgetCategories(budgetCategories.filter((category) => category.id !== id))
    })
  }

  // Update actual spending for a category
  const handleUpdateActual = async (id: number, actual: number) => {
    // Optimistically update UI
    setBudgetCategories(
      budgetCategories.map((category) => (category.id === id ? { ...category, actual_amount: actual } : category)),
    )

    startTransition(async () => {
      await updateCategoryActual(id, actual)
    })
  }

  const handleLoadTemplate = async (template: any) => {
    const incomes = template.income.map((income: any) => ({
      name: income.name,
      amount: income.amount,
    }))

    const categories = template.categories.map((category: any, index: number) => ({
      name: category.name,
      amount: category.amount,
      color: categoryColors[index % categoryColors.length],
    }))

    startTransition(async () => {
      await loadBudgetTemplate(incomes, categories)
      // Update UI
      setIncomeSources(
        incomes.map((income: any, index: number) => ({
          id: Date.now() + index,
          ...income,
        })),
      )
      setBudgetCategories(
        categories.map((category: any, index: number) => ({
          id: Date.now() + index,
          name: category.name,
          planned_amount: category.amount,
          actual_amount: 0,
          color: category.color,
        })),
      )
      setShowTemplates(false)
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monthly Budget Planner</h1>
        <p className="text-gray-600">Plan and track your monthly income and expenses.</p>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Updating...</p>
          </div>
        </div>
      )}

      {/* Budget Templates Section */}
      {!showTemplates && (incomeSources.length === 0 || budgetCategories.length === 0) && (
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-green-800">🚀 Quick Start</h2>
              <p className="text-green-700">New to budgeting? Try one of our pre-made templates!</p>
            </div>
            <button onClick={() => setShowTemplates(true)} className="btn btn-primary">
              Browse Templates
            </button>
          </div>
        </div>
      )}

      {showTemplates && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Choose a Budget Template</h2>
            <button onClick={() => setShowTemplates(false)} className="text-gray-500 hover:text-gray-700">
              ✕ Close
            </button>
          </div>
          <BudgetTemplates onLoadTemplate={handleLoadTemplate} />
        </div>
      )}

      {!showTemplates && (incomeSources.length > 0 || budgetCategories.length > 0) && (
        <div className="flex justify-center">
          <button onClick={() => setShowTemplates(true)} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
            Browse Budget Templates
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Section */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Income Sources
            </h2>

            <form onSubmit={handleAddIncome} className="space-y-4 mb-4">
              <div>
                <label htmlFor="incomeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Source Name
                </label>
                <input
                  id="incomeName"
                  type="text"
                  value={newIncomeName}
                  onChange={(e) => setNewIncomeName(e.target.value)}
                  className="input"
                  placeholder="e.g., Salary"
                  required
                />
              </div>

              <div>
                <label htmlFor="incomeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (AED)
                </label>
                <input
                  id="incomeAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newIncomeAmount}
                  onChange={(e) => setNewIncomeAmount(e.target.value)}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={isPending}>
                <PlusCircle size={18} />
                <span>Add Income</span>
              </button>
            </form>

            {incomeSources.length === 0 ? (
              <p className="text-gray-500 italic">No income sources added yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {incomeSources.map((source) => (
                  <li key={source.id} className="py-3 flex justify-between items-center">
                    <span>{source.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{source.amount.toFixed(2)} AED</span>
                      <button
                        onClick={() => handleRemoveIncome(source.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${source.name}`}
                        disabled={isPending}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Income:</p>
                <p className="font-bold text-xl text-blue-600">{totalIncome.toFixed(2)} AED</p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Categories Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>

            <form onSubmit={handleAddCategory} className="space-y-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input"
                    placeholder="e.g., Housing"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="categoryAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Planned Amount (AED)
                  </label>
                  <input
                    id="categoryAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(e.target.value)}
                    className="input"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={isPending}>
                <PlusCircle size={18} />
                <span>Add Category</span>
              </button>
            </form>

            {budgetCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 italic mb-4">No budget categories added yet.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2">Category</th>
                        <th className="text-right py-2 px-2">Planned</th>
                        <th className="text-right py-2 px-2">Actual</th>
                        <th className="text-right py-2 px-2">Remaining</th>
                        <th className="text-right py-2 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetCategories.map((category) => (
                        <tr key={category.id} className="border-b border-gray-100">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                              {category.name}
                            </div>
                          </td>
                          <td className="text-right py-3 px-2">{category.planned_amount.toFixed(2)} AED</td>
                          <td className="text-right py-3 px-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={category.actual_amount}
                              onChange={(e) => handleUpdateActual(category.id, Number(e.target.value))}
                              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md"
                              disabled={isPending}
                            />
                          </td>
                          <td
                            className={`text-right py-3 px-2 font-medium ${
                              category.planned_amount - category.actual_amount < 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {(category.planned_amount - category.actual_amount).toFixed(2)} AED
                          </td>
                          <td className="text-right py-3 px-2">
                            <button
                              onClick={() => handleRemoveCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label={`Remove ${category.name}`}
                              disabled={isPending}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Total Budgeted:</p>
                      <p className="font-semibold">{totalBudgeted.toFixed(2)} AED</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Total Income:</p>
                      <p className="font-semibold">{totalIncome.toFixed(2)} AED</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <p className="font-medium">Remaining to Budget:</p>
                      <p
                        className={`font-bold ${
                          remainingBudget < 0
                            ? "text-red-600"
                            : remainingBudget > 0
                              ? "text-green-600"
                              : "text-blue-600"
                        }`}
                      >
                        {remainingBudget.toFixed(2)} AED
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Total Spent:</p>
                      <p className="font-semibold">{totalSpent.toFixed(2)} AED</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Total Income:</p>
                      <p className="font-semibold">{totalIncome.toFixed(2)} AED</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                      <p className="font-medium">Remaining After Spending:</p>
                      <p
                        className={`font-bold ${
                          remainingActual < 0
                            ? "text-red-600"
                            : remainingActual > 0
                              ? "text-green-600"
                              : "text-blue-600"
                        }`}
                      >
                        {remainingActual.toFixed(2)} AED
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Budget Visualization */}
      {budgetCategories.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PieChart size={20} />
            Budget Visualization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">Planned Budget Allocation</h3>
              <div className="h-64">
                <BudgetChart
                  data={budgetCategories.map((category) => ({
                    name: category.name,
                    value: category.planned_amount,
                    color: category.color.replace("bg-", ""),
                  }))}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-center">Actual Spending</h3>
              <div className="h-64">
                <BudgetChart
                  data={budgetCategories.map((category) => ({
                    name: category.name,
                    value: category.actual_amount,
                    color: category.color.replace("bg-", ""),
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Budget vs. Actual Comparison</h3>
            <div className="space-y-4">
              {budgetCategories.map((category) => {
                const percentage =
                  category.planned_amount > 0 ? (category.actual_amount / category.planned_amount) * 100 : 0
                return (
                  <div key={category.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={
                            category.actual_amount > category.planned_amount
                              ? "text-red-600 font-medium"
                              : category.actual_amount === category.planned_amount
                                ? "text-blue-600 font-medium"
                                : "text-green-600 font-medium"
                          }
                        >
                          {category.actual_amount.toFixed(2)} / {category.planned_amount.toFixed(2)} AED (
                          {percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          percentage > 100 ? "bg-red-500" : percentage === 100 ? "bg-blue-500" : category.color
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Budget Rules Comparison */}
      <BudgetComparison />
    </div>
  )
}
