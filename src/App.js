import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import RequesterDashboard from "./pages/RequesterDashboard";
import ApproverDashboard from "./pages/ApproverDashboard";
import axios from "axios";

// Custom hook to parse query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const query = useQuery();

  useEffect(() => {
    const userData = query.get("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        setUser(parsedUser);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        window.history.replaceState({}, document.title, "/"); // Clear URL params
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [query]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3005/auth/google"; // Redirect to Google OAuth
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3005/auth/logout", {
        withCredentials: true,
      });
      console.log(response.data.message); // Should log "Logged out successfully"

      // Clear user data in the frontend after successful logout
      setUser(null);
      localStorage.removeItem("user");

      // Redirect to the login page after successful logout
      window.location.href = "http://localhost:8080";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Navbar user={user} onLogin={handleGoogleLogin} onLogout={handleLogout} />
      <div className="container mx-auto p-8">
        <Routes>
          {/* Default route: redirects to dashboard if user data is available */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === "Approver" ? "/approver" : "/requester"}
                />
              ) : (
                <Login />
              )
            }
          />

          {/* Requester Routes */}
          <Route
            path="/requester"
            element={
              user && user.role === "Requester" ? (
                <RequesterDashboard user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Approver Routes */}
          <Route
            path="/approver"
            element={
              user && user.role === "Approver" ? (
                <ApproverDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
