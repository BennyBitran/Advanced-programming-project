import { useState, useEffect, useRef } from "react";

export default function FileMenu({ file, onToggleStar, onTrash, onMove }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
          <button onClick={(e) => handleAction(e, () => onToggleStar(file.id, !file.isStarred))}>
            <span className="material-symbols-outlined">
              {file.isStarred ? "star_half" : "star"}
            </span>
            {file.isStarred ? "Unstar" : "Star"}
          </button>
          
          <button onClick={(e) => handleAction(e, () => onMove(file))}>
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
        </div>
      )}
    </div>
  );
}