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
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface LogDetailsModalProps {
  visible: boolean;
  dateStr: string;
  timeStr: string | null;
  onClose: () => void;
}

export const LogDetailsModal: React.FC<LogDetailsModalProps> = ({
  visible,
  dateStr,
  timeStr,
  onClose,
}) => {
  const { colors } = useTheme();

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
          entering={SlideInDown.duration(200).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(150).easing(Easing.in(Easing.cubic))}
          style={[styles.sheet, { backgroundColor: colors.surface }]}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.surfaceVariant }]} />

          {/* Header Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
            <FontAwesome5 name="clock" size={28} color={Colors.primary} />
          </View>

          {/* Title and Info */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Log Details
          </Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.surfaceVariant }]}>
            <View style={styles.infoRow}>
              <FontAwesome5 name="calendar-day" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>{dateStr}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
            
            <View style={styles.infoRow}>
              <FontAwesome5 name="check-circle" size={16} color={timeStr ? Colors.success : colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: timeStr ? colors.textPrimary : colors.textSecondary }]}>
                {timeStr ? timeStr : 'No exact time recorded'}
              </Text>
            </View>
          </View>

          {/* Actions */}
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
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    paddingBottom: Spacing.xxl + Spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headlineLarge,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: Spacing.sm,
  },
  infoText: {
    ...Typography.bodyLarge,
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.sm,
  },
  btnDone: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDoneText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
