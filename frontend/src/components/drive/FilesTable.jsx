// frontend/src/components/drive/FilesTable.jsx
export default function FilesTable({ files, onToggleStar }) {
  return (
    <div className="gd-table">
      <div className="gd-table-head">
        <div>Name</div>
        <div>Type</div>
        <div></div>
      </div>

      {files.map((f) => {
        const isStarred = !!(f.isStarred ?? f.starred);

        return (
          <div className="gd-row" key={f.id}>
            <div className="gd-name-cell">
              <span className="gd-file-icon">
                <span className="material-symbols-outlined">
                  {f.type === "folder" ? "folder" : "description"}
                </span>
              </span>
              <span className="gd-name" title={f.name}>
                {f.name}
              </span>
            </div>

            <div className="gd-muted">{f.type}</div>

            <button
              className="gd-icon-btn"
              type="button"
              aria-label={isStarred ? "Unstar" : "Star"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(f.id, isStarred);
              }}
            >
              <span className="material-symbols-outlined">
                {isStarred ? "star" : "star_border"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
