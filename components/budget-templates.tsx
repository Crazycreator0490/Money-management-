"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Users, User, Home, Briefcase } from "lucide-react"

type BudgetTemplate = {
  id: string
  name: string
  description: string
  incomeRange: string
  lifestyle: string
  icon: React.ReactNode
  income: Array<{ name: string; amount: number }>
  categories: Array<{ name: string; amount: number; percentage: number }>
}

type BudgetTemplatesProps = {
  onLoadTemplate: (template: BudgetTemplate) => void
}

export default function BudgetTemplates({ onLoadTemplate }: BudgetTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates: BudgetTemplate[] = [
    {
      id: "entry-level-single",
      name: "Entry Level - Single Person",
      description: "Perfect for young professionals starting their career",
      incomeRange: "3,000 - 5,000 AED",
      lifestyle: "Single, Minimal Expenses",
      icon: <User size={20} />,
      income: [{ name: "Salary", amount: 4000 }],
      categories: [
        { name: "Housing", amount: 1200, percentage: 30 },
        { name: "Food", amount: 800, percentage: 20 },
        { name: "Transportation", amount: 400, percentage: 10 },
        { name: "Utilities", amount: 300, percentage: 7.5 },
        { name: "Personal Care", amount: 200, percentage: 5 },
        { name: "Entertainment", amount: 300, percentage: 7.5 },
        { name: "Emergency Fund", amount: 400, percentage: 10 },
        { name: "Savings", amount: 400, percentage: 10 },
      ],
    },
    {
      id: "mid-level-single",
      name: "Mid-Level Professional",
      description: "For established professionals with moderate income",
      incomeRange: "5,000 - 10,000 AED",
      lifestyle: "Single, Comfortable Living",
      icon: <Briefcase size={20} />,
      income: [
        { name: "Salary", amount: 7500 },
        { name: "Bonus/Allowances", amount: 500 },
      ],
      categories: [
        { name: "Housing", amount: 2400, percentage: 30 },
        { name: "Food", amount: 1200, percentage: 15 },
        { name: "Transportation", amount: 800, percentage: 10 },
        { name: "Utilities", amount: 400, percentage: 5 },
        { name: "Personal Care", amount: 400, percentage: 5 },
        { name: "Entertainment", amount: 800, percentage: 10 },
        { name: "Shopping", amount: 400, percentage: 5 },
        { name: "Emergency Fund", amount: 800, percentage: 10 },
        { name: "Investments", amount: 800, percentage: 10 },
      ],
    },
    {
      id: "family-budget",
      name: "Family Budget",
      description: "Comprehensive budget for families with children",
      incomeRange: "8,000 - 15,000 AED",
      lifestyle: "Family with Children",
      icon: <Users size={20} />,
      income: [
        { name: "Primary Income", amount: 10000 },
        { name: "Secondary Income", amount: 2000 },
      ],
      categories: [
        { name: "Housing", amount: 3600, percentage: 30 },
        { name: "Food & Groceries", amount: 2000, percentage: 16.7 },
        { name: "Transportation", amount: 1200, percentage: 10 },
        { name: "Utilities", amount: 600, percentage: 5 },
        { name: "Children's Education", amount: 1500, percentage: 12.5 },
        { name: "Healthcare", amount: 600, percentage: 5 },
        { name: "Entertainment", amount: 600, percentage: 5 },
        { name: "Emergency Fund", amount: 900, percentage: 7.5 },
        { name: "Savings", amount: 1000, percentage: 8.3 },
      ],
    },
    {
      id: "high-income",
      name: "High Income Professional",
      description: "For senior professionals and executives",
      incomeRange: "15,000 - 25,000 AED",
      lifestyle: "Luxury Lifestyle",
      icon: <Home size={20} />,
      income: [
        { name: "Base Salary", amount: 18000 },
        { name: "Bonus", amount: 2000 },
      ],
      categories: [
        { name: "Housing", amount: 6000, percentage: 30 },
        { name: "Food & Dining", amount: 2000, percentage: 10 },
        { name: "Transportation", amount: 2000, percentage: 10 },
        { name: "Utilities", amount: 800, percentage: 4 },
        { name: "Personal Care", amount: 1000, percentage: 5 },
        { name: "Entertainment", amount: 1500, percentage: 7.5 },
        { name: "Travel", amount: 1500, percentage: 7.5 },
        { name: "Shopping", amount: 1000, percentage: 5 },
        { name: "Emergency Fund", amount: 2000, percentage: 10 },
        { name: "Investments", amount: 2200, percentage: 11 },
      ],
    },
    {
      id: "student-budget",
      name: "Student Budget",
      description: "Tight budget for students and interns",
      incomeRange: "1,500 - 3,000 AED",
      lifestyle: "Student/Intern",
      icon: <FileText size={20} />,
      income: [{ name: "Allowance/Part-time", amount: 2500 }],
      categories: [
        { name: "Accommodation", amount: 800, percentage: 32 },
        { name: "Food", amount: 600, percentage: 24 },
        { name: "Transportation", amount: 200, percentage: 8 },
        { name: "Utilities", amount: 150, percentage: 6 },
        { name: "Study Materials", amount: 200, percentage: 8 },
        { name: "Personal Care", amount: 100, percentage: 4 },
        { name: "Entertainment", amount: 200, percentage: 8 },
        { name: "Emergency Fund", amount: 250, percentage: 10 },
      ],
    },
    {
      id: "retirement-prep",
      name: "Pre-Retirement Planning",
      description: "Focus on savings and investment for retirement",
      incomeRange: "12,000 - 20,000 AED",
      lifestyle: "Mature Professional",
      icon: <Briefcase size={20} />,
      income: [
        { name: "Salary", amount: 15000 },
        { name: "Investment Returns", amount: 1000 },
      ],
      categories: [
        { name: "Housing", amount: 4000, percentage: 25 },
        { name: "Food", amount: 1600, percentage: 10 },
        { name: "Transportation", amount: 1200, percentage: 7.5 },
        { name: "Utilities", amount: 600, percentage: 3.75 },
        { name: "Healthcare", amount: 800, percentage: 5 },
        { name: "Entertainment", amount: 800, percentage: 5 },
        { name: "Emergency Fund", amount: 1600, percentage: 10 },
        { name: "Retirement Savings", amount: 3200, percentage: 20 },
        { name: "Investments", amount: 2200, percentage: 13.75 },
      ],
    },
  ]

  const handleTemplateSelect = (template: BudgetTemplate) => {
    setSelectedTemplate(template.id)
  }

  const handleLoadTemplate = (template: BudgetTemplate) => {
    onLoadTemplate(template)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Budget Templates</h2>
        <p className="text-gray-600">Choose a pre-defined budget template based on your income level and lifestyle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{template.icon}</div>
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.incomeRange}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{template.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lifestyle:</span>
                <span className="font-medium">{template.lifestyle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Income:</span>
                <span className="font-medium">
                  {template.income.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} AED
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categories:</span>
                <span className="font-medium">{template.categories.length} categories</span>
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoadTemplate(template)
                  }}
                  className="w-full btn btn-primary"
                >
                  Load This Template
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
          {(() => {
            const template = templates.find((t) => t.id === selectedTemplate)
            if (!template) return null

            return (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Income Sources:</h4>
                  <div className="space-y-1">
                    {template.income.map((income, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{income.name}</span>
                        <span className="font-medium">{income.amount.toLocaleString()} AED</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Budget Categories:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {template.categories.map((category, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">
                          {category.amount.toLocaleString()} AED ({category.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total Allocated:</span>
                    <span>
                      {template.categories.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()} AED (
                      {template.categories.reduce((sum, cat) => sum + cat.percentage, 0)}%)
                    </span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">💡 Template Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Templates are starting points - adjust categories to fit your specific needs</li>
          <li>• The 50/30/20 rule: 50% needs, 30% wants, 20% savings is a good baseline</li>
          <li>• Emergency funds should cover 3-6 months of essential expenses</li>
          <li>• Consider your location and lifestyle when choosing a template</li>
          <li>• Review and adjust your budget monthly as your situation changes</li>
        </ul>
      </div>
    </div>
  )
}
