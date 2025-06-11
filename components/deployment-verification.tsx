"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Play, Globe } from "lucide-react"

type TestResult = {
  name: string
  status: "pending" | "running" | "success" | "error"
  message?: string
  duration?: number
}

export default function DeploymentVerification() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "pending" },
    { name: "Environment Variables", status: "pending" },
    { name: "User Registration", status: "pending" },
    { name: "User Authentication", status: "pending" },
    { name: "Session Management", status: "pending" },
    { name: "API Endpoints", status: "pending" },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"idle" | "running" | "success" | "error">("idle")

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, ...updates } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus("running")

    // Reset all tests
    setTests((prev) =>
      prev.map((test) => ({ ...test, status: "pending" as const, message: undefined, duration: undefined })),
    )

    try {
      // Test 1: Database Connection
      updateTest(0, { status: "running" })
      const dbStart = Date.now()
      try {
        const healthResponse = await fetch("/api/health")
        const healthData = await healthResponse.json()

        if (healthResponse.ok && healthData.database.healthy) {
          updateTest(0, {
            status: "success",
            message: `Connected (${healthData.database.latency}ms)`,
            duration: Date.now() - dbStart,
          })
        } else {
          updateTest(0, {
            status: "error",
            message: healthData.database.error || "Connection failed",
            duration: Date.now() - dbStart,
          })
        }
      } catch (error) {
        updateTest(0, {
          status: "error",
          message: "Health check failed",
          duration: Date.now() - dbStart,
        })
      }

      // Test 2: Environment Variables
      updateTest(1, { status: "running" })
      const envStart = Date.now()
      try {
        const envResponse = await fetch("/api/health")
        const envData = await envResponse.json()

        if (envData.environment) {
          updateTest(1, {
            status: "success",
            message: `${envData.environment.nodeEnv} on ${envData.environment.isVercel ? "Vercel" : "Local"}`,
            duration: Date.now() - envStart,
          })
        } else {
          updateTest(1, {
            status: "error",
            message: "Environment data missing",
            duration: Date.now() - envStart,
          })
        }
      } catch (error) {
        updateTest(1, {
          status: "error",
          message: "Environment check failed",
          duration: Date.now() - envStart,
        })
      }

      // Test 3: User Registration
      updateTest(2, { status: "running" })
      const regStart = Date.now()
      const testEmail = `test-${Date.now()}@example.com`
      try {
        const regResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: testEmail,
            password: "testpass123",
          }),
        })

        if (regResponse.ok) {
          updateTest(2, {
            status: "success",
            message: "Registration successful",
            duration: Date.now() - regStart,
          })
        } else {
          const regError = await regResponse.json()
          updateTest(2, {
            status: "error",
            message: regError.error || "Registration failed",
            duration: Date.now() - regStart,
          })
        }
      } catch (error) {
        updateTest(2, {
          status: "error",
          message: "Registration request failed",
          duration: Date.now() - regStart,
        })
      }

      // Test 4: User Authentication
      updateTest(3, { status: "running" })
      const authStart = Date.now()
      try {
        const authResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testEmail,
            password: "testpass123",
          }),
        })

        if (authResponse.ok) {
          updateTest(3, {
            status: "success",
            message: "Authentication successful",
            duration: Date.now() - authStart,
          })
        } else {
          const authError = await authResponse.json()
          updateTest(3, {
            status: "error",
            message: authError.error || "Authentication failed",
            duration: Date.now() - authStart,
          })
        }
      } catch (error) {
        updateTest(3, {
          status: "error",
          message: "Authentication request failed",
          duration: Date.now() - authStart,
        })
      }

      // Test 5: Session Management
      updateTest(4, { status: "running" })
      const sessionStart = Date.now()
      try {
        const logoutResponse = await fetch("/api/auth/logout", {
          method: "POST",
        })

        if (logoutResponse.ok) {
          updateTest(4, {
            status: "success",
            message: "Session management working",
            duration: Date.now() - sessionStart,
          })
        } else {
          updateTest(4, {
            status: "error",
            message: "Logout failed",
            duration: Date.now() - sessionStart,
          })
        }
      } catch (error) {
        updateTest(4, {
          status: "error",
          message: "Session test failed",
          duration: Date.now() - sessionStart,
        })
      }

      // Test 6: API Endpoints
      updateTest(5, { status: "running" })
      const apiStart = Date.now()
      try {
        const endpoints = ["/api/health", "/api/init-db"]
        let successCount = 0

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint)
            if (response.ok) successCount++
          } catch (error) {
            // Continue testing other endpoints
          }
        }

        if (successCount === endpoints.length) {
          updateTest(5, {
            status: "success",
            message: `All ${endpoints.length} endpoints working`,
            duration: Date.now() - apiStart,
          })
        } else {
          updateTest(5, {
            status: "error",
            message: `${successCount}/${endpoints.length} endpoints working`,
            duration: Date.now() - apiStart,
          })
        }
      } catch (error) {
        updateTest(5, {
          status: "error",
          message: "API test failed",
          duration: Date.now() - apiStart,
        })
      }

      // Determine overall status
      const finalTests = tests
      const hasErrors = finalTests.some((test) => test.status === "error")
      setOverallStatus(hasErrors ? "error" : "success")
    } catch (error) {
      console.error("Test suite error:", error)
      setOverallStatus("error")
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      case "success":
        return <CheckCircle size={16} className="text-green-600" />
      case "error":
        return <XCircle size={16} className="text-red-600" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
    }
  }

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case "success":
        return "from-green-50 to-green-100 border-green-200"
      case "error":
        return "from-red-50 to-red-100 border-red-200"
      case "running":
        return "from-blue-50 to-blue-100 border-blue-200"
      default:
        return "from-gray-50 to-gray-100 border-gray-200"
    }
  }

  return (
    <div className={`card bg-gradient-to-br ${getOverallStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-blue-600" />
          <h3 className="font-semibold">Deployment Verification</h3>
        </div>

        <button onClick={runTests} disabled={isRunning} className="btn btn-primary flex items-center gap-2">
          {isRunning ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Play size={16} />
          )}
          <span>{isRunning ? "Running Tests..." : "Run Tests"}</span>
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((test, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              {getStatusIcon(test.status)}
              <span className="font-medium">{test.name}</span>
            </div>

            <div className="text-right">
              {test.message && <div className="text-sm text-gray-600">{test.message}</div>}
              {test.duration && <div className="text-xs text-gray-500">{test.duration}ms</div>}
            </div>
          </div>
        ))}
      </div>

      {overallStatus === "success" && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle size={16} />
            <span className="font-medium">🎉 All systems operational! Your app is ready for production.</span>
          </div>
        </div>
      )}

      {overallStatus === "error" && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle size={16} />
            <span className="font-medium">⚠️ Some tests failed. Check the details above.</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        <p>🔧 This verification tests all critical deployment components</p>
        <p>🚀 Run this after each deployment to ensure everything works</p>
        <p>📊 Check response times and system health</p>
      </div>
    </div>
  )
}
