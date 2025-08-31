import { useState, useEffect } from "react";
import { Modal } from "../../components/shared/Modal";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { fetchElections } from "../../utils/utils";

export function ElectionConfiguration() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elections, setElections] = useState([]);

  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState({});
  const [candidateForm, setCandidateForm] = useState({
    cand_fname: "",
    ballot_num: "",
    profile_picture: null,
    portfolioId: null,
    election: null,
  });

  const [newPortfolio, setNewPortfolio] = useState({
    port_name: "",
    port_priority: 1,
    level_restriction: null,
    gender_restriction: null,
    department_restriction: null,
    election: null,
  });

  // Fetch elections and portfolios
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchElections();
        setElections(data);
        if (data.length > 0) {
          setNewPortfolio((prev) => ({ ...prev, election: data[0].id }));
          setCandidateForm((prev) => ({ ...prev, election: data[0].id }));
        }
      } catch (err) {
        toast.error("Failed to fetch elections");
      }
    };
    loadElections();
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await api.get("api/elections/portfolios/");
      setPortfolios(response.data.results);
    } catch (err) {
      toast.error(err.message || "Failed to load portfolios");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPortfolio = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/elections/portfolios/", newPortfolio);
      setPortfolios([...portfolios, res.data]);
      setNewPortfolio({
        port_name: "",
        port_priority: 1,
        level_restriction: null,
        gender_restriction: null,
        department_restriction: null,
        election: elections.length > 0 ? elections[0].id : null,
      });
      setShowPortfolioForm(false);
      toast.success("Portfolio added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add portfolio");
      setError(err.message);
    }
  };

  const addCandidate = async (portfolioId, candidateData) => {
    try {
      const formData = new FormData();
      formData.append("cand_fname", candidateData.cand_fname);
      formData.append("portfolio", portfolioId);
      formData.append("election", Number(candidateData.election));
      formData.append("ballot_num", Number(candidateData.ballot_num));

      if (candidateData.profile_picture) {
        formData.append("profile_picture", candidateData.profile_picture);
      }

      const res = await api.post("api/elections/candidates/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                candidates: [...(portfolio.candidates || []), res.data],
              }
            : portfolio
        )
      );
      toast.success("Candidate added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add candidate");
      setError(err.message);
    }
  };

  const handleCandidateSubmit = async (e, portfolioId) => {
    e.preventDefault();
    if (candidateForm.cand_fname.trim()) {
      try {
        await addCandidate(portfolioId, candidateForm);
        setCandidateForm({
          cand_fname: "",
          ballot_num: "",
          profile_picture: null,
          portfolioId: null,
          election: elections.length > 0 ? elections[0].id : null,
        });
        setShowCandidateForm({ ...showCandidateForm, [portfolioId]: false });
      } catch (err) {
        toast.error(err.message || "Error adding candidate");
      }
    }
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCandidateForm({ ...candidateForm, profile_picture: file });
    }
  };

  const removeCandidate = async (portfolioId, candidateId) => {
    try {
      await api.delete(`api/elections/candidates/${candidateId}/`);
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                candidates: portfolio.candidates.filter(
                  (candidate) => candidate.id !== candidateId
                ),
              }
            : portfolio
        )
      );
      toast.success("Candidate removed successfully");
    } catch (err) {
      toast.error(err.message || "Failed to remove candidate");
      setError(err.message);
    }
  };

  // Restriction display
  const getRestrictionDisplay = (portfolio) => {
    if (portfolio.level_restriction)
      return `Level ${portfolio.level_restriction} Only`;
    if (portfolio.gender_restriction)
      return `${portfolio.gender_restriction} Only`;
    if (portfolio.department_restriction)
      return `${portfolio.department_restriction} Only`;
    return "All Students";
  };

  if (loading) return <div>Loading portfolios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Election Configuration
        </h2>
        <button
          onClick={() => setShowPortfolioForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
        >
          Add Portfolio
        </button>
      </div>

      {/* Portfolio form modal */}
      {showPortfolioForm && (
        <Modal
          isOpen={showPortfolioForm}
          onClose={() => setShowPortfolioForm(false)}
          title="Add New Portfolio"
        >
          <div className="bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Portfolio</h3>
            <form onSubmit={addPortfolio} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Portfolio Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPortfolio.port_name}
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        port_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g., Student Council President"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Portfolio Priority (Display Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPortfolio.port_priority}
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        port_priority: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign to Election
                  </label>
                  <select
                    value={newPortfolio.election || ""}
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        election: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">-- Select Election --</option>
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>
                        {election.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Restriction options */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Voting Restrictions
                </label>
                <select
                  onChange={(e) => {
                    const restrictionType = e.target.value;
                    setNewPortfolio({
                      ...newPortfolio,
                      level_restriction:
                        restrictionType === "level" ? "" : null,
                      gender_restriction:
                        restrictionType === "gender" ? "" : null,
                      department_restriction:
                        restrictionType === "department" ? "" : null,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">All Students (No Restrictions)</option>
                  <option value="level">Level Restriction</option>
                  <option value="gender">Gender Restriction</option>
                  <option value="department">Department Restriction</option>
                </select>
              </div>

              {newPortfolio.level_restriction !== null && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <input
                    type="text"
                    value={newPortfolio.level_restriction || ""}
                    placeholder="e.g., 200, 300, 400"
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        level_restriction: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              )}

              {newPortfolio.gender_restriction !== null && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    value={newPortfolio.gender_restriction || ""}
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        gender_restriction: e.target.value,
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

              {newPortfolio.department_restriction !== null && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newPortfolio.department_restriction || ""}
                    placeholder="e.g., Computer Science, Engineering"
                    onChange={(e) =>
                      setNewPortfolio({
                        ...newPortfolio,
                        department_restriction: e.target.value,
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

      {/* Portfolio cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios
          .sort((a, b) => a.port_priority - b.port_priority)
          .map((portfolio) => (
            <div
              key={portfolio.port_id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{portfolio.port_name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {portfolio.port_priority}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Voting Access:
                </p>
                <p className="text-sm text-gray-600">
                  {getRestrictionDisplay(portfolio)}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Election Name:{" "}
                  {elections.find((e) => e.id === portfolio.election)?.title}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Candidates</h4>
                  <button
                    onClick={() =>
                      setShowCandidateForm({
                        ...showCandidateForm,
                        [portfolio.port_id]: true,
                      })
                    }
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-500"
                  >
                    Add Candidate
                  </button>
                </div>

                {!portfolio.candidates || portfolio.candidates.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No candidates added yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {portfolio.candidates.map((candidate) => (
                      <div
                        key={candidate.port_id}
                        className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                      >
                        {candidate.profile_picture ? (
                          <img
                            src={
                              candidate.profile_picture || "/placeholder.svg"
                            }
                            alt={candidate.cand_fname}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">
                              No Photo
                            </span>
                          </div>
                        )}
                        <span className="flex-1 text-sm text-gray-700">
                          {candidate.cand_fname}
                        </span>
                        <button
                          onClick={() =>
                            removeCandidate(portfolio.port_id, candidate.id)
                          }
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showCandidateForm[portfolio.port_id] && (
                  <Modal
                    isOpen={showCandidateForm[portfolio.port_id]}
                    onClose={() => {
                      setShowCandidateForm({
                        ...showCandidateForm,
                        [portfolio.port_id]: false,
                      });
                      setCandidateForm({
                        cand_fname: "",
                        ballot_num: "",
                        profile_picture: null,
                        portfolioId: null,
                        election: elections.length > 0 ? elections[0].id : null,
                      });
                    }}
                    title={`Add Candidate to ${portfolio.port_name}`}
                  >
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <h5 className="font-medium mb-3">Add New Candidate</h5>
                      <form
                        onSubmit={(e) =>
                          handleCandidateSubmit(e, portfolio.port_id)
                        }
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Candidate Name
                          </label>
                          <input
                            type="text"
                            required
                            value={candidateForm.cand_fname}
                            onChange={(e) =>
                              setCandidateForm({
                                ...candidateForm,
                                cand_fname: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Enter candidate name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ballot Number
                          </label>
                          <input
                            type="number"
                            required
                            value={candidateForm.ballot_num}
                            onChange={(e) =>
                              setCandidateForm({
                                ...candidateForm,
                                ballot_num: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Enter ballot number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Candidate Picture
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePictureUpload}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {candidateForm.profile_picture && (
                            <div className="mt-2">
                              <img
                                src={URL.createObjectURL(
                                  candidateForm.profile_picture
                                )}
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
                              setShowCandidateForm({
                                ...showCandidateForm,
                                [portfolio.id]: false,
                              });
                              setCandidateForm({
                                cand_fname: "",
                                ballot_num: "",
                                profile_picture: null,
                                portfolioId: null,
                                election:
                                  elections.length > 0 ? elections[0].id : null,
                              });
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
  );
}
