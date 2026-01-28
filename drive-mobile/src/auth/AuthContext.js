import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, removeToken } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        setIsAuthed(!!token);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      booting,
      isAuthed,
      setAuthed: (v) => setIsAuthed(!!v),
      logout: async () => {
        await removeToken();
        setIsAuthed(false);
      },
    }),
    [booting, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
