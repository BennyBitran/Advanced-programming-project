import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DrivePage from "./pages/drive";

// Main application component that sets up routing between different pages
export default function App() {
  return (
    // Set up the router for navigation between pages
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/drive">Drive</Link>
        </nav>
        {/* Define application routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/drive" element={<DrivePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
