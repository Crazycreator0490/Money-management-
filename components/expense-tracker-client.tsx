"use client"

import { useState } from "react"
import { Plus, Calendar, Tag, DollarSign, TrendingDown } from "lucide-react"
import type { Expense } from "@/lib/types"

const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
]

export default function ExpenseTrackerClient() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Food & Dining",
    expense_date: new Date().toISOString().split("T")[0],
  })

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.description) return

    const expense: Expense = {
      id: Date.now(),
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      expense_date: newExpense.expense_date,
      created_at: new Date().toISOString(),
    }

    setExpenses([expense, ...expenses])
    setNewExpense({
      amount: "",
      description: "",
      category: "Food & Dining",
      expense_date: new Date().toISOString().split("T")[0],
    })
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <p className="text-gray-600">Track your daily expenses to understand your spending patterns.</p>
      </div>

      {/* Add Expense Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="text-blue-600" size={24} />
          Add New Expense
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="What did you buy?"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="input"
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newExpense.expense_date}
              onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddExpense}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="flex items-center gap-3">
              <DollarSign className="text-red-600" size={24} />
              <div>
                <h3 className="font-semibold text-red-800">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-blue-800">Total Transactions</h3>
                <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-800">Average per Day</h3>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {expenses.length > 0
                    ? (totalExpenses / Math.max(1, new Set(expenses.map((e) => e.expense_date)).size)).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Tag className="text-purple-600" size={24} />
            Expenses by Category
          </h2>
          <div className="space-y-3">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <div className="text-right">
                    <div className="font-semibold">${amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{((amount / totalExpenses) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <div className="space-y-2">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-600">
                    {expense.category} • {new Date(expense.expense_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">${expense.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="card text-center py-12">
          <TrendingDown className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No expenses tracked yet</h3>
          <p className="text-gray-500">Start by adding your first expense above to begin tracking your spending.</p>
        </div>
      )}
    </div>
  )
}
