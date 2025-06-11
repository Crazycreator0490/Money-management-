"use client"

interface BudgetComparisonProps {
  totalIncome?: number
  totalPlanned?: number
  totalActual?: number
}

export default function BudgetComparison({
  totalIncome = 0,
  totalPlanned = 0,
  totalActual = 0,
}: BudgetComparisonProps) {
  const rules = [
    {
      name: "50/30/20 Rule",
      description: "50% needs, 30% wants, 20% savings",
      needs: totalIncome * 0.5,
      wants: totalIncome * 0.3,
      savings: totalIncome * 0.2,
    },
    {
      name: "80/20 Rule",
      description: "80% expenses, 20% savings",
      needs: totalIncome * 0.8,
      wants: 0,
      savings: totalIncome * 0.2,
    },
    {
      name: "60/40 Rule",
      description: "60% expenses, 40% savings",
      needs: totalIncome * 0.6,
      wants: 0,
      savings: totalIncome * 0.4,
    },
  ]

  if (totalIncome === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Budget Rules Comparison</h3>
        <p className="text-gray-500 italic">Add income sources to see budget rule comparisons.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Budget Rules Comparison</h3>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.name} className="p-4 border rounded-lg">
            <h4 className="font-medium text-lg">{rule.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Needs/Expenses:</span>
                <div className="text-blue-600 font-semibold">${rule.needs.toFixed(2)}</div>
              </div>
              {rule.wants > 0 && (
                <div>
                  <span className="font-medium">Wants:</span>
                  <div className="text-purple-600 font-semibold">${rule.wants.toFixed(2)}</div>
                </div>
              )}
              <div>
                <span className="font-medium">Savings:</span>
                <div className="text-green-600 font-semibold">${rule.savings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
