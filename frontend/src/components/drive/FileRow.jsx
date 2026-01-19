export default function FileRow({ file, isSelected, onOpen, onToggleStar }) {
  const icon = file.type === "folder" ? "folder" : "description";
  const filled = !!file.isStarred;

  const handleStarClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleStar(file.id, !filled);
  };

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
        <button
          className={`gd-star-btn${filled ? " gd-starred" : ""}`}
          type="button"
          aria-label={filled ? "Unstar" : "Star"}
          onClick={handleStarClick}
        >
          <span className="material-symbols-outlined">{filled ? "star" : "star"}</span>
        </button>
      </div>
    </div>
  );
}
