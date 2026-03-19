import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
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

export const DashboardScreen: React.FC = () => {
  const { selectedActivityId, getActivityStats, logToday, isLoading } = useAttendanceStore();
  const stats = selectedActivityId ? getActivityStats(selectedActivityId) : { isTodayLogged: false, currentStreak: 0, longestStreak: 0 };
  const { isTodayLogged, currentStreak, longestStreak } = stats;

  const handleLogToday = () => {
    if (selectedActivityId) {
      logToday(selectedActivityId);
    }
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
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <Text style={styles.greeting}>
          {isTodayLogged ? 'Great job! 🎉' : 'Ready to check in? 👋'}
        </Text>
        <Text style={styles.date}>{formatDisplayDate(today)}</Text>
      </Animated.View>

      {/* Status Card */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Text style={styles.statusEmoji}>
            {isTodayLogged ? '✅' : '⏳'}
          </Text>
        </View>
        <View style={styles.statusText}>
          <Text style={styles.statusTitle}>
            {isTodayLogged ? 'Logged In Today' : 'Not Yet Logged'}
          </Text>
          <Text style={styles.statusSubtitle}>
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
          accentLight={Colors.primaryContainer}
        />
        <StreakBadge
          label="Longest Streak"
          count={longestStreak}
          emoji="⚡"
          accent={Colors.warning}
          accentLight={Colors.warningLight}
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
        <Text style={styles.motivationText}>
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
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.headlineLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  statusCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  statusEmoji: {
    fontSize: 26,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    ...Typography.titleLarge,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statusSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  buttonWrapper: {
    marginBottom: Spacing.xl,
  },
  motivationText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
  },
});
