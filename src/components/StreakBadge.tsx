import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface StreakBadgeProps {
  label: string;
  count: number;
  emoji?: string;
  accent?: string;
  accentLight?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  label,
  count,
  emoji = '🔥',
  accent = Colors.primary,
  accentLight = Colors.primaryContainer,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: accentLight }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.count, { color: accent }]}>{count}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
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
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
