import { useEffect, useRef, useState } from "react";
import { getFile, listFiles, updateFile, uploadFile } from "../api/api";
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
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [filePreviewError, setFilePreviewError] = useState("");
  const [filePreviewLoading, setFilePreviewLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderError, setFolderError] = useState("");
  const fileInputRef = useRef(null);
  const previewRequestId = useRef(0);
  const hasFiles = files.length > 0;

  const loadFiles = (parentId) => {
    let isActive = true;
    setIsLoading(true);
    setError("");
    listFiles(parentId)
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

  useEffect(() => {
    const cleanup = loadFiles(currentFolderId);
    setSelectedFile(null);
    setFilePreview("");
    setFilePreviewError("");
    setFilePreviewLoading(false);
    setIsEditing(false);
    setDraftContent("");
    setSaveError("");
    setIsSaving(false);
    setIsViewerOpen(false);
    return cleanup;
  }, [currentFolderId]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateFolderClick = () => {
    setFolderName("");
    setFolderError("");
    setIsFolderModalOpen(true);
  };

  const handleCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) {
      setFolderError("Folder name is required");
      return;
    }
    setFolderError("");
    try {
      const payload = { name, type: "folder" };
      if (currentFolderId) {
        payload.parentId = currentFolderId;
      }
      await uploadFile(payload);
      setIsFolderModalOpen(false);
      setFolderName("");
      loadFiles(currentFolderId);
    } catch (err) {
      setFolderError(err?.message || "Failed to create folder");
    }
  };

  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false);
    setFolderError("");
  };

  const handleFolderInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateFolder();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      handleCloseFolderModal();
    }
  };

  const handleOpenFolder = (folder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setFilePreview("");
    setFilePreviewError("");
    setIsEditing(false);
    setDraftContent("");
    setSaveError("");
    setIsViewerOpen(false);
    const requestId = previewRequestId.current + 1;
    previewRequestId.current = requestId;
    setFilePreviewLoading(true);
    getFile(file.id)
      .then((data) => {
        if (previewRequestId.current !== requestId) {
          return;
        }
        const content = data?.content ?? "";
        setFilePreview(content);
        setDraftContent(content);
      })
      .catch((err) => {
        if (previewRequestId.current !== requestId) {
          return;
        }
        setFilePreviewError(err?.message || "Failed to load file");
      })
      .finally(() => {
        if (previewRequestId.current === requestId) {
          setFilePreviewLoading(false);
        }
      });
  };

  const handleStartEditing = () => {
    setIsViewerOpen(true);
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setDraftContent(filePreview);
    setSaveError("");
  };

  const handleOpenViewer = () => {
    setIsViewerOpen(true);
    setIsEditing(false);
    setSaveError("");
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setIsEditing(false);
    setSaveError("");
  };

  const handleSaveContent = async () => {
    if (!selectedFile) {
      return;
    }
    setIsSaving(true);
    setSaveError("");
    try {
      await updateFile(selectedFile.id, { content: draftContent });
      setFilePreview(draftContent);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err?.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRowClick = (file) => {
    if (file.type === "folder") {
      handleOpenFolder(file);
    } else {
      handleSelectFile(file);
    }
  };

  const handleBreadcrumbRoot = () => {
    setCurrentFolderId(null);
    setBreadcrumbs([]);
  };

  const handleBreadcrumbClick = (index) => {
    const nextCrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(nextCrumbs);
    setCurrentFolderId(nextCrumbs[index]?.id ?? null);
  };

  const handleFileSelected = (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    /*
    ----------------------------------------------------------
    this handles duplicate files names but we should allow it.
    maybe later with can pop up a window notifying the user about it.
    in either case we should be checking only in the same folder.
    ----------------------------------------------------------
    if (files.some((existing) => existing.name === file.name)) {
      setUploadStatus("");
      setUploadError("A file with this name already exists");
      input.value = "";
      setIsNewOpen(false);
      setIsEmptyMenuOpen(false);
      return;
    }
    */
    setUploadStatus("Uploading...");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = typeof reader.result === "string" ? reader.result : "";
        const payload = { name: file.name, type: "file", content };
        if (currentFolderId) {
          payload.parentId = currentFolderId;
        }
        await uploadFile(payload);
        setUploadStatus("Upload completed");
        loadFiles(currentFolderId);
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
                <button
                  className="gd-new-item"
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    handleCreateFolderClick();
                    setIsNewOpen(false);
                  }}
                >
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
            <div className="gd-title-wrap">
              <h1 className="gd-title">My Drive</h1>
              <div className="gd-breadcrumbs" aria-label="Folder path">
                <button
                  className="gd-crumb"
                  type="button"
                  onClick={handleBreadcrumbRoot}
                >
                  My Drive
                </button>
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.id} className="gd-crumb-group">
                    <span className="gd-crumb-sep">/</span>
                    <button
                      className="gd-crumb"
                      type="button"
                      onClick={() => handleBreadcrumbClick(index)}
                    >
                      {crumb.name}
                    </button>
                  </span>
                ))}
              </div>
            </div>
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
                <div
                  className={`gd-row${selectedFile?.id === f.id ? " gd-selected" : ""}`}
                  key={f.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRowClick(f)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleRowClick(f);
                    }
                  }}
                >
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
                  <button
                    className="gd-new-item"
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      handleCreateFolderClick();
                      setIsEmptyMenuOpen(false);
                    }}
                  >
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
              {!selectedFile ? (
                <div className="gd-details-empty">
                  <span className="material-symbols-outlined">info</span>
                  <p>Select a file to preview and see details.</p>
                </div>
              ) : (
                <>
                  <div className="gd-details-section">
                    <div className="gd-details-label">Name</div>
                    <div className="gd-details-value">{selectedFile.name}</div>
                  </div>
                  <div className="gd-details-section">
                    <div className="gd-details-label">Type</div>
                    <div className="gd-details-value">{selectedFile.type}</div>
                  </div>
                  {selectedFile.type === "file" && (
                    <div className="gd-details-section">
                      <div className="gd-details-label">Content</div>
                      <div className="gd-preview-actions">
                        <button className="gd-btn-secondary" type="button" onClick={handleOpenViewer}>
                          Open
                        </button>
                        <button className="gd-btn-secondary" type="button" onClick={handleStartEditing}>
                          Edit
                        </button>
                      </div>
                      {filePreviewLoading && <div className="gd-muted">Loading content...</div>}
                      {filePreviewError && <div className="gd-error gd-preview-error">{filePreviewError}</div>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
      {isFolderModalOpen && (
        <div className="gd-modal" role="dialog" aria-modal="true">
          <div className="gd-modal-card">
            <div className="gd-modal-header">
              <h2>Create folder</h2>
              <button className="gd-icon-btn" type="button" onClick={handleCloseFolderModal} aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <label className="gd-modal-label">
              Folder name
              <input
                className="gd-modal-input"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                onKeyDown={handleFolderInputKeyDown}
                autoFocus
              />
            </label>
            {folderError && <div className="gd-error gd-modal-error">{folderError}</div>}
            <div className="gd-modal-actions">
              <button className="gd-btn-secondary" type="button" onClick={handleCloseFolderModal}>
                Cancel
              </button>
              <button className="gd-btn-primary" type="button" onClick={handleCreateFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {isViewerOpen && selectedFile?.type === "file" && (
        <div className="gd-viewer" role="dialog" aria-modal="true">
          <div className="gd-viewer-header">
            <button className="gd-icon-btn" type="button" onClick={handleCloseViewer} aria-label="Back">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="gd-viewer-title">{selectedFile.name}</div>
            <div className="gd-viewer-actions">
              {!isEditing ? (
                <button className="gd-btn-secondary" type="button" onClick={handleStartEditing}>
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="gd-btn-primary"
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button className="gd-btn-secondary" type="button" onClick={handleCancelEditing}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="gd-viewer-body">
            {saveError && <div className="gd-error gd-preview-error">{saveError}</div>}
            {filePreviewLoading ? (
              <div className="gd-muted">Loading content...</div>
            ) : filePreviewError ? (
              <div className="gd-error gd-preview-error">{filePreviewError}</div>
            ) : isEditing ? (
              <textarea
                className="gd-file-editor gd-viewer-editor"
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
              />
            ) : (
              <pre className="gd-file-preview gd-viewer-preview">
                {filePreview || "This file is empty."}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
