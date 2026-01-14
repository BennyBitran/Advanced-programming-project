import { useState } from "react";
import "./drive.css";

export default function DrivePage() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const files = [];
  const hasFiles = files.length > 0;

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
              onClick={() => setIsNewOpen((open) => !open)}
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
                <button className="gd-new-item" type="button" role="menuitem">
                  <span className="material-symbols-outlined">upload</span>
                  <span>Upload</span>
                </button>
              </div>
            )}
          </div>

          <nav className="gd-nav">
            <a className="gd-nav-item gd-active" href="/drive">
              <span className="material-symbols-outlined">home_storage</span>
              <span>My Drive</span>
            </a>
            <a className="gd-nav-item" href="#">
              <span className="material-symbols-outlined">computer</span>
              <span>Computers</span>
            </a>
            <a className="gd-nav-item" href="#">
              <span className="material-symbols-outlined">group</span>
              <span>Shared with me</span>
            </a>
            <a className="gd-nav-item" href="#">
              <span className="material-symbols-outlined">schedule</span>
              <span>Recent</span>
            </a>
            <a className="gd-nav-item" href="#">
              <span className="material-symbols-outlined">star</span>
              <span>Starred</span>
            </a>
            <a className="gd-nav-item" href="#">
              <span className="material-symbols-outlined">delete</span>
              <span>Trash</span>
            </a>
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

          {hasFiles ? (
            <div className="gd-table">
              <div className="gd-table-head">
                <div>Name</div>
                <div>Type</div>
                <div className="gd-col-right">ID</div>
              </div>

              {files.map((f) => (
                <div className="gd-row" key={f.id}>
                  <div className="gd-name-cell">
                    <span className="gd-file-icon">
                      <span className="material-symbols-outlined">
                        {f.type === "folder" ? "folder" : "description"}
                      </span>
                    </span>
                    <span className="gd-name">{f.name}</span>
                  </div>
                  <div className="gd-muted">{f.type}</div>
                  <div className="gd-col-right gd-muted">{f.id}</div>
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
                onClick={() => setIsNewOpen(true)}
              >
                Create
              </button>
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
