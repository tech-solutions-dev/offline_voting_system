import {useState} from "react";
import { Modal } from "../../components/shared/Modal";
export function ElectionConfiguration() {
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
        <Modal isOpen={showPortfolioForm} onClose={() => setShowPortfolioForm(false)} title="Add New Portfolio">
        <div className="bg-white p-6 mb-6">
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
        </Modal>
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
                  <Modal
                    isOpen={showCandidateForm[portfolio.id]}
                    onClose={() => {
                      setShowCandidateForm({ ...showCandidateForm, [portfolio.id]: false })
                      setCandidateForm({ name: "", picture: null, portfolioId: null })
                    }}
                    title={`Add Candidate to ${portfolio.name}`}
                  >
                  <div className="mt-4 p-4 bg-white rounded-lg">
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
                  </Modal>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}