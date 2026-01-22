import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatarButton from "./userAvatar";
import UserDropdown from "./userDropDown";
import UserPhotoModal from "./userProfileModal";
import { updateUserImage } from "../../api/api.js";
 
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
    (async () => {
      const dataUrl = String(reader.result || "");
      const uid = getUserId();
      if (!uid) return;

      try {
        // 1) persist to backend
        await updateUserImage(uid, dataUrl);

        // 2) update UI + storage
        setAvatarUrl(dataUrl);
        sessionStorage.setItem("avatarUrl", dataUrl);
        localStorage.setItem(getAvatarKey(uid), dataUrl);

        setOpen(false);
      } catch (err) {
        // optional: show an alert; or just silently fail
        console.error(err);
      }
    })();
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
  (async () => {
    const uid = getUserId();
    if (!uid) return;

    try {
      // 1) persist removal to backend
      await updateUserImage(uid, "");

      // 2) update UI + storage
      localStorage.removeItem(getAvatarKey(uid));
      sessionStorage.removeItem("avatarUrl");
      setAvatarUrl("");
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  })();
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
