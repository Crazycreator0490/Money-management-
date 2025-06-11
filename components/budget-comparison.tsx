"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

type BudgetRule = {
  name: string
  description: string
  needs: number
  wants: number
  savings: number
  color: string
}

export default function BudgetComparison() {
  const budgetRules: BudgetRule[] = [
    {
      name: "50/30/20 Rule",
      description: "Popular balanced approach",
      needs: 50,
      wants: 30,
      savings: 20,
      color: "#3B82F6",
    },
    {
      name: "60/20/20 Rule",
      description: "Higher focus on needs",
      needs: 60,
      wants: 20,
      savings: 20,
      color: "#10B981",
    },
    {
      name: "70/20/10 Rule",
      description: "Beginner-friendly approach",
      needs: 70,
      wants: 20,
      savings: 10,
      color: "#F59E0B",
    },
    {
      name: "40/30/30 Rule",
      description: "Aggressive savings approach",
      needs: 40,
      wants: 30,
      savings: 30,
      color: "#8B5CF6",
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Popular Budget Rules Comparison</h3>
      <p className="text-gray-600 mb-6">
        Different budgeting approaches allocate income differently across needs, wants, and savings.
      </p>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetRules} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="needs" stackId="a" fill="#EF4444" name="Needs" />
            <Bar dataKey="wants" stackId="a" fill="#F59E0B" name="Wants" />
            <Bar dataKey="savings" stackId="a" fill="#10B981" name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetRules.map((rule, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-1">{rule.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Needs (Housing, Food, etc.):</span>
                <span className="font-medium">{rule.needs}%</span>
              </div>
              <div className="flex justify-between">
                <span>Wants (Entertainment, etc.):</span>
                <span className="font-medium">{rule.wants}%</span>
              </div>
              <div className="flex justify-between">
                <span>Savings & Investments:</span>
                <span className="font-medium">{rule.savings}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Which Rule Should You Choose?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>50/30/20:</strong> Great for most people with stable income
          </li>
          <li>
            • <strong>60/20/20:</strong> Better if you have high essential expenses
          </li>
          <li>
            • <strong>70/20/10:</strong> Good starting point for beginners or tight budgets
          </li>
          <li>
            • <strong>40/30/30:</strong> Ideal if you want to build wealth quickly
          </li>
        </ul>
      </div>
    </div>
  )
}
