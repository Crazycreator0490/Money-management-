"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, PiggyBank, TrendingUp, BookOpen, HelpCircle, Home } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/budget-planner", label: "Budget Planner", icon: Calculator },
  { href: "/expense-tracker", label: "Expense Tracker", icon: TrendingUp },
  { href: "/savings-calculator", label: "Savings Calculator", icon: PiggyBank },
  { href: "/financial-terms", label: "Financial Terms", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-wrap justify-center gap-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-700 text-white font-medium" : "text-blue-100 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
