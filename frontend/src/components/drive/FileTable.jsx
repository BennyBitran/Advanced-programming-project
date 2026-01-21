import FileRow from "./FileRow";

export default function FileTable({
  files,
  activeNav,
  hasFiles,
  isLoading,
  error,
  selectedFileId,
  onRowClick,
  onRowDoubleClick,
  onToggleStar,
  onTrash, 
  onRestore, 
  onDeletePermanently,
  onOpenMoveModal,
}) {
  if (isLoading) return <div className="gd-status">Loading files...</div>;
  if (error) return <div className="gd-error">{error}</div>;

  if (!hasFiles) {
    return (
      <div className="gd-empty">
        <div className="gd-empty-icon">
          <span className="material-symbols-outlined">cloud_upload</span>
        </div>
        <h2 className="gd-empty-title">No files yet</h2>
        <p className="gd-empty-text">Use the New button to create your first folder or file.</p>
      </div>
    );
  }

  return (
    <div className="gd-table">
      <div className="gd-table-head">
        <div>Name</div>
        <div>Type</div>
        <div className="gd-col-right" aria-label="Star column" />
      </div>

      {files.map((f) => (
        <FileRow
          key={f.id}
          file={f}
          activeNav={activeNav}
          isSelected={selectedFileId === f.id}
          onClick={() => onRowClick(f)}
          onDoubleClick={() => onRowDoubleClick?.(f)}
          onToggleStar={onToggleStar}
          onTrash={onTrash}
          onRestore={onRestore}
          onDeletePermanently={onDeletePermanently}
          onOpenMoveModal={onOpenMoveModal}
        />
      ))}
    </div>
  );
}
