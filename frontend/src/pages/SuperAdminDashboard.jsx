import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("elections");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "elections", label: "Election Management" },
              { id: "admins", label: "Admin Users" },
              { id: "settings", label: "System Settings" },
              { id: "results", label: "Global Results" }
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
        {activeTab === "elections" && <ElectionManagement />}
        {activeTab === "admins" && <AdminUserManagement />}
        {activeTab === "settings" && <SystemSettings />}
        {activeTab === "results" && <GlobalResultsView />}
      </main>
    </div>
  );
}

// Election Management Component
function ElectionManagement() {
  const [elections, setElections] = useState([
    { id: 1, name: "Student Council 2025", status: "active", candidates: 4, votes: 1245 },
    { id: 2, name: "Class Representatives", status: "upcoming", candidates: 8, votes: 0 }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newElection, setNewElection] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const handleCreateElection = (e) => {
    e.preventDefault();
    const election = {
      id: elections.length + 1,
      name: newElection.name,
      status: "upcoming",
      candidates: 0,
      votes: 0
    };
    setElections([...elections, election]);
    setNewElection({ name: "", description: "", startDate: "", endDate: "" });
    setShowCreateForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Election Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
        >
          Create New Election
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">Create New Election</h3>
          <form onSubmit={handleCreateElection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Election Name</label>
              <input
                type="text"
                required
                value={newElection.name}
                onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter election name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newElection.description}
                onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
                placeholder="Enter election description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  required
                  value={newElection.startDate}
                  onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  required
                  value={newElection.endDate}
                  onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
              >
                Create Election
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
                Election Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Votes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {elections.map((election) => (
              <tr key={election.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {election.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    election.status === 'active' ? 'bg-green-100 text-green-800' :
                    election.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {election.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {election.candidates}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {election.votes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Admin User Management Component
function AdminUserManagement() {
  const [admins, setAdmins] = useState([
    { id: 1, name: "John Doe", email: "john@university.edu", role: "Election Admin (EC)", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@university.edu", role: "Polling Agent", status: "inactive" }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Election Admin (EC)",
    password: ""
  });

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    const admin = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: "active"
    };
    setAdmins([...admins, admin]);
    setNewAdmin({ name: "", email: "", role: "Election Admin", password: "" });
    setShowCreateForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin User Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
        >
          Create New Admin
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">Create New Admin User</h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Election Admin">Election Admin (EC)</option>
                  <option value="Polling Agent">Polling Agent</option>
                  <option value="System Admin">System Admin (Super Admin)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Set temporary password"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
              >
                Create Admin
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
                Admin Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// System Settings Component
function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: "University Voting System",
    maxVotesPerStudent: 1,
    resultsVisibility: "after_election",
    notificationEmails: true,
    maintenanceMode: false
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">System Name</label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Votes Per Student</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.maxVotesPerStudent}
              onChange={(e) => setSettings({ ...settings, maxVotesPerStudent: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Results Visibility</label>
            <select
              value={settings.resultsVisibility}
              onChange={(e) => setSettings({ ...settings, resultsVisibility: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="during_election">During Election (Live)</option>
              <option value="after_election">After Election Ends</option>
              <option value="manual">Manual Release</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificationEmails"
              checked={settings.notificationEmails}
              onChange={(e) => setSettings({ ...settings, notificationEmails: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="notificationEmails" className="ml-2 block text-sm text-gray-900">
              Send Notification Emails
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Maintenance Mode
            </label>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

// Global Results View Component
function GlobalResultsView() {
  const [selectedElection, setSelectedElection] = useState("all");
  const [results] = useState({
    overall: {
      totalVoters: 5000,
      votesCast: 3245,
      participationRate: 64.9
    },
    elections: [
      {
        id: 1,
        name: "Student Council 2025",
        candidates: [
          { name: "John Smith", votes: 1245, percentage: 38.4 },
          { name: "Sarah Johnson", votes: 987, percentage: 30.4 },
          { name: "Mike Brown", votes: 654, percentage: 20.1 },
          { name: "Emily Davis", votes: 359, percentage: 11.1 }
        ]
      }
    ]
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Global Results View</h2>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="all">All Elections</option>
          <option value="1">Student Council 2025</option>
        </select>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-indigo-600">{results.overall.totalVoters}</div>
          <div className="text-sm text-gray-600">Total Registered Voters</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-green-600">{results.overall.votesCast}</div>
          <div className="text-sm text-gray-600">Total Votes Cast</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600">{results.overall.participationRate}%</div>
          <div className="text-sm text-gray-600">Participation Rate</div>
        </div>
      </div>

      {/* Election Results */}
      {results.elections.map((election) => (
        <div key={election.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">{election.name}</h3>
          <div className="space-y-4">
            {election.candidates.map((candidate, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{candidate.name}</span>
                  <span className="text-sm text-gray-600">
                    {candidate.votes} votes ({candidate.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${candidate.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}