const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const DISPLAY_NAME_KEY = "username";

function safeLocalStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

function getDisplayNameKeyForUser(userId) {
  const uid = String(userId || "").trim();
  if (!uid) return null;
  return `displayName:${uid}`;
}

function migrateSessionAuthOnce() {
  if (typeof window === "undefined") return;
  const session = window.sessionStorage;
  const local = safeLocalStorage();
  if (!session || !local) return;

  // If previous implementation stored auth in sessionStorage, move it back to localStorage.
  const sessionToken = session.getItem(TOKEN_KEY);
  const sessionUserId = session.getItem(USER_ID_KEY);
  const sessionName = session.getItem(DISPLAY_NAME_KEY);

  if (!local.getItem(TOKEN_KEY) && sessionToken) local.setItem(TOKEN_KEY, sessionToken);
  if (!local.getItem(USER_ID_KEY) && sessionUserId) local.setItem(USER_ID_KEY, sessionUserId);
  if (!local.getItem(DISPLAY_NAME_KEY) && sessionName) local.setItem(DISPLAY_NAME_KEY, sessionName);

  session.removeItem(TOKEN_KEY);
  session.removeItem(USER_ID_KEY);
  session.removeItem(DISPLAY_NAME_KEY);
}

export function getAuthToken() {
  migrateSessionAuthOnce();
  const local = safeLocalStorage();
  return local?.getItem(TOKEN_KEY) || null;
}

export function getAuthUserId() {
  migrateSessionAuthOnce();
  const local = safeLocalStorage();
  return local?.getItem(USER_ID_KEY) || null;
}

export function getAuthDisplayName() {
  migrateSessionAuthOnce();
  const local = safeLocalStorage();
  if (!local) return null;

  const userId = local.getItem(USER_ID_KEY);
  const perUserKey = getDisplayNameKeyForUser(userId);
  if (perUserKey) {
    const perUser = local.getItem(perUserKey);
    if (perUser) return perUser;
  }

  return local.getItem(DISPLAY_NAME_KEY) || null;
}

export function setAuth({ token, userId, displayName } = {}) {
  const local = safeLocalStorage();
  if (!local) return;

  if (token) local.setItem(TOKEN_KEY, String(token));
  if (userId) local.setItem(USER_ID_KEY, String(userId));

  if (displayName) {
    local.setItem(DISPLAY_NAME_KEY, String(displayName));
    const perUserKey = getDisplayNameKeyForUser(userId);
    if (perUserKey) local.setItem(perUserKey, String(displayName));
  }

  // Clear legacy key used by some components.
  local.removeItem("name");
}

export function clearAuth() {
  const local = safeLocalStorage();
  if (!local) return;

  local.removeItem(TOKEN_KEY);
  local.removeItem(USER_ID_KEY);
  local.removeItem(DISPLAY_NAME_KEY);
  local.removeItem("name");
}
