import { getCurrentUser } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import QuickTemplateSelector from "@/components/quick-template-selector"
import DeploymentVerification from "@/components/deployment-verification"
import LandingPage from "@/components/landing-page"

export default async function Home() {
  const user = await getCurrentUser()

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />
  }

  // Show dashboard for authenticated users
  return (
    <div className="space-y-12">
      {/* Deployment Verification - Remove this in production */}
      <DeploymentVerification />

      <section className="section">
        <h2 className="text-2xl font-bold mb-4">1. My Start</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg">
              Welcome to your financial journey, {user.name}! You've taken the first step by creating an account. This
              site will help you track your progress as you build financial literacy. Let's navigate this journey
              together, one step at a time.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200"></div>

      <section className="section">
        <h2 className="text-2xl font-bold mb-4">2. Basic Learnings</h2>
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
        <h2 className="text-2xl font-bold mb-4">3. Next Steps</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Next Steps"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <p className="text-xl font-medium text-blue-800">
              "Track every single dirham you spend for one week. This simple act of awareness is your first step toward
              financial control."
            </p>
          </div>
        </div>

        <QuickTemplateSelector />

        <div className="mt-8 flex justify-center">
          <Link href="/expense-tracker" className="btn btn-primary">
            Start Tracking Expenses
          </Link>
        </div>
      </section>
    </div>
  )
}
