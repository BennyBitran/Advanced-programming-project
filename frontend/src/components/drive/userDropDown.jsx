export default function UserDropdown({
  avatarUrl,
  displayName,
  email,
  onViewPhoto,
  onUploadClick,
  onRemovePhoto,
  onLogout,
}) {
  return (
    <div className="gd-user-dropdown" role="menu">
      <div className="gd-user-head">
        <div className="gd-user-head-left">
          <button
            type="button"
            className="gd-user-mini-avatar"
            onClick={onViewPhoto}
            aria-label="View profile photo"
            title="View photo"
          >
            {avatarUrl ? <img src={avatarUrl} alt="User" /> : <span>G</span>}
          </button>

          <div className="gd-user-meta">
            <div className="gd-user-name">{displayName}</div>
            <div className="gd-user-email">{email}</div>
          </div>
        </div>
      </div>

      <div className="gd-user-divider" />

      <button type="button" className="gd-user-item" onClick={onViewPhoto} role="menuitem">
        <span className="material-symbols-outlined gd-user-item-icn">account_circle</span>
        View photo
      </button>

      <button type="button" className="gd-user-item" onClick={onUploadClick} role="menuitem">
        <span className="material-symbols-outlined gd-user-item-icn">photo_camera</span>
        Upload new photo…
      </button>

      <button
        type="button"
        className={`gd-user-item ${avatarUrl ? "" : "gd-user-item-disabled"}`}
        onClick={avatarUrl ? onRemovePhoto : undefined}
        role="menuitem"
        aria-disabled={!avatarUrl}
      >
        <span className="material-symbols-outlined gd-user-item-icn">delete</span>
        Remove photo
      </button>

      <div className="gd-user-divider" />

      <button type="button" className="gd-user-item gd-user-danger" onClick={onLogout} role="menuitem">
        <span className="material-symbols-outlined gd-user-item-icn">logout</span>
        Log out
      </button>
    </div>
  );
}
