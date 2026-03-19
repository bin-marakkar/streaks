import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import dayjs from 'dayjs';
import { useAttendanceStore } from '../store/attendanceStore';
import { StreakBadge } from '../components/StreakBadge';
import { MonthlyProgress } from '../components/MonthlyProgress';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import {
  loggedDaysThisMonth,
  totalDaysPassedThisMonth,
} from '../utils/dateUtils';

export const StatsScreen: React.FC = () => {
  const { loggedDates, currentStreak, longestStreak, resetAll } =
    useAttendanceStore();

  const thisMonthLogged = loggedDaysThisMonth(loggedDates);
  const thisMonthTotal = totalDaysPassedThisMonth();
  const totalLogged = loggedDates.length;

  // Find the first ever logged date
  const firstLoggedDate =
    loggedDates.length > 0
      ? dayjs([...loggedDates].sort()[0]).format('MMMM D, YYYY')
      : null;

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your logged days and streak history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAll(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Track your consistency over time</Text>
      </Animated.View>

      {/* Streak Badges */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.badgeRow}>
        <StreakBadge
          label="Current Streak"
          count={currentStreak}
          emoji="🔥"
          accent={Colors.primary}
          accentLight={Colors.primaryContainer}
        />
        <StreakBadge
          label="Best Streak"
          count={longestStreak}
          emoji="🏆"
          accent={Colors.warning}
          accentLight={Colors.warningLight}
        />
      </Animated.View>

      {/* Monthly Progress */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <MonthlyProgress
          loggedDays={thisMonthLogged}
          totalDays={thisMonthTotal}
        />
      </Animated.View>

      {/* Summary Cards */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalLogged}</Text>
          <Text style={styles.summaryLabel}>Total Days Logged</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{thisMonthLogged}</Text>
          <Text style={styles.summaryLabel}>This Month</Text>
        </View>
      </Animated.View>

      {/* First Login */}
      {firstLoggedDate && (
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.infoCard}>
          <Text style={styles.infoEmoji}>📅</Text>
          <View>
            <Text style={styles.infoLabel}>Journey Started</Text>
            <Text style={styles.infoValue}>{firstLoggedDate}</Text>
          </View>
        </Animated.View>
      )}

      {/* Reset button */}
      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.resetWrapper}>
        <Text style={styles.resetButton} onPress={handleReset}>
          🗑  Reset All Data
        </Text>
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
  badgeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryValue: {
    ...Typography.displayMedium,
    color: Colors.primary,
  },
  summaryLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoEmoji: {
    fontSize: 28,
  },
  infoLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  resetWrapper: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resetButton: {
    ...Typography.bodyMedium,
    color: Colors.error,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
});
