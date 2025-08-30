"use client"

import { useState, useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("elections")
  const [timeWarning, setTimeWarning] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/")
  }

  // Simulate time warning for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeWarning(true)
    }, 2000) // Show warning after 2 seconds for demo
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-4 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Online</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Time Warning Banner */}
      {timeWarning && (
        <div className="bg-yellow-500 text-white text-center py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            ⚠️ Election will end in 30 minutes. Please prepare for closing procedures.
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "elections", label: "Election Config", href: "/admin" },
              { id: "voters", label: "Voter Management", href: "/admin/voter-management" },
              { id: "agents", label: "Polling Agents", href: "/admin/polling-agents-management" },
              { id: "time", label: "Time Adjustment", href: "/admin/time-adjustment" },
              { id: "monitoring", label: "Live Monitoring", href: "/admin/live-monitoring" },
              { id: "results", label: "Results & Printing", href: "/admin/results-and-printing" },
            ].map((tab) => (
              <Link
                key={tab.id}
                to={tab.href}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}


