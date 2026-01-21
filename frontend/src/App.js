import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DrivePage from "./pages/drive";
import { ThemeProvider } from "./theme/ThemeContext";
import { clearAuth, getAuthToken } from "./auth/authStorage";

function isTokenExpired(token) {
  if (!token) return true;
  const parts = token.split(".");
  if (parts.length < 2) return true;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload?.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function AuthStorageSync() {
  useEffect(() => {
    function onStorage(e) {
      if (!e) return;
      if (e.key !== "token" && e.key !== "userId" && e.key !== "username") return;

      const token = getAuthToken();
      if (!token) {
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
        return;
      }

      // If token/user changes in another tab, reload to reflect the new user UI/data.
      if (window.location.pathname.startsWith("/drive")) {
        window.location.reload();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}

function RequireAuth({ children }) {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Main application component that sets up routing between different pages
export default function App() {
  return (
    <ThemeProvider>
      {/* Set up the router for navigation between pages */}
      <BrowserRouter>
        <AuthStorageSync />
        {/* Define application routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/drive"
            element={
              <RequireAuth>
                <DrivePage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
