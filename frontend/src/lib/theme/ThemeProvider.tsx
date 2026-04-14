'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { themes, defaultTheme, type Theme } from './themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'portalapp-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useLayoutEffect(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const saved = themes.find((t) => t.id === savedThemeId);
      if (saved) setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  const setTheme = (themeId: string) => {
    const newTheme = themes.find((t) => t.id === themeId);
    if (newTheme) {
      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
