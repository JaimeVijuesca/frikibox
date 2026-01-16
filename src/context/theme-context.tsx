
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  accent: string;
  ring: string;
};

type Theme = {
  name: string;
  label: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
};

export const themes: Theme[] = [
  {
    name: 'default',
    label: 'Friki (Morado)',
    colors: {
      light: {
        background: '283 40% 95%',
        foreground: '283 10% 10%',
        card: '283 20% 100%',
        cardForeground: '283 10% 10%',
        primary: '283 100% 41%',
        accent: '182 100% 74%',
        ring: '283 100% 41%',
      },
      dark: {
        background: '283 15% 10%',
        foreground: '283 10% 95%',
        card: '283 10% 15%',
        cardForeground: '283 10% 95%',
        primary: '182 100% 74%',
        accent: '283 100% 41%',
        ring: '182 100% 74%',
      },
    },
  },
  {
    name: 'blue',
    label: 'Jedi (Azul)',
    colors: {
      light: {
        background: '220 50% 96%',
        foreground: '220 10% 10%',
        card: '220 25% 100%',
        cardForeground: '220 10% 10%',
        primary: '221.2 83.2% 53.3%',
        accent: '190 95% 68%',
        ring: '221.2 83.2% 53.3%',
      },
      dark: {
        background: '220 20% 10%',
        foreground: '220 10% 95%',
        card: '220 15% 15%',
        cardForeground: '220 10% 95%',
        primary: '190 95% 68%',
        accent: '221.2 83.2% 53.3%',
        ring: '190 95% 68%',
      },
    },
  },
  {
    name: 'green',
    label: 'Zelda (Verde)',
    colors: {
      light: {
        background: '140 35% 95%',
        foreground: '140 10% 10%',
        card: '140 20% 99%',
        cardForeground: '140 10% 10%',
        primary: '142.1 76.2% 36.3%',
        accent: '150 90% 70%',
        ring: '142.1 76.2% 36.3%',
      },
      dark: {
        background: '140 20% 9%',
        foreground: '140 10% 95%',
        card: '140 15% 14%',
        cardForeground: '140 10% 95%',
        primary: '150 90% 70%',
        accent: '142.1 76.2% 36.3%',
        ring: '150 90% 70%',
      },
    },
  },
  {
    name: 'red',
    label: 'Sith (Rojo)',
    colors: {
      light: {
        background: '0 50% 96%',
        foreground: '0 10% 10%',
        card: '0 25% 100%',
        cardForeground: '0 10% 10%',
        primary: '0 84.2% 60.2%',
        accent: '0 90% 80%',
        ring: '0 84.2% 60.2%',
      },
      dark: {
        background: '0 20% 10%',
        foreground: '0 5% 95%',
        card: '0 15% 15%',
        cardForeground: '0 5% 95%',
        primary: '0 90% 80%',
        accent: '0 84.2% 60.2%',
        ring: '0 90% 80%',
      },
    },
  },
  {
    name: 'orange',
    label: 'Dragon Ball (Naranja)',
    colors: {
      light: {
        background: '30 60% 95%',
        foreground: '30 10% 10%',
        card: '30 35% 100%',
        cardForeground: '30 10% 10%',
        primary: '24.6 95% 53.1%',
        accent: '30 90% 70%',
        ring: '24.6 95% 53.1%',
      },
      dark: {
        background: '30 20% 10%',
        foreground: '30 5% 95%',
        card: '30 15% 15%',
        cardForeground: '30 5% 95%',
        primary: '30 90% 70%',
        accent: '24.6 95% 53.1%',
        ring: '30 90% 70%',
      },
    },
  },
];


interface ThemeContextType {
  theme: Theme | null;
  setTheme: (themeName: string) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, _setTheme] = useState<Theme | null>(null);
  const [mode, _setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Theme preference
    const storedThemeName = localStorage.getItem('frikibox-theme') || themes[0].name;
    const initialTheme = themes.find(t => t.name === storedThemeName) || themes[0];
    
    // Mode preference
    const storedMode = localStorage.getItem('frikibox-mode') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = storedMode || (systemPrefersDark ? 'dark' : 'light');

    _setMode(initialMode);
    _setTheme(initialTheme);
    
    applyTheme(initialTheme, initialMode);
    
    if (initialMode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
  }, []);

  const applyTheme = (themeToApply: Theme, currentMode: 'light' | 'dark') => {
      const root = document.documentElement;
      const themeColors = themeToApply.colors[currentMode];
      
      Object.entries(themeColors).forEach(([key, value]) => {
        // camelCase to kebab-case
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });
  }

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      _setTheme(newTheme);
      localStorage.setItem('frikibox-theme', themeName);
      applyTheme(newTheme, mode);
    }
  };

  const setMode = (newMode: 'light' | 'dark') => {
      _setMode(newMode);
      localStorage.setItem('frikibox-mode', newMode);
      if (newMode === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
      // Re-apply theme with the new mode
      if (theme) {
        applyTheme(theme, newMode);
      }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
