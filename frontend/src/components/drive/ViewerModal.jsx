export default function ViewerModal({
  open,
  fileName,
  isEditing,
  filePreviewLoading,
  filePreviewError,
  filePreview,
  draftContent,
  setDraftContent,
  saveError,
  isSaving,
  onClose,
  onStartEditing,
  onCancelEditing,
  onSave,
}) {
  if (!open) return null;

  return (
    <div className="gd-viewer" role="dialog" aria-modal="true">
      <div className="gd-viewer-header">
        <button className="gd-icon-btn" type="button" onClick={onClose} aria-label="Back">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="gd-viewer-title">{fileName}</div>

        <div className="gd-viewer-actions">
          {!isEditing ? (
            <button className="gd-btn-secondary" type="button" onClick={onStartEditing}>
              Edit
            </button>
          ) : (
            <>
              <button className="gd-btn-primary" type="button" onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button className="gd-btn-secondary" type="button" onClick={onCancelEditing}>
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
          <pre className="gd-file-preview gd-viewer-preview">{filePreview || "This file is empty."}</pre>
        )}
      </div>
    </div>
  );
}
