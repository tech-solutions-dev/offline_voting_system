import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";

//Voters Routes
import VoterLoginPage from "./pages/voters/VoterLoginPage";
import GenerateVoterPassword from "./pages/poll/GenerateVoterPassword";
import VoterPage from "./pages/voters/VoterPage";

//Admin Routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import { PollingAgentsManagement } from "./pages/admin/PollingAgentsManagement"
import { TimeAdjustment } from "./pages/admin/TimeAdjustment"
import { ResultsAndPrinting } from "./pages/admin/ResultsAndPrinting"
import { LiveMonitoring } from "./pages/admin/LiveMonitoring"
import { ElectionConfiguration } from "./pages/admin/ElectionConfiguration"
import { VoterManagement } from "./pages/admin/VoterManagement"

//Super-admin Routes
import SuperAdminDashboard from "./pages/super/SuperAdminDashboard";
import { AdminUserManagement } from "./pages/super/AdminUserManagement";
import { SystemSettings } from "./pages/super/SystemSettings";
import { GlobalResultsView } from "./pages/super/GlobalResultsView";
import { ElectionManagement } from "./pages/super/ElectionManagement";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoterLoginPage />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Polling Agents */}
        <Route element={<PrivateRoute allowedRoles={["polling_agent"]} />}>
          <Route path="/generate-password" element={<GenerateVoterPassword />} />
        </Route>

        {/* Voters Routes */}
        <Route element={<PrivateRoute allowedRoles={["voter"]} />}>
          <Route path="/vote" element={<VoterPage />} />
        </Route>

        {/* Super Admin */}
        <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />}>
            <Route index element={<ElectionManagement />} />
            <Route path="admin-user-management" element={<AdminUserManagement />} />
            <Route path="system-settings" element={<SystemSettings />} />
            <Route path="global-results-view" element={<GlobalResultsView />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="voter-management" element={<VoterManagement />} />
            <Route index element={<ElectionConfiguration />} />
            <Route path="polling-agents-management" element={<PollingAgentsManagement />} />
            <Route path="time-adjustment" element={<TimeAdjustment />} />
            <Route path="results-and-printing" element={<ResultsAndPrinting />} />
            <Route path="live-monitoring" element={<LiveMonitoring />} />
          </Route>
        </Route>
        <Route path="*" element={<h1>YOUR PAGE IS NOT FOUND. SORRY THIS IS INTENTIONAL</h1>} />
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
