import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useAttendanceStore } from '../store/attendanceStore';
import { LogButton } from '../components/LogButton';
import { StreakBadge } from '../components/StreakBadge';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { formatDisplayDate, todayStr } from '../utils/dateUtils';
import { useTheme } from '../hooks/useTheme';

export const DashboardScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { selectedActivityId, getActivityStats, logToday, isLoading } = useAttendanceStore();
  const stats = selectedActivityId
    ? getActivityStats(selectedActivityId)
    : { isTodayLogged: false, currentStreak: 0, longestStreak: 0 };
  const { isTodayLogged, currentStreak, longestStreak } = stats;

  const handleLogToday = () => {
    if (selectedActivityId) logToday(selectedActivityId);
  };

  const headerScale = useSharedValue(0.9);
  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerScale.value,
  }));

  useEffect(() => {
    headerScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  const today = todayStr();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header row: greeting + dark mode toggle */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>
            {isTodayLogged ? 'Great job! 🎉' : 'Ready to check in? 👋'}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDisplayDate(today)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleEmoji}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Status Card */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.statusCard, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.statusIconWrap, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.statusEmoji}>{isTodayLogged ? '✅' : '⏳'}</Text>
        </View>
        <View style={styles.statusText}>
          <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
            {isTodayLogged ? 'Logged In Today' : 'Not Yet Logged'}
          </Text>
          <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
            {isTodayLogged
              ? 'Your attendance is recorded for today.'
              : 'Tap the button below to log your attendance.'}
          </Text>
        </View>
      </Animated.View>

      {/* Streak Badges */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.badgeRow}>
        <StreakBadge
          label="Current Streak"
          count={currentStreak}
          emoji="🔥"
          accent={Colors.primary}
          accentLight={colors.primaryContainer}
        />
        <View style={styles.badgeDivider} />
        <StreakBadge
          label="Longest Streak"
          count={longestStreak}
          emoji="⚡"
          accent={Colors.warning}
          accentLight={isDark ? '#3A2B0A' : Colors.warningLight}
        />
      </Animated.View>

      {/* Log Button */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.buttonWrapper}>
        <LogButton
          onPress={handleLogToday}
          isLogged={isTodayLogged}
          isLoading={isLoading}
        />
      </Animated.View>

      {/* Motivational Footer */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
          {currentStreak === 0
            ? 'Start your streak today! Every journey begins with a single step. 💪'
            : currentStreak < 7
            ? `${currentStreak} day${currentStreak > 1 ? 's' : ''} strong! Keep it up! 💪`
            : currentStreak < 30
            ? `${currentStreak} days! You're on fire! 🔥`
            : `${currentStreak} days! Absolutely legendary! 🏆`}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...Typography.headlineLarge,
    marginBottom: 4,
  },
  date: {
    ...Typography.bodyMedium,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  themeToggleEmoji: {
    fontSize: 20,
  },
  statusCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  statusEmoji: {
    fontSize: 24,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    ...Typography.titleLarge,
    marginBottom: 2,
  },
  statusSubtitle: {
    ...Typography.bodySmall,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  badgeDivider: {
    width: Spacing.sm,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  motivationText: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
  },
});
