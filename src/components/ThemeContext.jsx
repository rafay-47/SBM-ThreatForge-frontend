import React, { createContext, useContext, useMemo } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, colorMode, effectiveTheme, setThemeMode }) => {
  const value = useMemo(
    () => ({
      colorMode,
      effectiveTheme,
      setThemeMode,
      isDark: effectiveTheme === "dark",
      isLight: effectiveTheme === "light",
      isSystem: colorMode === "system",
    }),
    [colorMode, effectiveTheme, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
