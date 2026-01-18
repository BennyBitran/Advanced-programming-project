// frontend/src/pages/drive.js

import { useEffect, useRef, useState } from "react";
import { listFiles, listStarredFiles, starFile, unstarFile, uploadFile } from "../api/api";
import { useTheme } from "../theme/ThemeContext";
import "./drive.css";
import Topbar from "../components/drive/Topbar";
import Sidebar from "../components/drive/Sidebar";
import MainHeader from "../components/drive/MainHeader";
import FilesTable from "../components/drive/FilesTable";
import EmptyState from "../components/drive/EmptyState";
import DetailsPanel from "../components/drive/DetailsPanel";


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

  const pageTitle = navItems.find((n) => n.key === activeNav)?.label || "My Drive";

  const loadFiles = (viewKey = activeNav) => {
    let isActive = true;
    setIsLoading(true);
    setError("");

    const req = viewKey === "starred" ? listStarredFiles() : listFiles();

    req
      .then((data) => {
        if (!isActive) return;
        setFiles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err?.message || "Failed to load files");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  };

  useEffect(() => {
    loadFiles(activeNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav]);

  const handleToggleStar = async (fileId, currentlyStarred) => {
    setError("");
    try {
      if (currentlyStarred) {
        await unstarFile(fileId);
      } else {
        await starFile(fileId);
      }
      loadFiles(activeNav);
    } catch (err) {
      setError(err?.message || "Failed to update star");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploadStatus("Uploading...");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = typeof reader.result === "string" ? reader.result : "";
        await uploadFile({ name: file.name, type: "file", content });
        setUploadStatus("Upload completed");
        loadFiles(activeNav);
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
    <Topbar isDark={isDark} onToggleTheme={toggleTheme} />

    <div className="gd-body">
      <Sidebar
        navItems={navItems}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        isNewOpen={isNewOpen}
        setIsNewOpen={setIsNewOpen}
        setIsEmptyMenuOpen={setIsEmptyMenuOpen}
        onUploadClick={handleUploadClick}
        fileInputRef={fileInputRef}
        onFileSelected={handleFileSelected}
      />

      <main className="gd-main">
        <MainHeader pageTitle={pageTitle} />

        {uploadStatus && <div className="gd-status">{uploadStatus}</div>}
        {uploadError && <div className="gd-error">{uploadError}</div>}

        {isLoading ? (
          <div className="gd-status">Loading files...</div>
        ) : error ? (
          <div className="gd-error">{error}</div>
        ) : hasFiles ? (
          <FilesTable files={files} onToggleStar={handleToggleStar} />
        ) : (
          <EmptyState
            isEmptyMenuOpen={isEmptyMenuOpen}
            setIsEmptyMenuOpen={setIsEmptyMenuOpen}
            setIsNewOpen={setIsNewOpen}
            onUploadClick={handleUploadClick}
          />
        )}
      </main>

      <DetailsPanel />
    </div>
  </div>
);
}
