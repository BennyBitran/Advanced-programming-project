import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DrivePage from "./pages/drive";
import { ThemeProvider } from "./theme/ThemeContext";

function RequireAuth({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
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
