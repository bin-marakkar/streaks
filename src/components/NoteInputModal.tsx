import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeIn, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface NoteInputModalProps {
  visible: boolean;
  activityName?: string;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export const NoteInputModal: React.FC<NoteInputModalProps> = ({
  visible,
  activityName,
  onClose,
  onSubmit,
}) => {
  const { colors, isDark } = useTheme();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) setNote('');
  }, [visible]);

  const handleSubmit = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const canSubmit = note.trim().length > 0;

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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <Animated.View
          entering={SlideInDown.duration(220).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(160).easing(Easing.in(Easing.cubic))}
          style={[styles.sheet, { backgroundColor: colors.surface }]}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.surfaceVariant }]} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? Colors.dark.primaryContainer : Colors.primaryContainer }]}>
              <FontAwesome5 name="sticky-note" size={20} color={Colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Add a Note</Text>
              {activityName ? (
                <Text style={[styles.activityLabel, { color: Colors.primary }]}>{activityName}</Text>
              ) : null}
            </View>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Write a short note about today's log — what did you do, how did it go?
          </Text>

          {/* Note input */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.surfaceVariant }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="e.g., Read 15 pages of Clean Code"
              placeholderTextColor={Colors.textDisabled}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={280}
              autoFocus
              selectionColor={Colors.primary}
              textAlignVertical="top"
            />
          </View>

          {/* Character count */}
          <Text style={[styles.charCount, { color: note.length > 250 ? Colors.warning : colors.textSecondary }]}>
            {note.length}/280
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btnCancel, { backgroundColor: colors.surfaceVariant }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnCancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSubmit, !canSubmit && styles.btnSubmitDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="check" size={14} color="#FFFFFF" style={styles.submitIcon} />
              <Text style={styles.btnSubmitText}>Log & Save Note</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  kavWrapper: {
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
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.headlineLarge,
  },
  activityLabel: {
    ...Typography.labelMedium,
    fontWeight: '600',
    marginTop: 2,
  },
  subtitle: {
    ...Typography.bodyMedium,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
    minHeight: 110,
  },
  input: {
    ...Typography.bodyLarge,
    lineHeight: 22,
    minHeight: 90,
  },
  charCount: {
    ...Typography.bodySmall,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  btnSubmit: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  btnSubmitDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  submitIcon: {
    marginRight: 4,
  },
  btnSubmitText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
