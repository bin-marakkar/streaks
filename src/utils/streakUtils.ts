import dayjs from 'dayjs';
import { DATE_FORMAT } from '../constants/dateFormat';
import { todayStr, yesterdayStr } from './dateUtils';

/**
 * Calculates the current streak of consecutive logged days.
 *
 * Algorithm:
 * 1. Build a Set for O(1) lookups.
 * 2. Start at "yesterday" (if today is already logged, count from today).
 * 3. Walk backwards day-by-day; increment streak for each consecutive logged day.
 * 4. Break on the first unlogged day found.
 *
 * Special case: If today is not yet logged, we check from yesterday so the
 * streak doesn't break just because the user hasn't logged today yet.
 * If today IS logged, we count from today so it's included in the streak.
 */
export const calculateCurrentStreak = (loggedDates: string[]): number => {
  if (loggedDates.length === 0) return 0;

  const sanitizedDates = loggedDates.map(d => d.substring(0, 10));
  const loggedSet = new Set(sanitizedDates);
  const today = todayStr();
  const yesterday = yesterdayStr();

  // Determine start point:
  // - If today is logged → start counting from today
  // - If today is NOT logged but yesterday was → still show the ongoing streak from yesterday
  // - If neither today nor yesterday is logged → streak is 0 (it has already broken)
  let pivot = loggedSet.has(today) ? today : yesterday;

  if (!loggedSet.has(pivot)) {
    return 0;
  }

  let streak = 0;
  let cursor = dayjs(pivot);

  while (loggedSet.has(cursor.format(DATE_FORMAT))) {
    streak++;
    cursor = cursor.subtract(1, 'day');
  }

  return streak;
};

/**
 * Calculates the longest streak ever recorded.
 *
 * Algorithm:
 * 1. Sort all logged dates ascending.
 * 2. Walk forward; if consecutive days continue, grow the current run.
 * 3. On a gap, reset. Track the maximum run seen.
 */
export const calculateLongestStreak = (loggedDates: string[]): number => {
  if (loggedDates.length === 0) return 0;

  const sanitizedDates = loggedDates.map(d => d.substring(0, 10));

  // Sort ascending
  const sorted = [...sanitizedDates].sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1]);
    const curr = dayjs(sorted[i]);

    // Check if dates are exactly 1 day apart
    if (curr.diff(prev, 'day') === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Gap found — reset current streak
      currentStreak = 1;
    }
  }

  return longestStreak;
};

/**
 * Returns true if the streak is "active" — i.e., either today or yesterday is logged.
 * Useful to decide whether to show a "at risk" indicator.
 */
export const isStreakActive = (loggedDates: string[]): boolean => {
  if (loggedDates.length === 0) return false;
  const sanitizedDates = loggedDates.map(d => d.substring(0, 10));
  const loggedSet = new Set(sanitizedDates);
  return loggedSet.has(todayStr()) || loggedSet.has(yesterdayStr());
};
