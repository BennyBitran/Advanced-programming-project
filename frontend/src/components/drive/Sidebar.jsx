// frontend/src/components/drive/Sidebar.jsx
export default function Sidebar({
  navItems,
  activeNav,
  onNavChange,
  isNewOpen,
  setIsNewOpen,
  setIsEmptyMenuOpen,
  onUploadClick,
  fileInputRef,
  onFileSelected
}) {
  return (
    <aside className="gd-sidebar">
      <div className="gd-new-wrap">
        <button
          className="gd-new"
          type="button"
          aria-expanded={isNewOpen}
          aria-controls="gd-new-menu"
          onClick={() => {
            setIsNewOpen((open) => !open);
            setIsEmptyMenuOpen(false);
          }}
        >
          <span className="material-symbols-outlined">add</span>
          <span>New</span>
        </button>

        {isNewOpen && (
          <div className="gd-new-menu" id="gd-new-menu" role="menu">
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

        <input className="gd-file-input" ref={fileInputRef} type="file" onChange={onFileSelected} />
      </div>

      <nav className="gd-nav">
        {navItems.map((item) => {
          const isActive = item.key === activeNav;
          return (
            <button
              key={item.key}
              className={`gd-nav-item${isActive ? " gd-active" : ""}`}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavChange(item.key)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="gd-sidebar-footer">
        <div className="gd-storage">
          <div className="gd-storage-bar">
            <div className="gd-storage-used" style={{ width: "22%" }} />
          </div>
          <div className="gd-storage-text">1.1 GB of 15 GB used</div>
        </div>
      </div>
    </aside>
  );
}
