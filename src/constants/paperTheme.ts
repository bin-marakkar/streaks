import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors } from './colors';

// ─── React Native Paper Themes ───────────────────────────────────────────────
export const lightPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.accent,
    background: Colors.background,
    surface: Colors.surface,
    surfaceVariant: Colors.surfaceVariant,
    onPrimary: Colors.textOnPrimary,
    onBackground: Colors.textPrimary,
    onSurface: Colors.textPrimary,
  },
};

export const darkPaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.primaryLight,
    secondary: Colors.accentLight,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    surfaceVariant: Colors.dark.surfaceVariant,
    onPrimary: Colors.textOnPrimary,
    onBackground: Colors.dark.textPrimary,
    onSurface: Colors.dark.textPrimary,
  },
};
