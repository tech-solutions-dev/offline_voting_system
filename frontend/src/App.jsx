import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import VoterLoginPage from "./pages/VoterLoginPage";
import GenerateVoterPassword from "./pages/GenerateVoterPassword";
import VoterPage from "./pages/VoterPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoterLoginPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/generate-password" element={<GenerateVoterPassword />} />
        <Route path="/vote" element={<VoterPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
