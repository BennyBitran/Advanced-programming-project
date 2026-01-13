import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {loginUser} from "../api/api";
import "./register.css";




export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  useEffect(() => {
    const state = location.state;
    if (state && state.justRegistered) {
      setOk("Registration successful! Please log in.");
      if (state.username) {
        setUsername(state.username);
      }
    }
  }, [location.state]);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ username: username.trim(), password });
      localStorage.setItem("token", data.token);
      navigate("/drive");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gd-auth-bg">
      <div className="gd-auth-card">
        <div className="gd-auth-brand">
          <div className="gd-auth-logo" />
          <h2 className="gd-auth-title">Drive</h2>
        </div>
        <p className="gd-auth-subtitle">Sign in to continue</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {ok && <div className="alert alert-success">{ok}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control gd-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control gd-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 gd-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="gd-footer">
          No account? No problemo! <a href="/register">Create one</a>
        </div>
      </div>
    </div>
  );
}



