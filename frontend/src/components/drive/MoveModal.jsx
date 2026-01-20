// components/drive/MoveModal.js
import React, { useState, useEffect } from 'react';
import { listFiles } from '../../api/api';

export default function MoveModal({ open, onMove, onClose, fileName }) {
    const [currentPath, setCurrentPath] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);

    const currentFolderId = currentPath.length > 0
        ? currentPath[currentPath.length - 1].id
        : null;

    useEffect(() => {
        //show always root (my drive) folder first
        if (open) {
            setCurrentPath([]);
            loadFolders(null);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            loadFolders(currentFolderId);
        }
    }, [currentFolderId]);

    const loadFolders = async (parentId) => {
        setLoading(true);
        try {
            let data;
            if (parentId === null) data = await listFiles({});
            else data = await listFiles({ parentId: parentId });

            setFolders(data.filter(f => f.type === 'folder'));
        } catch (err) {
            console.error("Failed to load folders", err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="gd-modal">
            <div className="gd-modal-card gd-move-modal">
                <div className="gd-modal-header">
                    <h2>Move "{fileName}"</h2>
                    <button className="gd-icon-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="gd-modal-body">
                    {/* Path navigation */}
                    <div className="gd-move-path">
                        <button
                            className="gd-icon-btn"
                            onClick={() => setCurrentPath(currentPath.slice(0, -1))}
                            disabled={currentPath.length === 0}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <span>{currentPath.length === 0 ? "My Drive" : currentPath[currentPath.length - 1].name}</span>
                    </div>

                    {/* Folder List - Reusing nav-item style for consistency */}
                    <div className="gd-move-list">
                        {loading ? <p className="gd-muted">Loading folders...</p> :
                            folders.map(folder => (
                                <button
                                    key={folder.id}
                                    className="gd-nav-item" // Reuses your sidebar nav styling
                                    onClick={() => setCurrentPath([...currentPath, { id: folder.id, name: folder.name }])}
                                >
                                    <span className="material-symbols-outlined">folder</span>
                                    <span>{folder.name}</span>
                                </button>
                            ))
                        }
                        {!loading && folders.length === 0 && <p className="gd-muted">No subfolders here</p>}
                    </div>
                </div>

                <div className="gd-modal-actions"> {/* Reuses flex-end action bar */}
                    <button className="gd-btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="gd-btn-primary"
                        onClick={() => onMove(currentFolderId)}
                    >
                        Move Here
                    </button>
                </div>
            </div>
        </div>
    );
}