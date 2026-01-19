export default function CreateFolderModal({
  open,
  folderName,
  setFolderName,
  folderError,
  onClose,
  onCreate,
  onKeyDown,
}) {
  if (!open) return null;

  return (
    <div className="gd-modal" role="dialog" aria-modal="true">
      <div className="gd-modal-card">
        <div className="gd-modal-header">
          <h2>Create folder</h2>
          <button className="gd-icon-btn" type="button" onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <label className="gd-modal-label">
          Folder name
          <input
            className="gd-modal-input"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </label>

        {folderError && <div className="gd-error gd-modal-error">{folderError}</div>}

        <div className="gd-modal-actions">
          <button className="gd-btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="gd-btn-primary" type="button" onClick={onCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
