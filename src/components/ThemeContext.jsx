import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const STORAGE_KEY = "app_theme";
const LIGHT = "light";
const DARK  = "dark";

// 1. Context banaya
export const ThemeContext = createContext(null);

// 2. Custom Hook — kisi bhi component mein use karo
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
};

// 3. Provider — state + localStorage + toggle sab yahan hai
export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === DARK ? DARK : LIGHT;
    } catch {
      return LIGHT;
    }
  });

  // localStorage mein save karo
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      document.body.style.background = theme === LIGHT ? "#ffffff" : "#1e1e1e";
      document.body.style.color      = theme === LIGHT ? "#000000" : "#ffffff";
    } catch {
      console.warn("localStorage unavailable.");
    }
  }, [theme]);

  // useCallback — stable reference, re-render nahi hoga
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === LIGHT ? DARK : LIGHT));
  }, []);

  // useMemo — sirf theme change hone par naya object banega
  const contextValue = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === DARK }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};