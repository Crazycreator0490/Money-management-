import { TrendingUp, Target, Award, Calendar } from "lucide-react"

export default function Progress() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Progress</h1>
        <p className="text-gray-600">Track your financial journey and celebrate your achievements.</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold text-blue-800">Learning Progress</h3>
              <p className="text-2xl font-bold text-blue-600">75%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center gap-3">
            <Target className="text-green-600" size={24} />
            <div>
              <h3 className="font-semibold text-green-800">Goals Set</h3>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center gap-3">
            <Award className="text-purple-600" size={24} />
            <div>
              <h3 className="font-semibold text-purple-800">Achievements</h3>
              <p className="text-2xl font-bold text-purple-600">5</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center gap-3">
            <Calendar className="text-orange-600" size={24} />
            <div>
              <h3 className="font-semibold text-orange-800">Days Active</h3>
              <p className="text-2xl font-bold text-orange-600">30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Milestones */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Learning Milestones</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-medium">Basic Financial Terms</h3>
              <p className="text-sm text-gray-600">Learned about budgeting, savings, and expenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-medium">Created First Budget</h3>
              <p className="text-sm text-gray-600">Successfully planned monthly income and expenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-medium">Expense Tracking</h3>
              <p className="text-sm text-gray-600">Track expenses for 7 consecutive days</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="font-medium">Savings Goal Achievement</h3>
              <p className="text-sm text-gray-600">Reach your first savings milestone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold text-yellow-800">First Steps</h3>
            <p className="text-sm text-yellow-600">Started your financial journey</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-blue-800">Budget Master</h3>
            <p className="text-sm text-blue-600">Created your first budget plan</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-green-800">Expense Tracker</h3>
            <p className="text-sm text-green-600">Logged your first expense</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-purple-800">Goal Setter</h3>
            <p className="text-sm text-purple-600">Set your first savings goal</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-red-800">Knowledge Seeker</h3>
            <p className="text-sm text-red-600">Read 10 financial terms</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 text-center opacity-50">
            <div className="text-3xl mb-2">🌟</div>
            <h3 className="font-semibold text-gray-600">Consistency Champion</h3>
            <p className="text-sm text-gray-500">Use the app for 30 days straight</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800">What's Next?</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <span className="text-indigo-700">Continue tracking your expenses daily</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <span className="text-indigo-700">Review and adjust your budget monthly</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <span className="text-indigo-700">Set up an emergency fund goal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              4
            </div>
            <span className="text-indigo-700">Learn about investment basics</span>
          </div>
        </div>
      </div>
    </div>
  )
}
