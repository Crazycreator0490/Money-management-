"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Milestone = {
  name: string
  description: string
  percentage: number
}

export default function Progress() {
  const milestones: Milestone[] = [
    {
      name: "Learning about Budgeting",
      description: "Understanding how to track income and expenses to create a balanced budget.",
      percentage: 25,
    },
    {
      name: "Building an Emergency Fund",
      description: "Saving 3-6 months of expenses for unexpected financial emergencies.",
      percentage: 50,
    },
    {
      name: "Understanding Debt Management",
      description: "Learning strategies to manage and reduce debt effectively.",
      percentage: 75,
    },
    {
      name: "Exploring Investments",
      description: "Beginning to understand different investment options and strategies.",
      percentage: 100,
    },
  ]

  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0)
  const currentMilestone = milestones[currentMilestoneIndex]

  const handlePrevious = () => {
    setCurrentMilestoneIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentMilestoneIndex((prev) => (prev < milestones.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-gray-600">Track my journey toward financial understanding.</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-6">My Progress Towards Financial Understanding</h2>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentMilestoneIndex === 0}
            className={`p-2 rounded-full ${
              currentMilestoneIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="Previous milestone"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex-grow">
            <p className="text-lg font-medium mb-2">
              My current milestone: <span className="text-blue-700">{currentMilestone.name}</span>
            </p>
            <p className="text-gray-600 mb-4">{currentMilestone.description}</p>

            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${currentMilestone.percentage}%` }}
              ></div>
            </div>

            <p className="text-right mt-1 font-medium">{currentMilestone.percentage}% Complete</p>
          </div>

          <button
            onClick={handleNext}
            disabled={currentMilestoneIndex === milestones.length - 1}
            className={`p-2 rounded-full ${
              currentMilestoneIndex === milestones.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="Next milestone"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            Note: This is a demonstration of progress tracking. In a real application, this would be updated based on
            your actual progress.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Financial Milestones</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                index === currentMilestoneIndex ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{milestone.name}</h3>
                <span className="text-sm font-medium">{milestone.percentage}%</span>
              </div>
              <p className="text-sm text-gray-600">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
