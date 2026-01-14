import { useMemo } from "react";
import "./drive.css";

export default function DrivePage() {
  // placeholder (later: use your real state/files and handlers)
  const files = useMemo(
    () => [
      { id: "1", name: "Example Folder", type: "folder" },
      { id: "2", name: "hello.txt", type: "file" },
    ],
    []
  );

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
          <button className="gd-new">
            <span className="material-symbols-outlined">add</span>
            <span>New</span>
          </button>

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
        </main>
      </div>
    </div>
  );
}
