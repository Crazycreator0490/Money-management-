"use client"

import { useState, useEffect } from "react"
import { BookOpen, RefreshCw } from "lucide-react"

type FinancialTerm = {
  term: string
  definition: string
}

export default function FinancialTerms() {
  const financialTerms: FinancialTerm[] = [
    {
      term: "Compound Interest",
      definition:
        "Interest calculated on both the initial principal and the accumulated interest. It's essentially 'interest on interest' and can significantly boost your savings over time.",
    },
    {
      term: "Emergency Fund",
      definition:
        "Money set aside for unexpected expenses or financial emergencies, typically recommended to cover 3-6 months of living expenses.",
    },
    {
      term: "Net Worth",
      definition:
        "The total value of what you own (assets) minus what you owe (liabilities). It's a snapshot of your financial health at a point in time.",
    },
    {
      term: "Inflation",
      definition:
        "The rate at which the general level of prices for goods and services rises, causing purchasing power to fall over time.",
    },
    {
      term: "Diversification",
      definition:
        "Spreading investments across various financial instruments to reduce risk and exposure to any single asset or risk.",
    },
  ]

  const [termOfTheDay, setTermOfTheDay] = useState<FinancialTerm | null>(null)

  const getRandomTerm = () => {
    const randomIndex = Math.floor(Math.random() * financialTerms.length)
    return financialTerms[randomIndex]
  }

  useEffect(() => {
    setTermOfTheDay(getRandomTerm())
  }, [])

  const handleRefresh = () => {
    setTermOfTheDay(getRandomTerm())
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Terms</h1>
        <p className="text-gray-600">Expand your financial vocabulary with these key terms.</p>
      </div>

      <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <BookOpen size={20} />
            <span>Financial Term of the Day</span>
          </h2>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-blue-200 transition-colors"
            aria-label="Get new term"
          >
            <RefreshCw size={18} className="text-blue-700" />
          </button>
        </div>

        {termOfTheDay && (
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-2">{termOfTheDay.term}</h3>
            <p className="text-blue-800">{termOfTheDay.definition}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Financial Glossary</h2>
        <div className="space-y-4">
          {financialTerms.map((term, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg">{term.term}</h3>
              <p className="text-gray-700 mt-1">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
