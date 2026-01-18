// frontend/src/components/drive/EmptyState.jsx
export default function EmptyState({
  isEmptyMenuOpen,
  setIsEmptyMenuOpen,
  setIsNewOpen,
  onUploadClick
}) {
  return (
    <div className="gd-empty">
      <div className="gd-empty-icon">
        <span className="material-symbols-outlined">cloud_upload</span>
      </div>
      <h2 className="gd-empty-title">No files yet</h2>
      <p className="gd-empty-text">Use the New button to create your first folder or file.</p>

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
          <button className="gd-new-item" type="button" role="menuitem" onClick={onUploadClick}>
            <span className="material-symbols-outlined">upload</span>
            <span>Upload</span>
          </button>
        </div>
      )}
    </div>
  );
}
