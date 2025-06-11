"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FAQ = {
  question: string
  answer: string
}

export default function FAQPage() {
  const faqs: FAQ[] = [
    {
      question: "How do I create my first budget?",
      answer:
        "Start by tracking all your income sources and listing all your expenses for a month. Categorize expenses into needs (rent, food, utilities) and wants (entertainment, dining out). Subtract your expenses from your income to see where you stand. Adjust your spending as needed to ensure you're not spending more than you earn.",
    },
    {
      question: "How much should I save for emergencies?",
      answer:
        "Financial experts typically recommend saving 3-6 months of essential expenses in an emergency fund. Start small if needed - even AED 500 per month adds up. Keep this money in an easily accessible account, separate from your regular spending account.",
    },
    {
      question: "How can I start investing with little money?",
      answer:
        "You can start investing with small amounts through micro-investing apps, which allow you to invest spare change or small regular deposits. Consider low-cost index funds or ETFs which provide diversification. Remember that investing is for long-term goals, not short-term needs.",
    },
    {
      question: "What's the difference between good debt and bad debt?",
      answer:
        "Good debt is money borrowed for something that can grow in value or generate income over time, like education or a home mortgage. Bad debt typically finances depreciating assets or consumption, like credit card debt for non-essential purchases. Good debt often has lower interest rates and potential tax benefits.",
    },
    {
      question: "How do I improve my credit score?",
      answer:
        "Pay all bills on time, reduce credit card balances, don't close old credit accounts, limit new credit applications, and regularly check your credit report for errors. Improving your credit score takes time, so be patient and consistent with good financial habits.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Beginner FAQs</h1>
        <p className="text-gray-600">Common questions about personal finance for beginners.</p>
      </div>

      <div className="card">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
