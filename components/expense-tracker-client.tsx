"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { PlusCircle } from "lucide-react"
import { addExpense } from "@/app/actions/expense-actions"
import type { Expense } from "@/lib/db"

type ExpenseTrackerClientProps = {
  initialExpenses: Expense[]
}

export default function ExpenseTrackerClient({ initialExpenses }: ExpenseTrackerClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Food")
  const [isPending, startTransition] = useTransition()

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description) return

    const expenseData = {
      amount: Number.parseFloat(amount),
      description,
      category,
      expenseDate: new Date().toISOString().split("T")[0],
    }

    // Optimistically update UI
    const newExpense: Expense = {
      id: Date.now(),
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      expense_date: expenseData.expenseDate,
      created_at: new Date().toISOString(),
    }

    setExpenses([newExpense, ...expenses])
    setAmount("")
    setDescription("")
    setCategory("Food")

    startTransition(async () => {
      await addExpense(expenseData.amount, expenseData.description, expenseData.category, expenseData.expenseDate)
    })
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your Expense Tracker</h1>
        <p className="text-gray-600">Track your daily expenses to better understand your spending habits.</p>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Adding expense...</p>
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (AED)
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder="0.00"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
                disabled={isPending}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="What did you spend on?"
              required
              disabled={isPending}
            />
          </div>

          <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={isPending}>
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

        {expenses.length === 0 ? (
          <p className="text-gray-500 italic">No expenses added yet.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {expenses.slice(0, 20).map((expense) => (
                <li key={expense.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {expense.category} • {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold">{expense.amount.toFixed(2)} AED</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total Spent:</p>
                <p className="font-bold text-xl text-blue-600">{totalSpent.toFixed(2)} AED</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expense Categories Summary */}
      {expenses.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {Object.entries(
              expenses.reduce(
                (acc, expense) => {
                  acc[expense.category] = (acc[expense.category] || 0) + expense.amount
                  return acc
                },
                {} as Record<string, number>,
              ),
            )
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <div className="text-right">
                    <span className="font-semibold">{amount.toFixed(2)} AED</span>
                    <div className="text-sm text-gray-600">{((amount / totalSpent) * 100).toFixed(1)}% of total</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
