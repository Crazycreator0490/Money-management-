"use client"

import { useState, useEffect } from "react"
import { Database, CheckCircle, XCircle, RefreshCw, Zap, AlertTriangle } from "lucide-react"

type HealthStatus = {
  status: "healthy" | "unhealthy" | "error"
  timestamp: string
  responseTime: number
  database: {
    healthy: boolean
    latency?: number
    error?: string
  }
  environment: {
    nodeEnv: string
    isVercel: boolean
    vercelEnv?: string
  }
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [error, setError] = useState("")

  const checkHealth = async () => {
    setStatus("checking")
    setError("")

    try {
      const response = await fetch("/api/health")
      const data = await response.json()

      if (response.ok && data.status === "healthy") {
        setStatus("success")
        setHealthData(data)
      } else {
        setStatus("error")
        setError(data.error || data.database?.error || "Health check failed")
        setHealthData(data)
      }
    } catch (err) {
      setStatus("error")
      setError("Failed to connect to health check endpoint")
      setHealthData(null)
    }
  }

  // Auto-check on mount
  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <RefreshCw size={16} className="animate-spin text-blue-600" />
      case "success":
        return <CheckCircle size={16} className="text-green-600" />
      case "error":
        return <XCircle size={16} className="text-red-600" />
      default:
        return <AlertTriangle size={16} className="text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "from-green-50 to-green-100 border-green-200"
      case "error":
        return "from-red-50 to-red-100 border-red-200"
      case "checking":
        return "from-blue-50 to-blue-100 border-blue-200"
      default:
        return "from-gray-50 to-gray-100 border-gray-200"
    }
  }

  return (
    <div className={`card bg-gradient-to-br ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-green-600" />
          <Database size={20} className="text-green-600" />
        </div>
        <h3 className="font-semibold">System Health Status</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={checkHealth}
            disabled={status === "checking"}
            className="btn btn-primary flex items-center gap-2"
          >
            {status === "checking" ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>Check Health</span>
          </button>

          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {status === "checking" && "Checking..."}
              {status === "success" && "All Systems Operational"}
              {status === "error" && "Issues Detected"}
              {status === "idle" && "Ready to Check"}
            </span>
          </div>
        </div>

        {healthData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Database:</span>
                <span className={healthData.database.healthy ? "text-green-600" : "text-red-600"}>
                  {healthData.database.healthy ? "Connected" : "Disconnected"}
                </span>
              </div>
              {healthData.database.latency && (
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span>{healthData.database.latency}ms</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span>{healthData.responseTime}ms</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Environment:</span>
                <span>{healthData.environment.nodeEnv}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span>{healthData.environment.isVercel ? "Vercel" : "Local"}</span>
              </div>
              {healthData.environment.vercelEnv && (
                <div className="flex justify-between">
                  <span>Vercel Env:</span>
                  <span>{healthData.environment.vercelEnv}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <p>✨ Neon serverless PostgreSQL with automatic scaling</p>
        <p>🔒 Secure connections with SSL encryption</p>
        <p>⚡ Connection pooling and edge optimization</p>
      </div>
    </div>
  )
}
