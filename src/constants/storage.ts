// ─── AsyncStorage Keys ───────────────────────────────────────────────────────
// Single source of truth for all AsyncStorage keys used in the app.
export const StorageKeys = {
  ACTIVITIES: 'streak_activities',
  LOGS:       'streak_logs',
  NOTES:      'streak_notes',
  THEME:      '@streak_counter_theme',
  CONFETTI:   '@streak_counter_confetti',
} as const;
