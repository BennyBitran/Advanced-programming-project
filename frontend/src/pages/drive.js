import { useEffect, useRef, useState } from "react";
import {
  getFile,
  listFiles,
  updateFile,
  uploadFile,
  deleteFile,
} from "../api/api";
import { useTheme } from "../theme/ThemeContext";
import "./drive.css";

import Topbar from "../components/drive/Topbar";
import Sidebar from "../components/drive/Sidebar";
import Breadcrumbs from "../components/drive/Breadcrumbs";
import FileTable from "../components/drive/FileTable";
import DetailsPanel from "../components/drive/DetailsPanel";
import CreateFolderModal from "../components/drive/CreateFolderModal";
import ViewerModal from "../components/drive/ViewerModal";

const navItems = [
  { key: "my-drive", label: "My Drive", icon: "home_storage" },
  { key: "computers", label: "Computers", icon: "computer" },
  { key: "shared", label: "Shared with me", icon: "group" },
  { key: "recent", label: "Recent", icon: "schedule" },
  { key: "starred", label: "Starred", icon: "star" },
  { key: "trash", label: "Trash", icon: "delete" },
];

const titleByNav = {
  "my-drive": "My Drive",
  starred: "Starred",
  trash: "Trash",
  computers: "Computers",
  shared: "Shared with me",
  recent: "Recent",
};

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
  const pageTitle = titleByNav[activeNav] ?? "My Drive";
  const showBreadcrumbs = activeNav === "my-drive" || currentFolderId !== null;

  const resetSelectionAndPreview = () => {
    setSelectedFile(null);
    setFilePreview("");
    setFilePreviewError("");
    setFilePreviewLoading(false);
    setIsEditing(false);
    setDraftContent("");
    setSaveError("");
    setIsSaving(false);
    setIsViewerOpen(false);
  };

  const buildListFilters = () => {
    if (activeNav === "trash") return { view: "trash" };

    if (activeNav === "shared") {
      if (!currentFolderId) return { view: "shared" };
      return { parentId: currentFolderId };
    }

    if (activeNav === "recent") {
      // root recent view
      if (!currentFolderId) return { view: "recent" };
      // inside a folder -> normal folder listing
      return { parentId: currentFolderId };
    }

    if (activeNav === "starred") {
      // root starred view
      if (!currentFolderId) return { view: "starred" };
      // inside a folder -> normal folder listing
      return { parentId: currentFolderId };
    }
    // For now, other views fall back to My Drive
    const filters = {};
    if (currentFolderId) filters.parentId = currentFolderId;
    return filters;
  };

  const loadFiles = () => {
    let isActive = true;
    setIsLoading(true);
    setError("");

    const filters = buildListFilters();

    listFiles(filters)
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

  // Reload when folder changes OR nav view changes
  useEffect(() => {
    const cleanup = loadFiles();
    resetSelectionAndPreview();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId, activeNav]);

  const handleNavChange = (nextKey) => {
    setActiveNav(nextKey);
    setIsNewOpen(false);
    setIsEmptyMenuOpen(false);

    if (nextKey !== "my-drive") {
      setCurrentFolderId(null);
      setBreadcrumbs([]);
    }
  };

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
      if (activeNav === "my-drive" && currentFolderId) payload.parentId = currentFolderId;
      await uploadFile(payload);
      setIsFolderModalOpen(false);
      setFolderName("");
      loadFiles();
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
    if (!["my-drive", "recent", "starred"].includes(activeNav)) return;
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

    // Only fetch content for real files
    if (file.type !== "file") return;

    const requestId = previewRequestId.current + 1;
    previewRequestId.current = requestId;
    setFilePreviewLoading(true);

    getFile(file.id)
      .then((data) => {
        if (previewRequestId.current !== requestId) return;
        const content = data?.content ?? "";
        setFilePreview(content);
        setDraftContent(content);
      })
      .catch((err) => {
        if (previewRequestId.current !== requestId) return;
        setFilePreviewError(err?.message || "Failed to load file");
      })
      .finally(() => {
        if (previewRequestId.current === requestId) setFilePreviewLoading(false);
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
    if (!selectedFile) return;
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

  const handleTrash = async (fileId) => {
    // save original state in case of fail
    const originalFiles = [...files];
    // remove from UI
    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    // If the file being trashed is currently selected, clear the selection
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }

    try {
      await deleteFile(fileId);
      setUploadStatus("File moved to trash");
      // clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (err) {
      // 4. Revert on failure
      setFiles(originalFiles);
      setError(err?.message || "Failed to move file to trash");
    }
  };

  const handleRestore = async (fileId) => {
    try {
      await updateFile(fileId, { restore: true });

      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      setSelectedFile((prev) =>
        prev?.id === fileId ? { ...prev, isTrashed: false } : prev
      );

      setUploadStatus("File restored");
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (err) {
      setError(err?.message || "Failed to restore");
    }
  };

  const handleDeletePermanently = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this permanently?")) return;
    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setUploadStatus("Permanently deleted");
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (err) {
      setError(err?.message || "Failed to delete");
    }
  };
  const handleEmptyTrash = async () => {
    if (files.length === 0) return;

    const confirmMessage = `Are you sure you want to permanently delete all ${files.length} items? This cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    const idsToDelete = files.map(f => f.id);

    try {
      setUploadStatus("Emptying trash...");

      await Promise.all(idsToDelete.map(id => deleteFile(id)));

      setFiles([]);
      setUploadStatus("Trash emptied");
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (err) {
      loadFiles();  //reload to see if anything failed
      setError("Some items could not be deleted. Please try again.");
    }
  };

  const handleRowClick = (file) => {
    if (["my-drive", "recent", "starred"].includes(activeNav) && file.type === "folder") {
      handleOpenFolder(file);
      return;
    }
    handleSelectFile(file);
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
    if (!file) return;

    setUploadStatus("Uploading...");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = typeof reader.result === "string" ? reader.result : "";
        const payload = { name: file.name, type: "file", content };
        if (activeNav === "my-drive" && currentFolderId) payload.parentId = currentFolderId;
        await uploadFile(payload);
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

  const handleToggleStar = async (fileId, nextStarred) => {
    // optimistic update
    setFiles((prev) => {
      if (activeNav === "starred" && nextStarred === false) {
        return prev.filter((f) => f.id !== fileId);
      }
      return prev.map((f) => (f.id === fileId ? { ...f, isStarred: nextStarred } : f));
    });

    // keep selectedFile in sync
    setSelectedFile((prev) => (prev?.id === fileId ? { ...prev, isStarred: nextStarred } : prev));

    try {
      await updateFile(fileId, { isStarred: nextStarred });
    }
    catch (err) {
      // revert on failure
      setFiles((prev) => {
        // If we removed it from starred view, we can't reconstruct without reload -> just reload.
        if (activeNav === "starred" && nextStarred === false) {
          loadFiles();
          return prev;
        }
        return prev.map((f) => (f.id === fileId ? { ...f, isStarred: !nextStarred } : f));
      });
      setSelectedFile((prev) => (prev?.id === fileId ? { ...prev, isStarred: !nextStarred } : prev));
      setError(err?.message || "Failed to update star");
    }
  };

  return (
    <div className="gd-app">
      <Topbar isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="gd-body">
        <Sidebar
          navItems={navItems}
          activeNav={activeNav}
          onNavChange={handleNavChange}
          isNewOpen={isNewOpen}
          setIsNewOpen={setIsNewOpen}
          isEmptyMenuOpen={isEmptyMenuOpen}
          setIsEmptyMenuOpen={setIsEmptyMenuOpen}
          onUploadClick={handleUploadClick}
          onCreateFolderClick={handleCreateFolderClick}
          fileInputRef={fileInputRef}
          onFileSelected={handleFileSelected}
        />

        <main className="gd-main">
          <div className="gd-main-header">
            <Breadcrumbs
              title={pageTitle}
              showBreadcrumbs={showBreadcrumbs}
              breadcrumbs={breadcrumbs}
              onRoot={handleBreadcrumbRoot}
              onCrumbClick={handleBreadcrumbClick}
            />

            <div className="gd-main-actions">
              {/* empty trash */}
              {activeNav === "trash" && files.length > 0 && (
                <button
                  className="gd-text-btn gd-danger-text"
                  onClick={handleEmptyTrash}
                  title="Permanently delete all items in trash"
                >
                  <span className="material-symbols-outlined">delete_forever</span>
                  Empty Trash
                </button>
              )}
              <button className="gd-icon-btn" type="button" aria-label="List view">
                <span className="material-symbols-outlined">view_list</span>
              </button>
              <button className="gd-icon-btn" type="button" aria-label="Grid view">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="gd-icon-btn" type="button" aria-label="Sort">
                <span className="material-symbols-outlined">sort</span>
              </button>
            </div>
          </div>

          {uploadStatus && <div className="gd-status">{uploadStatus}</div>}
          {uploadError && <div className="gd-error">{uploadError}</div>}

          <FileTable
            files={files}
            onTrash={handleTrash}
            activeNav={activeNav}
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
            hasFiles={hasFiles}
            isLoading={isLoading}
            error={error}
            selectedFileId={selectedFile?.id ?? null}
            onRowClick={handleRowClick}
            onToggleStar={handleToggleStar}
          />
        </main>

        <DetailsPanel
          selectedFile={selectedFile}
          filePreviewLoading={filePreviewLoading}
          filePreviewError={filePreviewError}
          onOpenViewer={handleOpenViewer}
          onStartEditing={handleStartEditing}
        />
      </div>

      <CreateFolderModal
        open={isFolderModalOpen}
        folderName={folderName}
        setFolderName={setFolderName}
        folderError={folderError}
        onClose={handleCloseFolderModal}
        onCreate={handleCreateFolder}
        onKeyDown={handleFolderInputKeyDown}
      />

      <ViewerModal
        open={isViewerOpen && selectedFile?.type === "file"}
        fileName={selectedFile?.name ?? ""}
        isEditing={isEditing}
        filePreviewLoading={filePreviewLoading}
        filePreviewError={filePreviewError}
        filePreview={filePreview}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        saveError={saveError}
        isSaving={isSaving}
        onClose={handleCloseViewer}
        onStartEditing={handleStartEditing}
        onCancelEditing={handleCancelEditing}
        onSave={handleSaveContent}
      />
    </div>
  );
}
