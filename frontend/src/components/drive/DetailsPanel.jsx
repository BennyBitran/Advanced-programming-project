import { canEditFile, getFileKind } from "../../viewers/fileKind";

export default function DetailsPanel({
  selectedFile,
  filePreviewLoading,
  filePreviewError,
  onOpenViewer,
  onStartEditing,
}) {
  const kind = selectedFile?.name ? getFileKind(selectedFile.name) : "text";
  const canEdit = selectedFile?.name ? canEditFile(selectedFile.name) : false;

  return (
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
                    <button className="gd-btn-secondary" type="button" onClick={onOpenViewer}>
                      {kind === "image" ? "Open image" : "Open"}
                    </button>
                    {canEdit && (
                      <button className="gd-btn-secondary" type="button" onClick={onStartEditing}>
                        Edit
                      </button>
                    )}
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
  );
}
