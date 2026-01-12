import { useState } from "react";
import {registerUser} from "../api/api.js";
import "./register.css";


export default function RegisterPage() {  
  const [username, setUsername] = useState("");   
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setOk("All good my brother, im sending your data to the server...");
    setLoading(true);
    try {
      await registerUser({ 
        username: username.trim(), 
        name: name.trim(), 
        image: image.trim(), 
        password 
      });
      setOk("User registered successfully! You can now log in.");
    } catch (error) {
      setError(error.message);
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
      <p className="gd-auth-subtitle">Create your account to continue</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control gd-input" value={username}
                 onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control gd-input" value={name}
                 onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input className="form-control gd-input" value={image}
                 onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control gd-input" value={password}
                 onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm password</label>
          <input type="password" className="form-control gd-input" value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary w-100 gd-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Create account"}
        </button>
      </form>

      <div className="gd-footer">
        Already have an account? <a href="/login">Sign in</a>
      </div>
    </div>
  </div>
);
}
