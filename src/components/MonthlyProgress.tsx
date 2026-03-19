import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

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
  const percentage = totalDays > 0 ? Math.min(loggedDays / totalDays, 1) : 0;
  const percentDisplay = Math.round(percentage * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Monthly Progress</Text>
        <Text style={styles.fraction}>
          {loggedDays}/{totalDays} days
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentDisplay}%` }]} />
      </View>
      <Text style={styles.percentage}>{percentDisplay}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  fraction: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  track: {
    height: 10,
    backgroundColor: Colors.primaryContainer,
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
