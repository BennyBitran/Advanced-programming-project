import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "gd-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("gd-theme-dark", theme === "dark");
    body.classList.toggle("gd-theme-light", theme !== "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
