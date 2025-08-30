import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(token);
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
    const message = error.response?.data?.error || "An error occurred";
    const isAuthRoute =
      error.config.url.includes("api/auth/login") ||
      error.config.url.includes("api/auth/voter_login");

    if (!isAuthRoute) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
