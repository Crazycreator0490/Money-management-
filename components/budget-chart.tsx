"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type ChartData = {
  name: string
  value: number
  color: string
}

type BudgetChartProps = {
  data: ChartData[]
}

export default function BudgetChart({ data }: BudgetChartProps) {
  // Convert Tailwind color classes to actual colors
  const getColor = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      "blue-500": "#3B82F6",
      "green-500": "#10B981",
      "yellow-500": "#F59E0B",
      "purple-500": "#8B5CF6",
      "pink-500": "#EC4899",
      "indigo-500": "#6366F1",
      "red-500": "#EF4444",
      "orange-500": "#F97316",
    }

    return colorMap[colorClass] || "#3B82F6"
  }

  // Filter out zero values
  const filteredData = data.filter((item) => item.value > 0)

  if (filteredData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 italic">No data to display</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.color)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value.toFixed(2)} AED`}
          contentStyle={{ borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  )
}
