import { useEffect, useRef, useState } from "react";
import { listFiles, uploadFile } from "../api/api";
import { useTheme } from "../theme/ThemeContext";
import "./drive.css";

const navItems = [
  { key: "my-drive", label: "My Drive", icon: "home_storage" },
  { key: "computers", label: "Computers", icon: "computer" },
  { key: "shared", label: "Shared with me", icon: "group" },
  { key: "recent", label: "Recent", icon: "schedule" },
  { key: "starred", label: "Starred", icon: "star" },
  { key: "trash", label: "Trash", icon: "delete" },
];

export default function DrivePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeNav, setActiveNav] = useState("my-drive");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEmptyMenuOpen, setIsEmptyMenuOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const hasFiles = files.length > 0;

  const loadFiles = () => {
    let isActive = true;
    setIsLoading(true);
    setError("");
    listFiles()
      .then((data) => {
        if (!isActive) {
          return;
        }
        setFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isActive) {
          return;
        }
        setError(err?.message || "Failed to load files");
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  };

  useEffect(() => loadFiles(), []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (files.some((existing) => existing.name === file.name)) {
      setUploadStatus("");
      setUploadError("A file with this name already exists");
      input.value = "";
      setIsNewOpen(false);
      setIsEmptyMenuOpen(false);
      return;
    }
    setUploadStatus("Uploading...");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = typeof reader.result === "string" ? reader.result : "";
        await uploadFile({ name: file.name, type: "file", content });
        setUploadStatus("Upload completed");
        loadFiles();
      } catch (err) {
        setUploadStatus("");
        setUploadError(err?.message || "Upload failed");
      } finally {
        input.value = "";
        setIsNewOpen(false);
        setIsEmptyMenuOpen(false);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read file");
      setUploadStatus("");
      input.value = "";
      setIsNewOpen(false);
      setIsEmptyMenuOpen(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="gd-app">
      {/* Top bar */}
      <header className="gd-topbar">
        <div className="gd-topbar-left">
          <button className="gd-icon-btn" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="gd-brand">
            <div className="gd-drive-mark" aria-hidden="true" />
            <span className="gd-brand-text">Drive</span>
          </div>
        </div>

        <div className="gd-search">
          <span className="material-symbols-outlined gd-search-icon">search</span>
          <input className="gd-search-input" placeholder="Search in Drive" />
          <button className="gd-icon-btn" aria-label="Search options">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        <div className="gd-topbar-right">
          <button
            className="gd-icon-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-symbols-outlined">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button className="gd-icon-btn" aria-label="Help">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="gd-icon-btn" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="gd-avatar" aria-label="Account">
            G
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="gd-body">
        {/* Sidebar */}
        <aside className="gd-sidebar">
          <div className="gd-new-wrap">
            <button
              className="gd-new"
              type="button"
              aria-expanded={isNewOpen}
              aria-controls="gd-new-menu"
              onClick={() => {
                setIsNewOpen((open) => !open);
                setIsEmptyMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined">add</span>
              <span>New</span>
            </button>
            {isNewOpen && (
              <div className="gd-new-menu" id="gd-new-menu" role="menu">
                <button className="gd-new-item" type="button" role="menuitem">
                  <span className="material-symbols-outlined">create_new_folder</span>
                  <span>Folder</span>
                </button>
                <button className="gd-new-item" type="button" role="menuitem">
                  <span className="material-symbols-outlined">description</span>
                  <span>File</span>
                </button>
                <button className="gd-new-item" type="button" role="menuitem" onClick={handleUploadClick}>
                  <span className="material-symbols-outlined">upload</span>
                  <span>Upload</span>
                </button>
              </div>
            )}
            <input
              className="gd-file-input"
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
            />
          </div>

          <nav className="gd-nav">
            {navItems.map((item) => {
              const isActive = item.key === activeNav;
              return (
                <button
                  key={item.key}
                  className={`gd-nav-item${isActive ? " gd-active" : ""}`}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveNav(item.key)}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="gd-sidebar-footer">
            <div className="gd-storage">
              <div className="gd-storage-bar">
                <div className="gd-storage-used" style={{ width: "22%" }} />
              </div>
              <div className="gd-storage-text">1.1 GB of 15 GB used</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="gd-main">
          <div className="gd-main-header">
            <h1 className="gd-title">My Drive</h1>
            <div className="gd-main-actions">
              <button className="gd-icon-btn" aria-label="List view">
                <span className="material-symbols-outlined">view_list</span>
              </button>
              <button className="gd-icon-btn" aria-label="Grid view">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="gd-icon-btn" aria-label="Sort">
                <span className="material-symbols-outlined">sort</span>
              </button>
            </div>
          </div>

          {uploadStatus && <div className="gd-status">{uploadStatus}</div>}
          {uploadError && <div className="gd-error">{uploadError}</div>}

          {isLoading ? (
            <div className="gd-status">Loading files...</div>
          ) : error ? (
            <div className="gd-error">{error}</div>
          ) : hasFiles ? (
            <div className="gd-table">
              <div className="gd-table-head">
                <div>Name</div>
                <div>Type</div>
              </div>

              {files.map((f) => (
                <div className="gd-row" key={f.id}>
                  <div className="gd-name-cell">
                    <span className="gd-file-icon">
                      <span className="material-symbols-outlined">
                        {f.type === "folder" ? "folder" : "description"}
                      </span>
                    </span>
                    <span className="gd-name" title={f.name}>
                      {f.name}
                    </span>
                  </div>
                  <div className="gd-muted">{f.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gd-empty">
              <div className="gd-empty-icon">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <h2 className="gd-empty-title">No files yet</h2>
              <p className="gd-empty-text">
                Use the New button to create your first folder or file.
              </p>
              <button
                className="gd-empty-action"
                type="button"
                aria-expanded={isEmptyMenuOpen}
                aria-controls="gd-empty-menu"
                onClick={() => {
                  setIsEmptyMenuOpen((open) => !open);
                  setIsNewOpen(false);
                }}
              >
                Create
              </button>
              {isEmptyMenuOpen && (
                <div className="gd-new-menu gd-empty-menu" id="gd-empty-menu" role="menu">
                  <button className="gd-new-item" type="button" role="menuitem">
                    <span className="material-symbols-outlined">create_new_folder</span>
                    <span>Folder</span>
                  </button>
                  <button className="gd-new-item" type="button" role="menuitem">
                    <span className="material-symbols-outlined">description</span>
                    <span>File</span>
                  </button>
                  <button className="gd-new-item" type="button" role="menuitem" onClick={handleUploadClick}>
                    <span className="material-symbols-outlined">upload</span>
                    <span>Upload</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        <aside className="gd-details">
          <div className="gd-details-card">
            <div className="gd-details-header">
              <span>Details</span>
              <button className="gd-icon-btn" type="button" aria-label="Close details">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="gd-details-body">
              <div className="gd-details-empty">
                <span className="material-symbols-outlined">info</span>
                <p>Select a file to preview and see details.</p>
              </div>
              <div className="gd-details-section">
                <div className="gd-details-label">Owner</div>
                <div className="gd-details-value">Not selected</div>
              </div>
              <div className="gd-details-section">
                <div className="gd-details-label">Location</div>
                <div className="gd-details-value">Not selected</div>
              </div>
              <div className="gd-details-section">
                <div className="gd-details-label">Last modified</div>
                <div className="gd-details-value">Not selected</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
