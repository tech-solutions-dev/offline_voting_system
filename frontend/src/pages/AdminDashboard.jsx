"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
              { id: "elections", label: "Election Config" },
              { id: "voters", label: "Voter Management" },
              { id: "agents", label: "Polling Agents" },
              { id: "time", label: "Time Adjustment" },
              { id: "monitoring", label: "Live Monitoring" },
              { id: "results", label: "Results & Printing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "elections" && <ElectionConfiguration />}
        {activeTab === "voters" && <VoterManagement />}
        {activeTab === "agents" && <PollingAgentsManagement />}
        {activeTab === "time" && <TimeAdjustment />}
        {activeTab === "monitoring" && <LiveMonitoring />}
        {activeTab === "results" && <ResultsAndPrinting />}
      </main>
    </div>
  )
}

// Election Configuration Component
function ElectionConfiguration() {
  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      name: "Student Council President",
      number: 1,
      maxCandidates: 1,
      candidates: [],
      votingRestriction: "general",
      restrictionDetails: {},
    },
    {
      id: 2,
      name: "Vice President",
      number: 2,
      maxCandidates: 1,
      candidates: [],
      votingRestriction: "general",
      restrictionDetails: {},
    },
    {
      id: 3,
      name: "Class Representative",
      number: 3,
      candidates: [],
      votingRestriction: "level",
      restrictionDetails: { level: "200" },
      maxCandidates: 3,
    },
  ])

  const [showPortfolioForm, setShowPortfolioForm] = useState(false)
  const [showCandidateForm, setShowCandidateForm] = useState({})
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    picture: null,
    portfolioId: null,
  })

  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    number: 1,
    maxCandidates: 1,
    votingRestriction: "general",
    restrictionDetails: {},
  })

  const addPortfolio = (e) => {
    e.preventDefault()
    const portfolio = {
      id: portfolios.length + 1,
      name: newPortfolio.name,
      number: Number.parseInt(newPortfolio.number),
      maxCandidates: Number.parseInt(newPortfolio.maxCandidates),
      votingRestriction: newPortfolio.votingRestriction,
      restrictionDetails: newPortfolio.restrictionDetails,
      candidates: [],
    }
    setPortfolios([...portfolios, portfolio])
    setNewPortfolio({
      name: "",
      number: 1,
      maxCandidates: 1,
      votingRestriction: "general",
      restrictionDetails: {},
    })
    setShowPortfolioForm(false)
  }

  const addCandidate = (portfolioId, candidateData) => {
    setPortfolios(
      portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            candidates: [
              ...portfolio.candidates,
              {
                id: portfolio.candidates.length + 1,
                name: candidateData.name,
                picture: candidateData.picture,
                votes: 0,
              },
            ],
          }
        }
        return portfolio
      }),
    )
  }

  const handleCandidateSubmit = (e, portfolioId) => {
    e.preventDefault()
    if (candidateForm.name.trim()) {
      addCandidate(portfolioId, {
        name: candidateForm.name,
        picture: candidateForm.picture,
      })
      setCandidateForm({ name: "", picture: null, portfolioId: null })
      setShowCandidateForm({ ...showCandidateForm, [portfolioId]: false })
    }
  }

  const handlePictureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCandidateForm({ ...candidateForm, picture: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCandidate = (portfolioId, candidateId) => {
    setPortfolios(
      portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            candidates: portfolio.candidates.filter((candidate) => candidate.id !== candidateId),
          }
        }
        return portfolio
      }),
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Election Configuration</h2>
        <button
          onClick={() => setShowPortfolioForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
        >
          Add Portfolio
        </button>
      </div>

      {showPortfolioForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Portfolio</h3>
          <form onSubmit={addPortfolio} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Name</label>
                <input
                  type="text"
                  required
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="e.g., Student Council President"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Number (Display Order)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newPortfolio.number}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, number: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Candidates</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={newPortfolio.maxCandidates}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, maxCandidates: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Who Can Vote</label>
              <select
                value={newPortfolio.votingRestriction}
                onChange={(e) =>
                  setNewPortfolio({
                    ...newPortfolio,
                    votingRestriction: e.target.value,
                    restrictionDetails: {},
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="general">All Students (General)</option>
                <option value="gender">Specific Gender</option>
                <option value="level">Specific Level</option>
                <option value="department">Specific Department</option>
                <option value="course_level">Specific Course at Level</option>
                <option value="hostel">Specific Hostel</option>
              </select>
            </div>

            {newPortfolio.votingRestriction === "gender" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      restrictionDetails: { gender: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            )}

            {newPortfolio.votingRestriction === "level" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <input
                  type="text"
                  placeholder="e.g., 200, 300, 400"
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      restrictionDetails: { level: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            )}

            {newPortfolio.votingRestriction === "department" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science, Engineering"
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      restrictionDetails: { department: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            )}

            {newPortfolio.votingRestriction === "course_level" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        restrictionDetails: {
                          ...newPortfolio.restrictionDetails,
                          department: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="text"
                    placeholder="e.g., 200, 300"
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        restrictionDetails: {
                          ...newPortfolio.restrictionDetails,
                          level: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            )}

            {newPortfolio.votingRestriction === "hostel" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Hostel</label>
                <input
                  type="text"
                  placeholder="e.g., Hostel A, Hostel B"
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      restrictionDetails: { hostel: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
              >
                Add Portfolio
              </button>
              <button
                type="button"
                onClick={() => setShowPortfolioForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios
          .sort((a, b) => a.number - b.number)
          .map((portfolio) => (
            <div key={portfolio.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{portfolio.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">#{portfolio.number}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Max candidates: {portfolio.maxCandidates}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Voting Access:</p>
                <p className="text-sm text-gray-600">
                  {portfolio.votingRestriction === "general" && "All Students"}
                  {portfolio.votingRestriction === "gender" &&
                    `${portfolio.restrictionDetails.gender || "Gender"} Only`}
                  {portfolio.votingRestriction === "level" &&
                    `Level ${portfolio.restrictionDetails.level || "N/A"} Only`}
                  {portfolio.votingRestriction === "department" &&
                    `${portfolio.restrictionDetails.department || "Department"} Only`}
                  {portfolio.votingRestriction === "course_level" &&
                    `${portfolio.restrictionDetails.department || "Department"} Level ${portfolio.restrictionDetails.level || "N/A"}`}
                  {portfolio.votingRestriction === "hostel" &&
                    `${portfolio.restrictionDetails.hostel || "Hostel"} Only`}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Candidates</h4>
                  <button
                    onClick={() => setShowCandidateForm({ ...showCandidateForm, [portfolio.id]: true })}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-500"
                  >
                    Add Candidate
                  </button>
                </div>

                {portfolio.candidates.length === 0 ? (
                  <p className="text-sm text-gray-500">No candidates added yet</p>
                ) : (
                  <div className="space-y-2">
                    {portfolio.candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        {candidate.picture ? (
                          <img
                            src={candidate.picture || "/placeholder.svg"}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">No Photo</span>
                          </div>
                        )}
                        <span className="flex-1 text-sm text-gray-700">{candidate.name}</span>
                        <button
                          onClick={() => removeCandidate(portfolio.id, candidate.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showCandidateForm[portfolio.id] && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-3">Add New Candidate</h5>
                    <form onSubmit={(e) => handleCandidateSubmit(e, portfolio.id)} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                        <input
                          type="text"
                          required
                          value={candidateForm.name}
                          onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Enter candidate name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Candidate Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePictureUpload}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {candidateForm.picture && (
                          <div className="mt-2">
                            <img
                              src={candidateForm.picture || "/placeholder.svg"}
                              alt="Preview"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-500"
                        >
                          Add Candidate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCandidateForm({ ...showCandidateForm, [portfolio.id]: false })
                            setCandidateForm({ name: "", picture: null, portfolioId: null })
                          }}
                          className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// Voter Management Component
function VoterManagement() {
  const [voters, setVoters] = useState([
    {
      id: 1,
      studentId: "STU001",
      name: "John Doe",
      email: "john@university.edu",
      level: "300",
      hostel: "Hostel A",
      gender: "male",
      department: "Computer Science",
      voted: true,
    },
    {
      id: 2,
      studentId: "STU002",
      name: "Jane Smith",
      email: "jane@university.edu",
      level: "200",
      hostel: "Hostel B",
      gender: "female",
      department: "Engineering",
      voted: false,
    },
    {
      id: 3,
      studentId: "STU003",
      name: "Mike Johnson",
      email: "mike@university.edu",
      level: "400",
      hostel: "Hostel C",
      gender: "male",
      department: "Mathematics",
      voted: true,
    },
  ])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate file processing
      alert(`File "${file.name}" uploaded successfully! Processing voters...`)
      // In real app, you would parse the CSV/Excel file here
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Voter Management</h2>
        <div className="flex space-x-3">
          <label className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 cursor-pointer">
            Upload Voter List
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          </label>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-500">
            Export List
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voting Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {voters.map((voter) => (
              <tr key={voter.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voter.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.hostel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{voter.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      voter.voted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {voter.voted ? "Voted" : "Not Voted"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Voting Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{voters.length}</div>
            <div className="text-sm text-blue-800">Total Voters</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{voters.filter((v) => v.voted).length}</div>
            <div className="text-sm text-green-800">Votes Cast</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{voters.filter((v) => !v.voted).length}</div>
            <div className="text-sm text-yellow-800">Pending Votes</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {((voters.filter((v) => v.voted).length / voters.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-800">Participation Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Polling Agents Management Component
function PollingAgentsManagement() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Agent Alpha", station: "Polling Station A", password: "alpha123", status: "active" },
    { id: 2, name: "Agent Beta", station: "Polling Station B", password: "beta456", status: "inactive" },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: "",
    station: "",
    password: "",
  })

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewAgent({ ...newAgent, password })
  }

  const createAgent = (e) => {
    e.preventDefault()
    const agent = {
      id: agents.length + 1,
      name: newAgent.name,
      station: newAgent.station,
      password: newAgent.password,
      status: "active",
    }
    setAgents([...agents, agent])
    setNewAgent({ name: "", station: "", password: "" })
    setShowCreateForm(false)
  }

  const deleteAgent = (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      setAgents(agents.filter((agent) => agent.id !== agentId))
    }
  }

  const deactivateAgent = (agentId) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: agent.status === "active" ? "inactive" : "active" } : agent,
      ),
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Polling Agents Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
        >
          Create New Agent
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">Create Polling Agent</h3>
          <form onSubmit={createAgent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Agent Name</label>
                <input
                  type="text"
                  required
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Polling Station</label>
                <input
                  type="text"
                  required
                  value={newAgent.station}
                  onChange={(e) => setNewAgent({ ...newAgent, station: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter station name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Agent password"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-500"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
              >
                Create Agent
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Polling Station
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.station}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{agent.password}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      agent.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Reset Password</button>
                  <button
                    onClick={() => deactivateAgent(agent.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    {agent.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => deleteAgent(agent.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Time Adjustment Component
function TimeAdjustment() {
  const [currentTime, setCurrentTime] = useState("2024-03-15T14:30")
  const [newEndTime, setNewEndTime] = useState("2024-03-15T16:00")
  const [showWarning, setShowWarning] = useState(false)

  const adjustTime = () => {
    if (window.confirm("Are you sure you want to adjust the election end time?")) {
      setCurrentTime(newEndTime)
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 5000)
      alert("Election end time updated successfully!")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Election Time Adjustment</h2>

      {showWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>⚠️ Election time has been adjusted. Voters and polling agents have been notified.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Election Schedule</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <p className="mt-1 text-gray-900">2024-03-15 08:00 AM</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current End Time</label>
                <p className="mt-1 text-gray-900">{new Date(currentTime).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Adjust End Time</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New End Time</label>
                <input
                  type="datetime-local"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">30 Minutes Warning</h4>
                <p className="text-sm text-blue-700">
                  The system will automatically notify all voters and polling agents 30 minutes before the new end time.
                </p>
              </div>
              <button
                onClick={adjustTime}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
              >
                Update Election Time
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Time Adjustment History</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">2024-03-15 10:00 AM</span>
            <span className="text-sm text-gray-600">End time extended by 2 hours</span>
            <span className="text-sm text-gray-600">Admin: John Doe</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">2024-03-15 09:30 AM</span>
            <span className="text-sm text-gray-600">End time set initially</span>
            <span className="text-sm text-gray-600">System</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Live Monitoring Component
function LiveMonitoring() {
  const [stats] = useState({
    totalVoters: 1500,
    votesCast: 1245,
    participationRate: 83,
    activeStations: 8,
    issuesReported: 3,
  })

  const [portfolioResults] = useState([
    {
      id: 1,
      name: "Student Council President",
      candidates: [
        { name: "John Smith", votes: 654, percentage: 52.5 },
        { name: "Sarah Johnson", votes: 591, percentage: 47.5 },
      ],
      totalVotes: 1245,
    },
    {
      id: 2,
      name: "Vice President",
      candidates: [
        { name: "Mike Davis", votes: 423, percentage: 34.0 },
        { name: "Lisa Brown", votes: 512, percentage: 41.1 },
        { name: "Tom Wilson", votes: 310, percentage: 24.9 },
      ],
      totalVotes: 1245,
    },
    {
      id: 3,
      name: "Class Representative",
      candidates: [
        { name: "Anna Lee", votes: 234, percentage: 18.8 },
        { name: "David Kim", votes: 345, percentage: 27.7 },
        { name: "Emma White", votes: 456, percentage: 36.6 },
        { name: "James Green", votes: 210, percentage: 16.9 },
      ],
      totalVotes: 1245,
    },
  ])

  const [liveResults] = useState([
    { time: "14:30", votes: 1245 },
    { time: "14:00", votes: 1100 },
    { time: "13:30", votes: 950 },
    { time: "13:00", votes: 800 },
    { time: "12:30", votes: 650 },
  ])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Monitoring Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalVoters}</div>
          <div className="text-sm text-blue-800">Total Voters</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{stats.votesCast}</div>
          <div className="text-sm text-green-800">Votes Cast</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.participationRate}%</div>
          <div className="text-sm text-purple-800">Participation</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.activeStations}</div>
          <div className="text-sm text-orange-800">Active Stations</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-red-600">{stats.issuesReported}</div>
          <div className="text-sm text-red-800">Issues</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Voting Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Voting Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-green-600 h-4 rounded-full" style={{ width: `${stats.participationRate}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">{stats.participationRate}% complete</p>
        </div>

        {/* Live Results Graph */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Live Results Trend</h3>
          <div className="flex items-end h-32 space-x-2">
            {liveResults.map((result, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-indigo-600 w-full rounded-t"
                  style={{ height: `${(result.votes / stats.totalVoters) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-1">{result.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {portfolioResults.map((portfolio) => (
          <div key={portfolio.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">{portfolio.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Total Votes: {portfolio.totalVotes}</p>

            <div className="space-y-3">
              {portfolio.candidates.map((candidate, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                    <span className="text-sm text-gray-600">
                      {candidate.votes} ({candidate.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-green-800">Polling Station A: 25 new votes</span>
            <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-blue-800">Polling Station C: System restart completed</span>
            <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <span className="text-sm text-yellow-800">Polling Station B: Low paper alert</span>
            <span className="text-xs text-gray-500 ml-auto">8 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Results and Printing Component
function ResultsAndPrinting() {
  const [selectedElection, setSelectedElection] = useState("1")
  const [results] = useState({
    elections: [
      {
        id: 1,
        name: "Student Council President",
        candidates: [
          { name: "John Smith", votes: 654, percentage: 52.5 },
          { name: "Sarah Johnson", votes: 591, percentage: 47.5 },
        ],
        totalVotes: 1245,
        invalidVotes: 12,
      },
      {
        id: 2,
        name: "Vice President",
        candidates: [
          { name: "Mike Davis", votes: 423, percentage: 34.0 },
          { name: "Lisa Brown", votes: 512, percentage: 41.1 },
          { name: "Tom Wilson", votes: 310, percentage: 24.9 },
        ],
        totalVotes: 1245,
        invalidVotes: 8,
      },
      {
        id: 3,
        name: "Class Representative",
        candidates: [
          { name: "Anna Lee", votes: 234, percentage: 18.8 },
          { name: "David Kim", votes: 345, percentage: 27.7 },
          { name: "Emma White", votes: 456, percentage: 36.6 },
          { name: "James Green", votes: 210, percentage: 16.9 },
        ],
        totalVotes: 1245,
        invalidVotes: 15,
      },
    ],
  })

  const printResults = () => {
    window.print()
  }

  const printAllResults = () => {
    const printWindow = window.open("", "_blank")
    const allResultsHTML = `
      <html>
        <head>
          <title>Complete Election Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .election { margin-bottom: 40px; page-break-inside: avoid; }
            .candidate { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .stats { display: flex; gap: 20px; margin: 20px 0; }
            .stat { text-align: center; padding: 10px; background: #f5f5f5; }
            @media print { .election { page-break-after: always; } }
          </style>
        </head>
        <body>
          <h1>Complete Election Results - ${new Date().toLocaleDateString()}</h1>
          ${results.elections
            .map(
              (election) => `
            <div class="election">
              <h2>${election.name}</h2>
              <div class="stats">
                <div class="stat">
                  <strong>${election.totalVotes}</strong><br>
                  Total Valid Votes
                </div>
                <div class="stat">
                  <strong>${election.invalidVotes}</strong><br>
                  Invalid Votes
                </div>
              </div>
              ${election.candidates
                .map(
                  (candidate) => `
                <div class="candidate">
                  <strong>${candidate.name}</strong>: ${candidate.votes} votes (${candidate.percentage}%)
                </div>
              `,
                )
                .join("")}
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `
    printWindow.document.write(allResultsHTML)
    printWindow.document.close()
    printWindow.print()
  }

  const exportResults = (format) => {
    alert(`Exporting results as ${format.toUpperCase()}...`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Results & Printing</h2>
        <div className="flex space-x-3">
          <button
            onClick={printResults}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500"
          >
            Print Current
          </button>
          <button
            onClick={printAllResults}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-500"
          >
            Print All Results
          </button>
          <select
            onChange={(e) => exportResults(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Export As...</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Select Election:</label>
          <select
            value={selectedElection}
            onChange={(e) => setSelectedElection(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="1">Student Council President</option>
            <option value="2">Vice President</option>
            <option value="3">Class Representative</option>
          </select>
        </div>

        {results.elections
          .filter((election) => election.id === Number.parseInt(selectedElection))
          .map((election) => (
            <div key={election.id} className="print:break-inside-avoid">
              <h3 className="text-xl font-semibold mb-4 text-center">{election.name} - Official Results</h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-gray-900">{election.totalVotes}</div>
                  <div className="text-sm text-gray-600">Total Valid Votes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-gray-900">{election.invalidVotes}</div>
                  <div className="text-sm text-gray-600">Invalid Votes</div>
                </div>
              </div>

              <div className="space-y-4">
                {election.candidates.map((candidate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{candidate.name}</span>
                      <span className="text-sm text-gray-600">
                        {candidate.votes} votes ({candidate.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full"
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> These are preliminary results. Final results will be certified after all votes
                  are verified.
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Result Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400">
            <div className="text-gray-400 mb-2">📄</div>
            <div className="text-sm text-gray-600">Generate Winner Certificate</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400">
            <div className="text-gray-400 mb-2">📊</div>
            <div className="text-sm text-gray-600">Full Results Report</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400">
            <div className="text-gray-400 mb-2">📋</div>
            <div className="text-sm text-gray-600">Audit Trail Report</div>
          </button>
        </div>
      </div>
    </div>
  )
}
