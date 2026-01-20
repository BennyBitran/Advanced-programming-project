import { useState, useEffect, useRef } from "react";

export default function FileMenu({ file,
  onToggleStar,
  onTrash,
  activeNav,
  onRestore,
  onDeletePermanently,
  onOpenMoveModal
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const isTrashView = activeNav === 'trash' || file.isTrashed;

  // Close menu if user clicks anywhere else
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (e, actionFn) => {
    e.preventDefault();
    e.stopPropagation();
    actionFn();
    setIsOpen(false);
  };

  return (
    <div className="gd-menu-container" ref={menuRef}>
      <button
        className="gd-icon-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {isOpen && (
        <div className="gd-dropdown">
          {/* File is in Trash */}
          {file.isTrashed ? (
            <>
              <button onClick={(e) => handleAction(e, () => onRestore(file.id))}>
                <span className="material-symbols-outlined">restore_from_trash</span>
                Restore
              </button>

              <button
                className="gd-danger"
                onClick={(e) => handleAction(e, () => onDeletePermanently(file.id))}
              >
                <span className="material-symbols-outlined">delete_forever</span>
                Delete Permanently
              </button>
            </>
          ) : (
            /* non trashed file */
            <>
              <button onClick={(e) => handleAction(e, () => onToggleStar(file.id, !file.isStarred))}>
                <span className="material-symbols-outlined">
                  {file.isStarred ? "star_half" : "star"}
                </span>
                {file.isStarred ? "Unstar" : "Star"}
              </button>

              <button onClick={() => {
                onOpenMoveModal(file);  //call open moving modal
                setIsOpen(false); //close file menu
              }}>
                <span className="material-symbols-outlined">drive_file_move</span>
                Move to...
              </button>

              <button
                className="gd-danger"
                onClick={(e) => handleAction(e, () => onTrash(file.id))}
              >
                <span className="material-symbols-outlined">delete</span>
                Move to Trash
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}