import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface StreakBadgeProps {
  label: string;
  count: number;
  emoji?: string;
  accent?: string;
  accentLight?: string;
}

/**
 * StreakBadge — Displays a streak count inside a pill-shaped card.
 * Pass `accent` for the highlight/icon color and `accentLight` for the card background.
 */
export const StreakBadge: React.FC<StreakBadgeProps> = ({
  label,
  count,
  emoji = '🔥',
  accent = Colors.primary,
  accentLight = Colors.primaryContainer,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: accentLight }]}>
      <Text style={[styles.emoji]}>{emoji}</Text>
      <Text style={[styles.count, { color: accent }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xs,
  },
  emoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  count: {
    ...Typography.displayMedium,
    lineHeight: 36,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
