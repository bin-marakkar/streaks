import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

/**
 * CalendarLegend — Shows the meaning of calendar day markers.
 */
export const CalendarLegend: React.FC = () => {
  const { colors } = useTheme();
  const items = [
    { color: Colors.calendarLogged, label: 'Logged' },
    { color: Colors.calendarMissed, label: 'Missed' },
    { color: Colors.calendarToday, label: 'Today' },
  ];

  return (
    <View style={styles.row}>
      {items.map(({ color, label }) => (
        <View key={label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    ...Typography.bodySmall,
  },
});
