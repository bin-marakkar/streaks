import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, { FadeInDown } from 'react-native-reanimated';
import dayjs from 'dayjs';
import { useAttendanceStore } from '../store/attendanceStore';
import { CalendarLegend } from '../components/CalendarLegend';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { todayStr } from '../utils/dateUtils';

type MarkedDates = {
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
const buildMarkedDates = (
  loggedDates: string[],
  today: string
): MarkedDates => {
  const marked: MarkedDates = {};
  const loggedSet = new Set(loggedDates);

  // Mark all logged dates
  loggedDates.forEach((date) => {
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

export const CalendarScreen: React.FC = () => {
  const { loggedDates } = useAttendanceStore();
  const today = todayStr();
  const markedDates = buildMarkedDates(loggedDates, today);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <Text style={styles.title}>Attendance Calendar</Text>
        <Text style={styles.subtitle}>
          {loggedDates.length} day{loggedDates.length !== 1 ? 's' : ''} logged total
        </Text>
      </Animated.View>

      {/* Calendar */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.calendarCard}>
        <Calendar
          current={today}
          markedDates={markedDates}
          maxDate={today}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: Colors.surface,
            calendarBackground: Colors.surface,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: Colors.calendarToday,
            dayTextColor: Colors.textPrimary,
            textDisabledColor: Colors.textDisabled,
            arrowColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            textMonthFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
            textDayHeaderFontWeight: '600',
            arrowStyle: { padding: Spacing.xs },
          }}
          style={styles.calendar}
        />
      </Animated.View>

      {/* Legend */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CalendarLegend />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headlineLarge,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  calendarCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  calendar: {
    borderRadius: BorderRadius.xl,
  },
});
