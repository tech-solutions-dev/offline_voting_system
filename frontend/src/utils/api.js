import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use the same token key used by auth utilities
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("election_token");
    if (token) {
      // Django TokenAuthentication expects "Token <token>"
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    const message = error.response?.data?.non_field_errors || error.response?.data?.error || "An error occurred";
    const url = error.config?.url || "";
    const isAuthRoute = url.includes("auth/login") || url.includes("auth/voter_login");

    if (!isAuthRoute) {
      if (error.response?.status === 401) {
        localStorage.removeItem("election_token");
        localStorage.removeItem("user");
        // Redirect to root (voter login) or admin login depending on path
        window.location.href = "/";
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access forbidden. You do not have permission.");
      } else if (error.response?.status === 404) {
        toast.error("Resource not found.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
