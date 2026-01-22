  export default function UserPhotoModal({ open, avatarUrl, onClose }) {
    if (!open) return null;

    return (
      <div className="gd-user-photo-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
        <div className="gd-user-photo-card" onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" className="gd-user-photo-close" onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="gd-user-photo-body">
            {avatarUrl ? (
              <img className="gd-user-photo-img" src={avatarUrl} alt="Profile" />
            ) : (
              <div className="gd-user-photo-empty">No profile photo</div>
            )}
          </div>
        </div>
      </div>
    );
  }
