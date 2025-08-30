"use client";
import { useState } from "react";
import { Modal } from "../../components/shared/Modal";

// Election Configuration Component
// Polling Agents Management Component
export function PollingAgentsManagement() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Agent Alpha", station: "Polling Station A", password: "alpha123", status: "active" },
    { id: 2, name: "Agent Beta", station: "Polling Station B", password: "beta456", status: "inactive" },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    station: "",
    password: "",
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewAgent({ ...newAgent, password });
  };

  const createAgent = (e) => {
    e.preventDefault();
    const agent = {
      id: agents.length + 1,
      name: newAgent.name,
      station: newAgent.station,
      password: newAgent.password,
      status: "active",
    };
    setAgents([...agents, agent]);
    setNewAgent({ name: "", station: "", password: "" });
    setShowCreateForm(false);
  };

  const deleteAgent = (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      setAgents(agents.filter((agent) => agent.id !== agentId));
    }
  };

  const deactivateAgent = (agentId) => {
    setAgents(
      agents.map((agent) => agent.id === agentId ? { ...agent, status: agent.status === "active" ? "inactive" : "active" } : agent
      )
    );
  };

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
        <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="Create Polling Agent">
        <div className="bg-white p-6">
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
                  placeholder="Enter agent name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Polling Station</label>
                <input
                  type="text"
                  required
                  value={newAgent.station}
                  onChange={(e) => setNewAgent({ ...newAgent, station: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter station name" />
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
                  placeholder="Agent password" />
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
      </Modal>
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
                    className={`px-2 py-1 text-xs rounded-full ${agent.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
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
  );
}
