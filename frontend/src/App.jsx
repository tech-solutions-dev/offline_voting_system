import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;