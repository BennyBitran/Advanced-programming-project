export default function UserAvatarButton({ avatarUrl, open, onClick }) {
  return (
    <button
      type="button"
      className="gd-avatar"
      onClick={onClick}
      aria-label="Account"
      aria-haspopup="menu"
      aria-expanded={open}
    >
      {avatarUrl ? <img className="gd-avatar-img" src={avatarUrl} alt="User" /> : "G"}
    </button>
  );
}
