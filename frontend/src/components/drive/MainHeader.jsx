// frontend/src/components/drive/MainHeader.jsx
export default function MainHeader({ pageTitle }) {
  return (
    <div className="gd-main-header">
      <h1 className="gd-title">{pageTitle}</h1>
      <div className="gd-main-actions">
        <button className="gd-icon-btn" aria-label="List view">
          <span className="material-symbols-outlined">view_list</span>
        </button>
        <button className="gd-icon-btn" aria-label="Grid view">
          <span className="material-symbols-outlined">grid_view</span>
        </button>
        <button className="gd-icon-btn" aria-label="Sort">
          <span className="material-symbols-outlined">sort</span>
        </button>
      </div>
    </div>
  );
}
