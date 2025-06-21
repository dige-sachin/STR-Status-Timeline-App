import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

import ProjectTimeline from "./Pages/ProjectTimeline";
import withLayout from "./WithLayout";
import AddProject from "./Pages/AddProject";
import Header from "./Pages/Header";
import AdminLogin from "./Pages/AdminLogin";
import ViewProject from "./Pages/ViewProject";
import api from "./hooks/Api";
import { loggingOut } from "./utils/helpers";

function AppContent() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const refresh = async (shouldUpdateLoginTime = false) => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    try {
      const newAccessToken = await api.adminRefreshToken({
        refresh_token: refreshToken,
      });

      localStorage.setItem("access_token", newAccessToken);

      if (shouldUpdateLoginTime) {
        localStorage.setItem("login_time", Date.now().toString());
      }
    } catch (err) {
      console.error("❌ Token refresh failed:", err?.response || err);
      loggingOut();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("login_time");
      if (!loginTime) return;

      const currentTime = Date.now();
      const loginTimeValue = parseInt(loginTime, 10);
      const diffInMinutes = (currentTime - loginTimeValue) / (1000 * 60);

      if (diffInMinutes >= 10) {
        refresh(true); // refresh and update login time
      }
    }, 30 * 1000);
    return () => clearInterval(interval); // cleanup interval on unmount
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define which admin routes should display the navbar
  const adminRoutes = ["/admin/addProjectPage", "/admin/viewProject"];
  const isShowNavbar = adminRoutes.includes(location.pathname);

  // Conditionally wrap pages with layout based on device type
  const ProjectTimelinePage = isMobile
    ? ProjectTimeline
    : withLayout(ProjectTimeline);
  const AddProjectPage = isMobile ? AddProject : withLayout(AddProject);
  const AdminLoginPage = isMobile ? AdminLogin : withLayout(AdminLogin);

  // Admin auth check
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
  };

  return (
    <ThemeProvider theme={theme}>
      {isShowNavbar && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/projectTimeline/:projectHash"
          element={<ProjectTimelinePage />}
        />
        <Route
          path="/admin/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/admin/viewProject" replace />
            ) : (
              <AdminLoginPage />
            )
          }
        />

        <Route
          path="/admin/viewProject"
          element={
            <ProtectedRoute>
              <ViewProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addProjectPage"
          element={
            <ProtectedRoute>
              <AddProjectPage />
            </ProtectedRoute>
          }
        />
      </Routes>

    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AppContent />
    </Router>
  );
}

export default App;
