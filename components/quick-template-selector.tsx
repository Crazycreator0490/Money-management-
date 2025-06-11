"use client"

import { useState } from "react"
import { ChevronDown, DollarSign } from "lucide-react"

const budgetTemplates = [
  {
    name: "Student Budget",
    description: "Perfect for students managing limited income",
    income: [{ name: "Part-time Job", amount: 800 }],
    categories: [
      { name: "Tuition & Books", amount: 300, color: "bg-red-500" },
      { name: "Food", amount: 200, color: "bg-green-500" },
      { name: "Transportation", amount: 100, color: "bg-blue-500" },
      { name: "Entertainment", amount: 100, color: "bg-purple-500" },
      { name: "Savings", amount: 100, color: "bg-yellow-500" },
    ],
  },
  {
    name: "Young Professional",
    description: "For early career professionals",
    income: [{ name: "Salary", amount: 3500 }],
    categories: [
      { name: "Rent", amount: 1200, color: "bg-red-500" },
      { name: "Food & Groceries", amount: 400, color: "bg-green-500" },
      { name: "Transportation", amount: 300, color: "bg-blue-500" },
      { name: "Utilities", amount: 200, color: "bg-orange-500" },
      { name: "Entertainment", amount: 300, color: "bg-purple-500" },
      { name: "Savings", amount: 700, color: "bg-yellow-500" },
      { name: "Emergency Fund", amount: 400, color: "bg-gray-500" },
    ],
  },
  {
    name: "Family Budget",
    description: "Comprehensive budget for families",
    income: [
      { name: "Primary Income", amount: 4500 },
      { name: "Secondary Income", amount: 2000 },
    ],
    categories: [
      { name: "Housing", amount: 2000, color: "bg-red-500" },
      { name: "Food & Groceries", amount: 800, color: "bg-green-500" },
      { name: "Childcare", amount: 600, color: "bg-pink-500" },
      { name: "Transportation", amount: 500, color: "bg-blue-500" },
      { name: "Utilities", amount: 300, color: "bg-orange-500" },
      { name: "Healthcare", amount: 400, color: "bg-teal-500" },
      { name: "Education", amount: 300, color: "bg-indigo-500" },
      { name: "Entertainment", amount: 400, color: "bg-purple-500" },
      { name: "Savings", amount: 1000, color: "bg-yellow-500" },
      { name: "Emergency Fund", amount: 700, color: "bg-gray-500" },
    ],
  },
]

export default function QuickTemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName)
    setShowPreview(true)
  }

  const selectedTemplateData = budgetTemplates.find((t) => t.name === selectedTemplate)

  return (
    <div className="mt-8 space-y-4">
      <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center gap-2">
          <DollarSign size={24} />
          Quick Start: Budget Templates
        </h3>
        <p className="text-green-700 mb-4">
          Choose a template that matches your situation to get started quickly with budgeting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {budgetTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplateSelect(template.name)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTemplate === template.name
                  ? "border-green-500 bg-green-100"
                  : "border-green-200 bg-white hover:border-green-300"
              }`}
            >
              <h4 className="font-semibold text-green-800">{template.name}</h4>
              <p className="text-sm text-green-600 mt-1">{template.description}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-700">
                <ChevronDown size={14} />
                <span>Click to preview</span>
              </div>
            </button>
          ))}
        </div>

        {showPreview && selectedTemplateData && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Preview: {selectedTemplateData.name}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-700 mb-2">Income Sources:</h5>
                <ul className="space-y-1">
                  {selectedTemplateData.income.map((income, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{income.name}</span>
                      <span className="font-medium">${income.amount}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-green-200 mt-2 pt-2">
                  <div className="flex justify-between font-semibold text-green-800">
                    <span>Total Income:</span>
                    <span>${selectedTemplateData.income.reduce((sum, income) => sum + income.amount, 0)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-green-700 mb-2">Budget Categories:</h5>
                <ul className="space-y-1">
                  {selectedTemplateData.categories.map((category, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${category.color}`}></div>
                        <span>{category.name}</span>
                      </div>
                      <span className="font-medium">${category.amount}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-green-200 mt-2 pt-2">
                  <div className="flex justify-between font-semibold text-green-800">
                    <span>Total Expenses:</span>
                    <span>${selectedTemplateData.categories.reduce((sum, cat) => sum + cat.amount, 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700">
                💡 <strong>Tip:</strong> This template is a starting point. You can customize the amounts and categories
                to match your specific situation when you use our budget planner.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
