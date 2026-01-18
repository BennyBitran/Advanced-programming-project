// frontend/src/components/drive/DetailsPanel.jsx
export default function DetailsPanel() {
  return (
    <aside className="gd-details">
      <div className="gd-details-card">
        <div className="gd-details-header">
          <span>Details</span>
          <button className="gd-icon-btn" type="button" aria-label="Close details">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="gd-details-body">
          <div className="gd-details-empty">
            <span className="material-symbols-outlined">info</span>
            <p>Select a file to preview and see details.</p>
          </div>

          <div className="gd-details-section">
            <div className="gd-details-label">Owner</div>
            <div className="gd-details-value">Not selected</div>
          </div>
          <div className="gd-details-section">
            <div className="gd-details-label">Location</div>
            <div className="gd-details-value">Not selected</div>
          </div>
          <div className="gd-details-section">
            <div className="gd-details-label">Last modified</div>
            <div className="gd-details-value">Not selected</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
