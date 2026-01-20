import FileMenu from "./FileMenu";

export default function FileRow({ file,
  isSelected,
  onOpen,
  onToggleStar,
  onTrash,
  onRestore,
  onDeletePermanently,
  onOpenMoveModal
}) {
  const icon = file.type === "folder" ? "folder" : "description";

  return (
    <div
      className={`gd-row${isSelected ? " gd-selected" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="gd-name-cell">
        <span className="gd-file-icon">
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        <span className="gd-name" title={file.name}>
          {file.name}
        </span>
      </div>

      <div className="gd-muted">{file.type}</div>

      <div className="gd-col-right">
        {/* Only the menu remains here now */}
        <FileMenu
          file={file}
          onToggleStar={onToggleStar}
          onTrash={onTrash}
          onRestore={onRestore}
          onDeletePermanently={onDeletePermanently}
          onOpenMoveModal={onOpenMoveModal}
        />
      </div>
    </div>
  );
}