import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(`${BASE_URL}api/auth/login/`, formData);

      if (response.status === 200) {
        const { token, role } = response.data.user;

        if (!token || !role) {
          toast.error("Invalid server response");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "superadmin") {
          navigate("/super-admin");
        } else {
          navigate("/generate-password");
        }

        toast.success("Login successful");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || "Invalid credentials or server error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-blue-100 mt-1 text-sm">
            Sign in to manage the election system
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-75"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
