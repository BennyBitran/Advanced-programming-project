// frontend/src/components/drive/Topbar.jsx
export default function Topbar({ isDark, onToggleTheme }) {
  return (
    <header className="gd-topbar">
      <div className="gd-topbar-left">
        <button className="gd-icon-btn" aria-label="Menu">
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="gd-brand">
          <div className="gd-drive-mark" aria-hidden="true" />
          <span className="gd-brand-text">Drive</span>
        </div>
      </div>

      <div className="gd-search">
        <span className="material-symbols-outlined gd-search-icon">search</span>
        <input className="gd-search-input" placeholder="Search in Drive" />
        <button className="gd-icon-btn" aria-label="Search options">
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>

      <div className="gd-topbar-right">
        <button
          className="gd-icon-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="material-symbols-outlined">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button className="gd-icon-btn" aria-label="Help">
          <span className="material-symbols-outlined">help</span>
        </button>
        <button className="gd-icon-btn" aria-label="Settings">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="gd-avatar" aria-label="Account">
          G
        </button>
      </div>
    </header>
  );
}
