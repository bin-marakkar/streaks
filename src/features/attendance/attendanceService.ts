import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayStr } from '../../utils/dateUtils';

const STORAGE_KEY = 'streak_logged_dates';

/**
 * Attendance Service
 * Handles persistence of logged dates via AsyncStorage.
 * All dates are stored as YYYY-MM-DD strings in a JSON array.
 */
export const attendanceService = {
  /**
   * Load all logged dates from storage.
   * Returns an empty array if nothing has been stored.
   */
  getLoggedDates: async (): Promise<string[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  },

  /**
   * Log today's date. Idempotent — calling this multiple times on the
   * same day has no effect (today is only recorded once).
   *
   * @returns true if the date was newly logged, false if already logged.
   */
  logToday: async (): Promise<boolean> => {
    const dates = await attendanceService.getLoggedDates();
    const today = todayStr();

    if (dates.includes(today)) {
      return false; // already logged today
    }

    const updated = [...dates, today];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  /**
   * Returns true if today has already been logged.
   */
  isTodayLogged: async (): Promise<boolean> => {
    const dates = await attendanceService.getLoggedDates();
    return dates.includes(todayStr());
  },

  /**
   * Clear all logged data. Utility for development / reset flow.
   */
  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
