"use client"
import Link from "next/link"
import { Calculator, PiggyBank, TrendingUp } from "lucide-react"

const quickActions = [
  {
    title: "Start Budgeting",
    description: "Create your first monthly budget",
    icon: Calculator,
    href: "/budget-planner",
    color: "bg-blue-500",
  },
  {
    title: "Track Expenses",
    description: "Log your daily spending",
    icon: TrendingUp,
    href: "/expense-tracker",
    color: "bg-green-500",
  },
  {
    title: "Set Savings Goal",
    description: "Plan for your financial future",
    icon: PiggyBank,
    href: "/savings-calculator",
    color: "bg-purple-500",
  },
]

export default function QuickTemplateSelector() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Quick Start Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="block p-4 border rounded-lg hover:shadow-md transition-all hover:border-blue-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-medium">{action.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
