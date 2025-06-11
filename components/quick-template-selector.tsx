"use client"

import Link from "next/link"
import { ArrowRight, User, Users, Briefcase } from "lucide-react"

export default function QuickTemplateSelector() {
  const quickTemplates = [
    {
      name: "Student/Entry Level",
      range: "1,500 - 5,000 AED",
      icon: <User size={20} />,
      description: "Starting your financial journey",
    },
    {
      name: "Professional",
      range: "5,000 - 15,000 AED",
      icon: <Briefcase size={20} />,
      description: "Established career with moderate income",
    },
    {
      name: "Family Budget",
      range: "8,000 - 20,000 AED",
      icon: <Users size={20} />,
      description: "Managing household expenses",
    },
  ]

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Find Your Budget Template</h3>
      <p className="text-purple-700 mb-4">
        Not sure where to start? Choose a template based on your income level and get a personalized budget in seconds.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {quickTemplates.map((template, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-purple-100 rounded text-purple-600">{template.icon}</div>
              <span className="font-medium text-sm">{template.name}</span>
            </div>
            <p className="text-xs text-gray-600 mb-1">{template.range}</p>
            <p className="text-xs text-gray-700">{template.description}</p>
          </div>
        ))}
      </div>

      <Link href="/budget-planner" className="btn btn-primary flex items-center gap-2 justify-center">
        <span>Explore Budget Templates</span>
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
