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

  function getUserId() {
    return sessionStorage.getItem("userId") || "";
  }

  function getAvatarKey(uid) {
    return uid ? `avatarUrl:${uid}` : "";
  }

  function readAvatarUrl() {
    const uid = getUserId();
    const fromSession = sessionStorage.getItem("avatarUrl") || ""; // tab value
    const fromLocal = uid ? localStorage.getItem(getAvatarKey(uid)) || "" : ""; // persistent per user
    return fromSession || fromLocal || "";
  }

  const [avatarUrl, setAvatarUrl] = useState(() => readAvatarUrl());

  // On first mount: if session has no avatar yet, copy from local for this user.
  useEffect(() => {
    const uid = getUserId();
    if (!uid) return;

    const sessionValue = sessionStorage.getItem("avatarUrl") || "";
    if (sessionValue) return;

    const localValue = localStorage.getItem(getAvatarKey(uid)) || "";
    if (localValue) {
      sessionStorage.setItem("avatarUrl", localValue);
      setAvatarUrl(localValue);
    }
  }, []);

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
      const uid = getUserId();

      setAvatarUrl(dataUrl);

      // current tab
      sessionStorage.setItem("avatarUrl", dataUrl);

      // persist per-user across tab close
      if (uid) {
        localStorage.setItem(getAvatarKey(uid), dataUrl);
      }

      setOpen(false);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  function onLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("avatarUrl");
    setOpen(false);
    navigate("/login");
  }

  function onViewPhoto() {
    setOpen(false);
    setIsPhotoOpen(true);
  }

  function onRemovePhoto() {
    const uid = getUserId();
    if (uid) localStorage.removeItem(getAvatarKey(uid));
    sessionStorage.removeItem("avatarUrl");
    setAvatarUrl("");
    setOpen(false);
  }

  return (
    <div className="gd-user-menu" ref={wrapperRef}>
      <UserAvatarButton
        avatarUrl={avatarUrl}
        open={open}
        onClick={() => setOpen((v) => !v)}
      />

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
          displayName={sessionStorage.getItem("name") || "Account"}
          email={sessionStorage.getItem("email") || ""}
          onViewPhoto={onViewPhoto}
          onUploadClick={onUploadClick}
          onRemovePhoto={onRemovePhoto}
          onLogout={onLogout}
        />
      )}

      <UserPhotoModal
        open={isPhotoOpen}
        avatarUrl={avatarUrl}
        onClose={() => setIsPhotoOpen(false)}
      />
    </div>
  );
}
