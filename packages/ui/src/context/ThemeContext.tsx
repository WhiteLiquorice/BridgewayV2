import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface ThemeContextType {
  primaryColor: string;
  theme: string;
  setTheme: (t: string) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'bw_theme';
const ACCENT_KEY = 'bw_accent_color';
const VALID_THEMES = ['dark', 'midnight', 'slate', 'navy', 'light'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { org } = useAuth() as any; // Temporary cast until org is strongly typed in AuthContext

  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored && VALID_THEMES.includes(stored) ? stored : 'light';
  });

  const [accentColor, setAccentState] = useState(() => {
    return localStorage.getItem(ACCENT_KEY) || '#f59e0b';
  });

  useEffect(() => {
    const color = org?.primary_color || '#f59e0b';
    document.documentElement.style.setProperty('--bw-primary', color);
  }, [org?.primary_color]);

  useEffect(() => {
    const effective = org?.primary_color || accentColor;
    document.documentElement.style.setProperty('--bw-accent', effective);
    
    // Convert hex to rgb string for tailwind opacity utility
    const hex = effective.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      document.documentElement.style.setProperty('--bw-accent-rgb', `${r}, ${g}, ${b}`);
    }
  }, [accentColor, org?.primary_color]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  function setTheme(newTheme: string) {
    if (!VALID_THEMES.includes(newTheme)) return;
    localStorage.setItem(THEME_KEY, newTheme);
    setThemeState(newTheme);
  }

  function setAccentColor(color: string) {
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;
    localStorage.setItem(ACCENT_KEY, color);
    setAccentState(color);
  }

  return (
    <ThemeContext.Provider value={{
      primaryColor: org?.primary_color || '#f59e0b',
      theme,
      setTheme,
      accentColor,
      setAccentColor,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
