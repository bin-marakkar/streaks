import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, Typography, BorderRadius } from '../constants';
import { useTheme } from '../hooks/useTheme';

interface MonthlyProgressProps {
  loggedDays: number;
  totalDays: number;
}

/**
 * MonthlyProgress — Animated progress bar showing logged / total days this month.
 */
export const MonthlyProgress: React.FC<MonthlyProgressProps> = ({
  loggedDays,
  totalDays,
}) => {
  const { colors } = useTheme();
  const percentage = totalDays > 0 ? Math.min(loggedDays / totalDays, 1) : 0;
  const percentDisplay = Math.round(percentage * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Monthly Progress</Text>
        <Text style={[styles.fraction, { color: colors.textSecondary }]}>
          {loggedDays}/{totalDays} days
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.primaryContainer }]}>
        <View style={[styles.fill, { width: `${percentDisplay}%` }]} />
      </View>
      <Text style={styles.percentage}>{percentDisplay}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.titleMedium,
  },
  fraction: {
    ...Typography.bodySmall,
  },
  track: {
    height: 10,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  percentage: {
    ...Typography.labelMedium,
    color: Colors.primary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
