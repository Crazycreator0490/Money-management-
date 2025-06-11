import Image from "next/image"
import Link from "next/link"
import QuickTemplateSelector from "@/components/quick-template-selector"

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="section">
        <h2 className="text-2xl font-bold mb-4">1. Welcome to Your Financial Journey</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Financial Journey"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg">
              Welcome to your financial education platform! This site will help you learn about budgeting, saving, and
              managing your money effectively. Whether you're just starting out or looking to improve your financial
              literacy, we'll guide you through each step of the journey.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      <section className="section">
        <h2 className="text-2xl font-bold mb-4">2. Basic Financial Concepts</h2>
        <p className="text-lg mb-4">
          Here are some fundamental financial terms that form the building blocks of financial literacy:
        </p>
        <ul className="space-y-3">
          <li className="card">
            <span className="font-semibold">Budget:</span> A plan for your money that helps you track income and
            expenses, ensuring you know where your money is going.
          </li>
          <li className="card">
            <span className="font-semibold">Savings:</span> Money set aside for future use, emergencies, or specific
            goals rather than spent immediately.
          </li>
          <li className="card">
            <span className="font-semibold">Debt:</span> Money borrowed that must be repaid, usually with interest (an
            additional fee for borrowing).
          </li>
          <li className="card">
            <span className="font-semibold">Income:</span> Money received from work, investments, or other sources.
          </li>
          <li className="card">
            <span className="font-semibold">Expenses:</span> Money spent on goods, services, bills, and other costs of
            living.
          </li>
        </ul>
      </section>

      <div className="border-t border-gray-200"></div>

      <section className="section">
        <h2 className="text-2xl font-bold mb-4">3. Get Started with Financial Planning</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Financial Planning"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <p className="text-xl font-medium text-blue-800">
              "The best time to start managing your finances was yesterday. The second best time is now. Begin with
              small steps and build lasting financial habits."
            </p>
          </div>
        </div>

        <QuickTemplateSelector />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/budget-planner" className="btn btn-primary text-center">
            Start Budget Planning
          </Link>
          <Link href="/expense-tracker" className="btn btn-secondary text-center">
            Track Your Expenses
          </Link>
          <Link href="/savings-calculator" className="btn btn-accent text-center">
            Calculate Savings Goals
          </Link>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      <section className="section">
        <h2 className="text-2xl font-bold mb-4">4. Financial Education Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">📚 Learning Materials</h3>
            <p className="text-gray-600 mb-3">
              Explore our comprehensive financial terms glossary and educational content.
            </p>
            <Link href="/financial-terms" className="btn btn-outline">
              View Financial Terms
            </Link>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">❓ Get Help</h3>
            <p className="text-gray-600 mb-3">
              Find answers to common questions about budgeting, saving, and financial planning.
            </p>
            <Link href="/faq" className="btn btn-outline">
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
