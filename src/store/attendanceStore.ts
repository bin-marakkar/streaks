import { create } from 'zustand';
import { attendanceService } from '../features/attendance/attendanceService';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { todayStr } from '../utils/dateUtils';

interface AttendanceState {
  /** All dates logged in YYYY-MM-DD format */
  loggedDates: string[];
  /** Consecutive days logged ending at today (or yesterday) */
  currentStreak: number;
  /** Maximum consecutive days ever recorded */
  longestStreak: number;
  /** Whether the user has already logged in today */
  isTodayLogged: boolean;
  /** True while an async action is in progress */
  isLoading: boolean;

  // Actions
  /** Load persisted data from AsyncStorage. Call this on app start. */
  hydrate: () => Promise<void>;
  /** Log today. Prevents duplicates. Recalculates streaks automatically. */
  logToday: () => Promise<void>;
  /** Reset all data (dev utility). */
  resetAll: () => Promise<void>;
}

/**
 * Helper to recalculate derived state from a list of logged dates.
 */
const deriveStats = (loggedDates: string[]) => ({
  currentStreak: calculateCurrentStreak(loggedDates),
  longestStreak: calculateLongestStreak(loggedDates),
  isTodayLogged: loggedDates.includes(todayStr()),
});

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  loggedDates: [],
  currentStreak: 0,
  longestStreak: 0,
  isTodayLogged: false,
  isLoading: false,

  /**
   * Hydrate the store from AsyncStorage.
   * Should be called once when the app mounts (in App.tsx or a top-level component).
   */
  hydrate: async () => {
    set({ isLoading: true });
    const dates = await attendanceService.getLoggedDates();
    set({ loggedDates: dates, ...deriveStats(dates), isLoading: false });
  },

  /**
   * Log today's date.
   * - Calls the service (idempotent — no-op if already logged).
   * - Updates loggedDates and recalculates streak stats.
   */
  logToday: async () => {
    const { isTodayLogged } = get();
    if (isTodayLogged) return; // Guard: already logged today

    set({ isLoading: true });
    await attendanceService.logToday();
    const today = todayStr();
    const updatedDates = [...get().loggedDates, today];
    set({ loggedDates: updatedDates, ...deriveStats(updatedDates), isLoading: false });
  },

  /**
   * Clear all stored data and reset the store to initial state.
   */
  resetAll: async () => {
    await attendanceService.clearAll();
    set({
      loggedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      isTodayLogged: false,
    });
  },
}));
