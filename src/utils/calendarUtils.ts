import dayjs from 'dayjs';
import { Colors, BorderRadius } from '../constants/theme';

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
      customStyles: {
        container: {
          backgroundColor: Colors.calendarLogged,
          borderRadius: BorderRadius.sm,
        },
        text: {
          color: Colors.textPrimary,
          fontWeight: '600',
        },
      },
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
        customStyles: {
          container: {
            backgroundColor: Colors.calendarMissed,
            borderRadius: BorderRadius.sm,
          },
          text: {
            color: Colors.textPrimary,
            fontWeight: '600',
          },
        },
      };
    }
    cursor = cursor.add(1, 'day');
    if (cursor.isAfter(yesterday)) break;
  }

  // Today always gets a distinct orange treatment (overrides if already logged)
  if (loggedSet.has(today)) {
    marked[today] = {
      customStyles: {
        container: {
          backgroundColor: Colors.calendarToday,
          borderRadius: BorderRadius.sm,
        },
        text: {
          color: Colors.textPrimary,
          fontWeight: 'bold',
        },
      },
    };
  } else {
    marked[today] = {
      customStyles: {
        container: {
          backgroundColor: Colors.calendarToday,
          borderRadius: BorderRadius.sm,
        },
        text: {
          color: Colors.textPrimary,
          fontWeight: 'bold',
        },
      },
    };
  }

  return marked;
};
