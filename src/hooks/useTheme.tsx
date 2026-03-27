import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, lightPaperTheme, darkPaperTheme, StorageKeys } from '../constants';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof Colors & {
    background: string;
    surface: string;
    surfaceVariant: string;
    card: string;
    textPrimary: string;
    textSecondary: string;
    primaryContainer: string;
  };
  paperTheme: typeof lightPaperTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  // Load persisted theme on mount
  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.THEME).then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    });
  }, []);

  const isDark = mode === 'dark';

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(StorageKeys.THEME, next);
      return next;
    });
  };

  const resolvedColors = {
    ...Colors,
    background: isDark ? Colors.dark.background : Colors.background,
    surface: isDark ? Colors.dark.surface : Colors.surface,
    surfaceVariant: isDark ? Colors.dark.surfaceVariant : Colors.surfaceVariant,
    card: isDark ? Colors.dark.card : Colors.card,
    textPrimary: isDark ? Colors.dark.textPrimary : Colors.textPrimary,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.textSecondary,
    primaryContainer: isDark ? Colors.dark.primaryContainer : Colors.primaryContainer,
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        isDark,
        colors: resolvedColors,
        paperTheme: isDark ? darkPaperTheme : lightPaperTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
