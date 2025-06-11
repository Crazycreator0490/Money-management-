"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BudgetChartProps {
  categories: Array<{
    id: number
    name: string
    planned_amount: number
    actual_amount: number
    color: string
  }>
}

const COLORS = {
  "bg-red-500": "#ef4444",
  "bg-blue-500": "#3b82f6",
  "bg-green-500": "#10b981",
  "bg-yellow-500": "#f59e0b",
  "bg-purple-500": "#8b5cf6",
  "bg-pink-500": "#ec4899",
  "bg-indigo-500": "#6366f1",
  "bg-orange-500": "#f97316",
  "bg-teal-500": "#14b8a6",
  "bg-gray-500": "#6b7280",
}

export default function BudgetChart({ categories }: BudgetChartProps) {
  const data = categories.map((category) => ({
    name: category.name,
    value: category.planned_amount,
    color: COLORS[category.color as keyof typeof COLORS] || "#6b7280",
  }))

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
