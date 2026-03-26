import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeIn, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface ActivityFormModalProps {
  visible: boolean;
  editingItemId: string | null;
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  visible,
  editingItemId,
  initialName,
  onClose,
  onSave,
}) => {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
  };

  const isEditing = !!editingItemId;
  const canSave = name.trim().length > 0;

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

      {/*
        KeyboardAvoidingView outside the backdrop so it can push the sheet up
        without being clipped. Using 'padding' on both platforms gives the most
        predictable "sheet rises with keyboard" behavior.
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <Animated.View
          entering={SlideInDown.duration(200).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(150).easing(Easing.in(Easing.cubic))}
          style={[styles.sheet, { backgroundColor: colors.surface }]}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.surfaceVariant }]} />

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isEditing
              ? 'Update the name of your habit'
              : 'Give your habit a clear, motivating name'}
          </Text>

          {/* Input */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.surfaceVariant }]}>
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="e.g., Read 10 pages"
              placeholderTextColor={Colors.textDisabled}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleSave}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              selectionColor={Colors.primary}
            />
            {name.length > 0 && (
              <TouchableOpacity onPress={() => setName('')} style={styles.clearBtn} hitSlop={8}>
                <FontAwesome5 name="times" size={14} color={Colors.textDisabled} />
              </TouchableOpacity>
            )}
          </View>

          {/* Character count */}
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {name.length}/40
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
              style={[styles.btnSave, !canSave && styles.btnSaveDisabled]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSaveText}>{isEditing ? 'Save Changes' : 'Create Habit'}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    // Shadow for the sheet
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
  title: {
    ...Typography.headlineLarge,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMedium,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.bodyLarge,
    paddingVertical: Spacing.md,
  },
  clearBtn: {
    paddingLeft: Spacing.sm,
  },
  clearBtnText: {
    fontSize: 14,
    color: Colors.textDisabled,
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
  btnSave: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSaveDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  btnSaveText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
