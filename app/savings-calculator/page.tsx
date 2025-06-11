"use client"
import { requireAuth } from "@/lib/auth"
import { getSavingsGoals } from "@/lib/db"
import SavingsCalculatorClient from "@/components/savings-calculator-client"

export default async function SavingsCalculator() {
  const user = await requireAuth()
  const savingsGoals = await getSavingsGoals(user.id)

  return <SavingsCalculatorClient initialSavingsGoals={savingsGoals} />
}

// SavingsCalculatorClient component should be defined in a separate file, e.g., "@/components/savings-calculator-client.tsx"
// Here is a possible implementation of the SavingsCalculatorClient component

// import type React from "react"
// import { useState } from "react"
// import { Calculator } from 'lucide-react'

// type SavingsCalculatorClientProps = {
//   initialSavingsGoals: any[]
// }

// export default function SavingsCalculatorClient({ initialSavingsGoals }: SavingsCalculatorClientProps) {
//   const [goalAmount, setGoalAmount] = useState("")
//   const [monthlySavings, setMonthlySavings] = useState("")
//   const [estimatedTime, setEstimatedTime] = useState<number | null>(null)

//   const handleCalculate = (e: React.FormEvent) => {
//     e.preventDefault()

//     const goal = Number.parseFloat(goalAmount)
//     const monthly = Number.parseFloat(monthlySavings)

//     if (goal > 0 && monthly > 0) {
//       const months = Math.ceil(goal / monthly)
//       setEstimatedTime(months)
//     }
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold">Savings Goal Calculator</h1>
//         <p className="text-gray-600">Calculate how long it will take to reach your savings goal.</p>
//       </div>

//       <div className="card">
//         <form onSubmit={handleCalculate} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
//                 Goal Amount (AED)
//               </label>
//               <input
//                 id="goalAmount"
//                 type="number"
//                 min="1"
//                 step="1"
//                 value={goalAmount}
//                 onChange={(e) => setGoalAmount(e.target.value)}
//                 className="input"
//                 placeholder="10000"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="monthlySavings" className="block text-sm font-medium text-gray-700 mb-1">
//                 Monthly Savings (AED)
//               </label>
//               <input
//                 id="monthlySavings"
//                 type="number"
//                 min="1"
//                 step="1"
//                 value={monthlySavings}
//                 onChange={(e) => setMonthlySavings(e.target.value)}
//                 className="input"
//                 placeholder="500"
//                 required
//               />
//             </div>
//           </div>

//           <button type="submit" className="btn btn-primary flex items-center gap-2">
//             <span>Calculate Time</span>
//           </button>
//         </form>

//         {estimatedTime !== null && (
//           <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//             <h3 className="text-xl font-semibold text-blue-800">Estimated Time:</h3>
//             <div className="mt-2 text-center">
//               <p className="text-3xl font-bold text-blue-700">{estimatedTime} months</p>
//               <p className="text-sm text-blue-600 mt-1">
//                 ({Math.floor(estimatedTime / 12)} years and {estimatedTime % 12} months)
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
