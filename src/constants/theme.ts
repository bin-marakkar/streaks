import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// ─── Color Palette ───────────────────────────────────────────────────────────
export const Colors = {
  // Brand
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  primaryLight: '#9B94FF',
  primaryContainer: '#EDE9FF',

  // Accent
  accent: '#FF6584',
  accentLight: '#FFB3C1',

  // Semantic
  success: '#2EC4B6',
  successLight: '#C8F5F1',
  warning: '#FF9F1C',
  warningLight: '#FFE8C2',
  error: '#E63946',
  errorLight: '#FADDE1',

  // Surface
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceVariant: '#F0EEFF',
  card: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B6B8A',
  textDisabled: '#B0B0C8',
  textOnPrimary: '#FFFFFF',

  // Calendar
  calendarLogged: '#6C63FF',
  calendarLoggedDot: '#6C63FF',
  calendarMissed: '#E63946',
  calendarMissedDot: '#E63946',
  calendarToday: '#FF9F1C',
  calendarTodayText: '#FFFFFF',

  // Dark variants
  dark: {
    background: '#0F0E1A',
    surface: '#1A1928',
    surfaceVariant: '#252437',
    card: '#1A1928',
    textPrimary: '#F0EEFF',
    textSecondary: '#A09DC0',
    primaryContainer: '#2C2750',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Typography = {
  displayLarge: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -0.5 },
  displayMedium: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.25 },
  headlineLarge: { fontSize: 22, fontWeight: '700' as const },
  headlineMedium: { fontSize: 18, fontWeight: '600' as const },
  titleLarge: { fontSize: 16, fontWeight: '600' as const },
  titleMedium: { fontSize: 14, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, fontWeight: '400' as const },
  labelLarge: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.1 },
  labelMedium: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
};

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
