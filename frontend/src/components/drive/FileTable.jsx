import FileRow from "./FileRow";

export default function FileTable({
  files,
  hasFiles,
  isLoading,
  error,
  selectedFileId,
  onRowClick,
  onToggleStar,
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
          isSelected={selectedFileId === f.id}
          onOpen={() => onRowClick(f)}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
}
