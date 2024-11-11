import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import RequesterDashboard from "./pages/RequesterDashboard";
import ApproverDashboard from "./pages/ApproverDashboard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const APP_URL = "https://api-gateway-three-roan.vercel.app/";

// Custom hook to parse query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decodedUser = jwtDecode(savedToken);
        return decodedUser;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  });

  const query = useQuery();

  useEffect(() => {
    const token = query.get("token");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        localStorage.setItem("token", token);
        window.history.replaceState({}, document.title, "/"); // Clear URL params
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [query]);

  const handleGoogleLogin = () => {
    window.location.href = `${APP_URL}auth/google`; // Redirect to Google OAuth
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${APP_URL}auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // Clear user data and token
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect to the login page after successful logout
      window.location.href = "https://api-gateway-three-roan.vercel.app";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <>
      <Navbar user={user} onLogin={handleGoogleLogin} onLogout={handleLogout} />
      <div className="container mx-auto p-8">
        <Routes>
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

          <Route
            path="/requester"
            element={
              user && user.role === "Requester" ? (
                <RequesterDashboard
                  user={user}
                  authHeaders={getAuthHeaders()}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/approver"
            element={
              user && user.role === "Approver" ? (
                <ApproverDashboard authHeaders={getAuthHeaders()} />
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
