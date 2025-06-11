"use client"

import type { BudgetTemplate } from "@/lib/types"

interface BudgetTemplatesProps {
  onLoadTemplate: (template: BudgetTemplate) => void
}

const templates: BudgetTemplate[] = [
  {
    name: "Student Budget",
    description: "Perfect for college students with limited income",
    income: [
      { name: "Part-time Job", amount: 800 },
      { name: "Financial Aid", amount: 500 },
    ],
    categories: [
      { name: "Housing", amount: 400, percentage: 31 },
      { name: "Food", amount: 300, percentage: 23 },
      { name: "Transportation", amount: 150, percentage: 12 },
      { name: "Books & Supplies", amount: 200, percentage: 15 },
      { name: "Entertainment", amount: 100, percentage: 8 },
      { name: "Savings", amount: 150, percentage: 12 },
    ],
  },
  {
    name: "Young Professional",
    description: "For early career professionals building their foundation",
    income: [
      { name: "Salary", amount: 4000 },
      { name: "Side Hustle", amount: 500 },
    ],
    categories: [
      { name: "Housing", amount: 1350, percentage: 30 },
      { name: "Food", amount: 600, percentage: 13 },
      { name: "Transportation", amount: 450, percentage: 10 },
      { name: "Utilities", amount: 200, percentage: 4 },
      { name: "Entertainment", amount: 400, percentage: 9 },
      { name: "Emergency Fund", amount: 450, percentage: 10 },
      { name: "Retirement", amount: 450, percentage: 10 },
      { name: "Personal", amount: 600, percentage: 13 },
    ],
  },
  {
    name: "Family Budget",
    description: "Comprehensive budget for families with children",
    income: [
      { name: "Primary Income", amount: 5500 },
      { name: "Secondary Income", amount: 2500 },
    ],
    categories: [
      { name: "Housing", amount: 2400, percentage: 30 },
      { name: "Food", amount: 1200, percentage: 15 },
      { name: "Transportation", amount: 800, percentage: 10 },
      { name: "Childcare", amount: 1000, percentage: 13 },
      { name: "Healthcare", amount: 400, percentage: 5 },
      { name: "Utilities", amount: 320, percentage: 4 },
      { name: "Entertainment", amount: 480, percentage: 6 },
      { name: "Savings", amount: 800, percentage: 10 },
      { name: "Emergency Fund", amount: 600, percentage: 8 },
    ],
  },
]

export default function BudgetTemplates({ onLoadTemplate }: BudgetTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div key={template.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{template.description}</p>

          <div className="space-y-2 mb-4">
            <div className="text-sm">
              <span className="font-medium">Total Income: </span>
              <span className="text-green-600 font-semibold">
                ${template.income.reduce((sum, income) => sum + income.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Categories: </span>
              <span className="text-blue-600">{template.categories.length}</span>
            </div>
          </div>

          <button onClick={() => onLoadTemplate(template)} className="btn btn-primary w-full">
            Use This Template
          </button>
        </div>
      ))}
    </div>
  )
}
