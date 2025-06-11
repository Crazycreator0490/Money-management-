"use client"

import { useState } from "react"
import { Plus, Trash2, DollarSign, PieChart } from "lucide-react"
import BudgetChart from "./budget-chart"
import BudgetComparison from "./budget-comparison"

type IncomeSource = {
  id: number
  name: string
  amount: number
}

type BudgetCategory = {
  id: number
  name: string
  planned_amount: number
  actual_amount: number
  color: string
}

const colorOptions = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-gray-500",
]

export default function BudgetPlannerClient() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [newIncome, setNewIncome] = useState({ name: "", amount: "" })
  const [newCategory, setNewCategory] = useState({ name: "", amount: "", color: "bg-blue-500" })

  const addIncomeSource = () => {
    if (newIncome.name && newIncome.amount) {
      const income: IncomeSource = {
        id: Date.now(),
        name: newIncome.name,
        amount: Number.parseFloat(newIncome.amount),
      }
      setIncomeSources([...incomeSources, income])
      setNewIncome({ name: "", amount: "" })
    }
  }

  const removeIncomeSource = (id: number) => {
    setIncomeSources(incomeSources.filter((income) => income.id !== id))
  }

  const addBudgetCategory = () => {
    if (newCategory.name && newCategory.amount) {
      const category: BudgetCategory = {
        id: Date.now(),
        name: newCategory.name,
        planned_amount: Number.parseFloat(newCategory.amount),
        actual_amount: 0,
        color: newCategory.color,
      }
      setBudgetCategories([...budgetCategories, category])
      setNewCategory({ name: "", amount: "", color: "bg-blue-500" })
    }
  }

  const removeBudgetCategory = (id: number) => {
    setBudgetCategories(budgetCategories.filter((category) => category.id !== id))
  }

  const updateActualAmount = (id: number, actualAmount: number) => {
    setBudgetCategories(
      budgetCategories.map((category) =>
        category.id === id ? { ...category, actual_amount: actualAmount } : category,
      ),
    )
  }

  const totalIncome = incomeSources.reduce((sum, income) => sum + income.amount, 0)
  const totalPlanned = budgetCategories.reduce((sum, category) => sum + category.planned_amount, 0)
  const totalActual = budgetCategories.reduce((sum, category) => sum + category.actual_amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Budget Planner</h1>
        <p className="text-gray-600">Plan and track your monthly budget to achieve your financial goals.</p>
      </div>

      {/* Income Sources */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="text-green-600" size={24} />
          Income Sources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Income source name"
            value={newIncome.name}
            onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            className="input"
          />
          <button onClick={addIncomeSource} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Income
          </button>
        </div>

        <div className="space-y-2">
          {incomeSources.map((income) => (
            <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">{income.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-semibold">${income.amount.toFixed(2)}</span>
                <button onClick={() => removeIncomeSource(income.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {incomeSources.length > 0 && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Monthly Income:</span>
              <span className="text-xl font-bold text-green-600">${totalIncome.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Budget Categories */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PieChart className="text-blue-600" size={24} />
          Budget Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Planned amount"
            value={newCategory.amount}
            onChange={(e) => setNewCategory({ ...newCategory, amount: e.target.value })}
            className="input"
          />
          <select
            value={newCategory.color}
            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
            className="input"
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color.replace("bg-", "").replace("-500", "")}
              </option>
            ))}
          </select>
          <button onClick={addBudgetCategory} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Category
          </button>
        </div>

        <div className="space-y-3">
          {budgetCategories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <button onClick={() => removeBudgetCategory(category.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned</label>
                  <div className="text-lg font-semibold text-blue-600">${category.planned_amount.toFixed(2)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual</label>
                  <input
                    type="number"
                    value={category.actual_amount}
                    onChange={(e) => updateActualAmount(category.id, Number.parseFloat(e.target.value) || 0)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difference</label>
                  <div
                    className={`text-lg font-semibold ${
                      category.actual_amount <= category.planned_amount ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${(category.planned_amount - category.actual_amount).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {budgetCategories.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Planned:</span>
                <span className="font-bold text-blue-600">${totalPlanned.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Actual:</span>
                <span className="font-bold text-purple-600">${totalActual.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-semibold">Remaining Income:</span>
                <span
                  className={`font-bold text-lg ${totalIncome - totalActual >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${(totalIncome - totalActual).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      {budgetCategories.length > 0 && (
        <>
          <BudgetChart categories={budgetCategories} />
          <BudgetComparison totalIncome={totalIncome} totalPlanned={totalPlanned} totalActual={totalActual} />
        </>
      )}
    </div>
  )
}
