import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatarButton from "./userAvatar";
import UserDropdown from "./userDropDown";
import UserPhotoModal from "./userProfileModal";


export default function UserMenu() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem(getAvatarKey()) || "");

  // close on outside click
  useEffect(() => {
    function onMouseDown(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function onUploadClick() {
    fileInputRef.current?.click();
  }

  function onAvatarFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setAvatarUrl(dataUrl);
      localStorage.setItem(getAvatarKey(), dataUrl);
      setOpen(false);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  function onLogout() {
    // Adjust keys if you store different auth fields
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setOpen(false);
    navigate("/login");
  }

  function onViewPhoto() {
  setOpen(false);
  setIsPhotoOpen(true);
}

function onRemovePhoto() {
  localStorage.removeItem(getAvatarKey());
  setAvatarUrl("");
  setOpen(false);
}
function getAvatarKey() {
  const uid = localStorage.getItem("userId");
  return uid ? `avatarUrl:${uid}` : "avatarUrl:guest";
};



  return (
    <div className="gd-user-menu" ref={wrapperRef}>
      <UserAvatarButton avatarUrl={avatarUrl} open={open} onClick={() => setOpen((v) => !v)} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onAvatarFileChange}
        style={{ display: "none" }}
      />

      {open && (
  <UserDropdown
    avatarUrl={avatarUrl}
    displayName={localStorage.getItem("name") || "Account"}
    email={localStorage.getItem("email") || ""}
    onViewPhoto={onViewPhoto}
    onUploadClick={onUploadClick}
    onRemovePhoto={onRemovePhoto}
    onLogout={onLogout}
  />
)}
  <UserPhotoModal open={isPhotoOpen} avatarUrl={avatarUrl} onClose={() => setIsPhotoOpen(false)} />

    </div>
    
  );
}
