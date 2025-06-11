"use client"

import { useState } from "react"
import { UserPlus, CheckCircle, XCircle } from "lucide-react"

export default function AddSpecificUser() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const addUser = async () => {
    setStatus("loading")
    try {
      const response = await fetch("/api/admin/add-user", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to add user")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while adding the user")
    }
  }

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
      <div className="flex items-center gap-3 mb-3">
        <UserPlus size={20} className="text-blue-600" />
        <h3 className="font-semibold text-blue-800">Add Specific User</h3>
      </div>

      <div className="mb-3">
        <p className="text-sm text-blue-700">
          Add user with email: <strong>jinuthomas6985@gmail.com</strong>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={addUser}
          disabled={status === "loading" || status === "success"}
          className={`btn ${status === "success" ? "bg-green-500 hover:bg-green-600" : "btn-primary"} flex items-center gap-2`}
        >
          {status === "loading" ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : status === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <UserPlus size={16} />
          )}
          <span>{status === "loading" ? "Adding..." : status === "success" ? "Added" : "Add User"}</span>
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={16} />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </div>
    </div>
  )
}
