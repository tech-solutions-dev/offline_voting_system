"use client";
import { useState } from "react";

// Results and Printing Component
export function ResultsAndPrinting() {
  const [selectedElection, setSelectedElection] = useState("1");
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
  });

  const printResults = () => {
    window.print();
  };

  const printAllResults = () => {
    const printWindow = window.open("", "_blank");
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
              `
              )
              .join("")}
            </div>
          `
        )
        .join("")}
        </body>
      </html>
    `;
    printWindow.document.write(allResultsHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const exportResults = (format) => {
    alert(`Exporting results as ${format.toUpperCase()}...`);
  };

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
  );
}
