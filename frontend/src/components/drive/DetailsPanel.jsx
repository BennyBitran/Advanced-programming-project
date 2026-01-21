// frontend/src/components/drive/DetailsPanel.jsx

export default function DetailsPanel({
  selectedFile,
  filePreviewLoading,
  filePreviewError,
  breadcrumbs,
  onClose,
  getFileKind,
  canEditFile
}) {
  const kind = selectedFile?.name ? getFileKind(selectedFile.name) : "text";
  const canEdit = selectedFile?.name ? canEditFile(selectedFile.name) : false;

  return (
    <aside className="gd-details">
      <div className="gd-details-card">
        <div className="gd-details-header">
          <span>Details</span>
          <button
            className="gd-icon-btn"
            type="button"
            aria-label="Close details"
            onClick={onClose}
          >
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

              <div className="gd-details-section">
                <div className="gd-details-label">Owner</div>
                <div className="gd-details-value" style={{ wordBreak: "break-all" }}>
                  {selectedFile.ownerName ?? "—"}
                </div>
              </div>

              <div className="gd-details-section">
                <div className="gd-details-label">Location</div>
                <div className="gd-details-value">
                  {breadcrumbs?.length
                    ? `My Drive / ${breadcrumbs.map((c) => c.name).join(" / ")}`
                    : "My Drive"}
                </div>
              </div>

              <div className="gd-details-section">
                <div className="gd-details-label">Created</div>
                <div className="gd-details-value">
                  {selectedFile.creationTime
                    ? new Date(selectedFile.creationTime).toLocaleString()
                    : "—"}
                </div>
              </div>

              <div className="gd-details-section">
                <div className="gd-details-label">Last modified</div>
                <div className="gd-details-value">
                  {selectedFile.lastUpdateTime
                    ? new Date(selectedFile.lastUpdateTime).toLocaleString()
                    : "—"}
                </div>
              </div>

              <div className="gd-details-section">
                <div className="gd-details-label">Last opened</div>
                <div className="gd-details-value">
                  {selectedFile.lastOpenedTime
                    ? new Date(selectedFile.lastOpenedTime).toLocaleString()
                    : "—"}
                </div>
              </div>

              {selectedFile.type === "file" && (
                <div className="gd-details-section">
                  <div className="gd-details-label">Preview status</div>
                  {filePreviewLoading && <div className="gd-muted">Loading content...</div>}
                  {filePreviewError && (
                    <div className="gd-error gd-preview-error">{filePreviewError}</div>
                  )}
                  {!filePreviewLoading && !filePreviewError && (
                    <div className="gd-muted">Double-click to open</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
