import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeIn, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface LogDetailsModalProps {
  visible: boolean;
  dateStr: string;
  timeStr: string | null;
  activityName?: string;
  onClose: () => void;
}

export const LogDetailsModal: React.FC<LogDetailsModalProps> = ({
  visible,
  dateStr,
  timeStr,
  activityName,
  onClose,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View entering={FadeIn.duration(120)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.wrapper}>
        <Animated.View
          entering={SlideInDown.duration(220).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(160).easing(Easing.in(Easing.cubic))}
          style={[styles.sheet, { backgroundColor: colors.surface }]}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.surfaceVariant }]} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? Colors.dark.primaryContainer : Colors.primaryContainer }]}>
              <FontAwesome5 name="calendar-check" size={22} color={Colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Log Details</Text>
              {activityName ? (
                <Text style={[styles.activityBadgeText, { color: Colors.primary }]}>
                  {activityName}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Info card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.surfaceVariant }]}>
            {/* Date row */}
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: isDark ? Colors.dark.primaryContainer : Colors.primaryContainer }]}>
                <FontAwesome5 name="calendar-day" size={13} color={Colors.primary} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{dateStr}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

            {/* Time row */}
            <View style={styles.infoRow}>
              <View style={[
                styles.infoIconWrap,
                { backgroundColor: timeStr
                    ? (isDark ? '#1B3A35' : Colors.successLight)
                    : colors.surfaceVariant
                }
              ]}>
                <FontAwesome5
                  name="clock"
                  size={13}
                  color={timeStr ? Colors.success : colors.textSecondary}
                />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Time Logged</Text>
                <Text style={[
                  styles.infoValue,
                  { color: timeStr ? colors.textPrimary : colors.textSecondary }
                ]}>
                  {timeStr ?? 'No exact time recorded'}
                </Text>
              </View>
              {timeStr ? (
                <View style={[styles.statusBadge, { backgroundColor: isDark ? '#1B3A35' : Colors.successLight }]}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={[styles.statusBadgeText, { color: Colors.success }]}>Logged</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            style={[styles.btnDone, { backgroundColor: Colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnDoneText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.headlineLarge,
  },
  activityBadgeText: {
    ...Typography.labelMedium,
    marginTop: 2,
    fontWeight: '600',
  },
  // Info card
  infoCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.labelMedium,
    marginBottom: 2,
  },
  infoValue: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusBadgeText: {
    ...Typography.labelMedium,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md,
  },
  // Button
  btnDone: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDoneText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
