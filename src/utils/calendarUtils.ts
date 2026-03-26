import dayjs from 'dayjs';
import { Colors } from '../constants/theme';

export type MarkedDates = {
  [date: string]: {
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
    marked?: boolean;
    dotColor?: string;
    customStyles?: object;
    today?: boolean;
  };
};

/**
 * Builds the markedDates object for react-native-calendars.
 * - Logged days: green selected background
 * - Missed days (past, before today, not logged): red dot
 * - Today: orange ring with bold text (always distinct)
 */
export const buildMarkedDates = (
  loggedDates: string[],
  today: string
): MarkedDates => {
  const marked: MarkedDates = {};
  const sanitizedDates = loggedDates.map(d => d.substring(0, 10));
  const loggedSet = new Set(sanitizedDates);

  // Mark all logged dates
  sanitizedDates.forEach((date) => {
    marked[date] = {
      selected: true,
      selectedColor: Colors.calendarLogged,
      selectedTextColor: '#FFFFFF',
    };
  });

  // Mark missed days (past days from 1st of current month to yesterday)
  const firstOfMonth = dayjs(today).startOf('month');
  const yesterday = dayjs(today).subtract(1, 'day');
  let cursor = firstOfMonth;

  while (cursor.isBefore(dayjs(today)) || cursor.isSame(dayjs(today).subtract(1, 'day'))) {
    const dateStr = cursor.format('YYYY-MM-DD');
    if (!loggedSet.has(dateStr) && dateStr < today) {
      marked[dateStr] = {
        marked: true,
        dotColor: Colors.calendarMissed,
        selectedTextColor: Colors.textPrimary,
      };
    }
    cursor = cursor.add(1, 'day');
    if (cursor.isAfter(yesterday)) break;
  }

  // Today always gets a distinct orange treatment (overrides if already logged)
  if (loggedSet.has(today)) {
    marked[today] = {
      selected: true,
      selectedColor: Colors.calendarLogged,
      selectedTextColor: '#FFFFFF',
      marked: true,
      dotColor: Colors.calendarToday,
    };
  } else {
    marked[today] = {
      selected: true,
      selectedColor: Colors.calendarToday,
      selectedTextColor: '#FFFFFF',
    };
  }

  return marked;
};
