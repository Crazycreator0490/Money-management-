import Link from "next/link"
import { ArrowRight, Shield, Zap, Globe, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
          My Financial Journey
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Start your path to financial literacy. Learn, track, and grow your money management skills step by step.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2">
            <span>Start Your Journey</span>
            <ArrowRight size={20} />
          </Link>
          <Link href="/auth/login" className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-lg px-8 py-3">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
          <p className="text-gray-600">
            Your financial data is encrypted and secure. We use industry-standard security practices to protect your
            information.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
          <p className="text-gray-600">
            Simple, intuitive tools designed for beginners. Start tracking expenses and building budgets in minutes.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Always Available</h3>
          <p className="text-gray-600">
            Access your financial tools anywhere, anytime. Cloud-based platform with 99.9% uptime guarantee.
          </p>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">What You'll Learn</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Budget Planning</h4>
                <p className="text-sm text-gray-600">Create and manage monthly budgets with pre-built templates</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Expense Tracking</h4>
                <p className="text-sm text-gray-600">Monitor daily spending and categorize expenses</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Savings Goals</h4>
                <p className="text-sm text-gray-600">Set and track progress toward financial goals</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Financial Terms</h4>
                <p className="text-sm text-gray-600">Learn essential financial vocabulary and concepts</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Progress Tracking</h4>
                <p className="text-sm text-gray-600">Monitor your financial literacy journey</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Expert Guidance</h4>
                <p className="text-sm text-gray-600">Access FAQs and financial tips from experts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Join thousands of users who have started their financial journey with us.
        </p>

        <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
          <span>Get Started Free</span>
          <ArrowRight size={20} />
        </Link>

        <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever • Secure & private</p>
      </section>
    </div>
  )
}
