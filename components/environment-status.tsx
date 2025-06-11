"use client"

import { useState, useEffect } from "react"
import { Settings, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

type EnvironmentStatus = {
  status: string
  validation: {
    valid: boolean
    errors: string[]
    warnings: string[]
  }
  environment: {
    nodeEnv: string
    isVercel: boolean
    customKeyConfigured: boolean
    features: {
      useStrapi: boolean
      useUpscale: boolean
      useSupabase: boolean
    }
  }
  database: {
    healthy: boolean
    latency?: number
    error?: string
  }
}

export default function EnvironmentStatus() {
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [envData, setEnvData] = useState<EnvironmentStatus | null>(null)
  const [error, setError] = useState("")

  const checkEnvironment = async () => {
    setStatus("checking")
    setError("")

    try {
      const response = await fetch("/api/health")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setEnvData(data)
      } else {
        setStatus("error")
        setError(data.error || "Environment check failed")
        setEnvData(data)
      }
    } catch (err) {
      setStatus("error")
      setError("Failed to connect to health check endpoint")
      setEnvData(null)
    }
  }

  useEffect(() => {
    checkEnvironment()
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
    if (!envData) return "from-gray-50 to-gray-100 border-gray-200"

    if (envData.validation.valid && envData.database.healthy) {
      return "from-green-50 to-green-100 border-green-200"
    } else if (envData.validation.errors.length > 0 || !envData.database.healthy) {
      return "from-red-50 to-red-100 border-red-200"
    } else {
      return "from-yellow-50 to-yellow-100 border-yellow-200"
    }
  }

  return (
    <div className={`card bg-gradient-to-br ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        <Settings size={20} className="text-blue-600" />
        <h3 className="font-semibold">Environment Status</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={checkEnvironment}
            disabled={status === "checking"}
            className="btn btn-primary flex items-center gap-2"
          >
            {status === "checking" ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>Check Status</span>
          </button>

          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {status === "checking" && "Checking..."}
              {status === "success" && "Environment Ready"}
              {status === "error" && "Issues Detected"}
              {status === "idle" && "Ready to Check"}
            </span>
          </div>
        </div>

        {envData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Environment:</span>
                <span>{envData.environment.nodeEnv}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span>{envData.environment.isVercel ? "Vercel" : "Local"}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Key:</span>
                <span className={envData.environment.customKeyConfigured ? "text-green-600" : "text-red-600"}>
                  {envData.environment.customKeyConfigured ? "Configured" : "Missing"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Database:</span>
                <span className={envData.database.healthy ? "text-green-600" : "text-red-600"}>
                  {envData.database.healthy ? "Connected" : "Disconnected"}
                </span>
              </div>
              {envData.database.latency && (
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span>{envData.database.latency}ms</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Validation:</span>
                <span className={envData.validation.valid ? "text-green-600" : "text-red-600"}>
                  {envData.validation.valid ? "Valid" : "Invalid"}
                </span>
              </div>
            </div>
          </div>
        )}

        {envData?.validation.errors.length > 0 && (
          <div className="p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
            <strong>Errors:</strong>
            <ul className="list-disc list-inside mt-1">
              {envData.validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {envData?.validation.warnings.length > 0 && (
          <div className="p-2 bg-yellow-100 border border-yellow-200 rounded text-yellow-700 text-xs">
            <strong>Warnings:</strong>
            <ul className="list-disc list-inside mt-1">
              {envData.validation.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <p>🔧 Using KONLY environment variables with auto-detection</p>
        <p>🔒 Secure database connections with SSL encryption</p>
        <p>⚡ Optimized for Vercel deployment</p>
      </div>
    </div>
  )
}
