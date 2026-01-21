import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DrivePage from "./pages/drive";
import { ThemeProvider } from "./theme/ThemeContext";

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

function RequireAuth({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token || isTokenExpired(token)) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
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
