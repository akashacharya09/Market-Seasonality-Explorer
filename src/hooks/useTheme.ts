import { useState, useEffect } from 'react';

export type ThemeMode = 'professional' | 'high-contrast' | 'colorblind' | 'light';

interface ThemeConfig {
  name: string;
  description: string;
  cssVariables: Record<string, string>;
}

const themes: Record<ThemeMode, ThemeConfig> = {
  professional: {
    name: 'Professional Dark',
    description: 'Dark theme optimized for financial data',
    cssVariables: {
      '--background': '220 13% 9%',
      '--foreground': '220 9% 95%',
      '--bull': '134 61% 41%',
      '--bear': '0 84% 60%',
      '--volatility-low': '134 61% 35%',
      '--volatility-medium': '45 93% 47%',
      '--volatility-high': '0 84% 55%',
    }
  },
  'high-contrast': {
    name: 'High Contrast',
    description: 'Maximum contrast for accessibility',
    cssVariables: {
      '--background': '0 0% 0%',
      '--foreground': '0 0% 100%',
      '--bull': '120 100% 50%',
      '--bear': '0 100% 50%',
      '--volatility-low': '120 100% 40%',
      '--volatility-medium': '60 100% 50%',
      '--volatility-high': '0 100% 50%',
    }
  },
  colorblind: {
    name: 'Colorblind Friendly',
    description: 'Optimized for color vision deficiency',
    cssVariables: {
      '--background': '220 13% 9%',
      '--foreground': '220 9% 95%',
      '--bull': '210 100% 60%', // Blue instead of green
      '--bear': '30 100% 50%', // Orange instead of red
      '--volatility-low': '210 100% 50%',
      '--volatility-medium': '60 100% 50%',
      '--volatility-high': '30 100% 45%',
    }
  },
  light: {
    name: 'Light Mode',
    description: 'Light theme for bright environments',
    cssVariables: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 0%',
      '--bull': '134 61% 35%',
      '--bear': '0 84% 45%',
      '--volatility-low': '134 61% 30%',
      '--volatility-medium': '45 93% 40%',
      '--volatility-high': '0 84% 45%',
    }
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('professional');

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    const themeConfig = themes[theme];
    
    Object.entries(themeConfig.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme);
    } else {
      applyTheme('professional');
    }
  };

  useEffect(() => {
    initializeTheme();
  }, []);

  return {
    currentTheme,
    availableThemes: Object.entries(themes).map(([key, config]) => ({
      value: key as ThemeMode,
      ...config
    })),
    applyTheme
  };
};