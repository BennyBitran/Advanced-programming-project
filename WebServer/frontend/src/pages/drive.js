import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { listFiles } from "../api/api";

// DrivePage component that represents the main drive interface
export default function DrivePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  // Fetch files from the server when the component mounts
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listFiles(userId);
        setFiles(data);
      } catch (err) {
        setError( err.message || "Failed to load files.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, navigate]);

  function logout() {
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  }
  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>My Drive</h2>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <hr />

      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="list-group">
          {files.map((f) => (
            <div key={f.id} className="list-group-item d-flex justify-content-between">
              <div>
                <div style={{ fontWeight: 600 }}>{f.name}</div>
                <div style={{ color: "#666", fontSize: 13 }}>{f.type}</div>
              </div>
              <div style={{ color: "#999", fontSize: 13 }}>{f.id}</div>
            </div>
          ))}

          {files.length === 0 && (
            <div className="list-group-item" style={{ color: "#666" }}>
              No files yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}