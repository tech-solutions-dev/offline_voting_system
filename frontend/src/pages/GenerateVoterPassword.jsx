import React, { useState } from "react";
import { toast } from "react-toastify";

export default function GenerateVoterPassword() {
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState(null);
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSearch = async () => {
    if (!studentId) {
      toast.error("Please enter a Student ID");
      return;
    }

    try {
      setLoading(true);
      setOtp(null);
      setVoter(null);

      // Simulate voter lookup
      setTimeout(() => {
        const randomPassword = generateRandomPassword();

        setVoter({ student_id: studentId });
        setOtp(randomPassword);

        toast.success("Random password generated!");
        setLoading(false);
      }, 1000); // fake delay
    } catch (error) {
      console.error(error);
      toast.error("Error generating password");
      setLoading(false);
    }
  };

  // Copy password to clipboard
  const handleCopy = () => {
    if (otp) {
      navigator.clipboard.writeText(otp);
      toast.info("Password copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg shadow-xl rounded-2xl bg-white p-6 space-y-6">
        <h2 className="text-xl font-bold text-center">
          Generate Voter Password
        </h2>

        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter Student ID"
            className="flex-1 border rounded-lg px-3 py-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Results */}
        {voter && otp && (
          <div className="p-4 border rounded-xl bg-gray-50 mt-4 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Student ID:</p>
              <p className="font-semibold">{voter.student_id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Generated Password:</p>
              <div className="flex items-center space-x-3">
                <p className="font-bold text-lg text-green-700">{otp}</p>
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
