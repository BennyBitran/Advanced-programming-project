// components/drive/ActionModal.js
export default function ActionModal({
    open, title, label, value, role, // Added 'role' prop
    onChange, onRoleChange, // Added 'onRoleChange' handler
    onClose, onSave, placeholder = ""
}) {
    if (!open) return null;

    return (
        <div className="gd-modal">
            <div className="gd-modal-card">
                <div className="gd-modal-header">
                    <h2>{title}</h2>
                    <button className="gd-icon-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="gd-modal-label">
                    <span>{label}</span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <input
                            autoFocus
                            className="gd-modal-input"
                            style={{ flex: 1 }}
                            value={value}
                            placeholder={placeholder}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        {/* Permission Selector - only shown during sharing */}
                        {title.toLowerCase().includes('share') && (
                            <select
                                className="gd-modal-input"
                                value={role}
                                onChange={(e) => onRoleChange(e.target.value)}
                                style={{ width: 'auto', cursor: 'pointer' }}
                            >
                                <option value="read">Viewer</option>
                                <option value="write">Editor</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="gd-modal-actions">
                    <button className="gd-btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="gd-btn-primary" onClick={onSave}>Done</button>
                </div>
            </div>
        </div>
    );
}