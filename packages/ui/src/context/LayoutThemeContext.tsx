import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../AuthContext';

interface LayoutThemeContextType {
  layoutTheme: string;
  themeConfig: {
    navStyle: string;
    contentStyle: string;
    density: string;
    borderStyle: string;
  };
}

const LayoutThemeContext = createContext<LayoutThemeContextType | null>(null);

const VALID_THEMES = ['modern', 'executive', 'minimal', 'classic'];

const THEME_CONFIGS: Record<string, any> = {
  modern:    { navStyle: 'sidebar',      contentStyle: 'cards',  density: 'normal',  borderStyle: 'rounded' },
  executive: { navStyle: 'topbar',       contentStyle: 'tables', density: 'dense',   borderStyle: 'sharp' },
  minimal:   { navStyle: 'slim-sidebar', contentStyle: 'flat',   density: 'spacious', borderStyle: 'none' },
  classic:   { navStyle: 'tabs',         contentStyle: 'grid',   density: 'compact',  borderStyle: 'subtle' },
};

export function LayoutThemeProvider({ children }: { children: React.ReactNode }) {
  const { org } = useAuth() as any;
  const layoutTheme = org?.layout_theme && VALID_THEMES.includes(org.layout_theme) ? org.layout_theme : 'modern';
  
  const themeConfig = useMemo(() => THEME_CONFIGS[layoutTheme], [layoutTheme]);

  // Apply layout theme globally to document body
  React.useEffect(() => {
    document.documentElement.setAttribute('data-layout-theme', layoutTheme);
  }, [layoutTheme]);

  return (
    <LayoutThemeContext.Provider value={{ layoutTheme, themeConfig }}>
      {children}
    </LayoutThemeContext.Provider>
  );
}

export function useLayoutTheme() {
  const context = useContext(LayoutThemeContext);
  if (!context) throw new Error("useLayoutTheme must be used within LayoutThemeProvider");
  return context;
}
