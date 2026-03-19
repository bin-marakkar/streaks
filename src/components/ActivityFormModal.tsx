import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

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
  const [name, setName] = useState('');

  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <Animated.View entering={FadeInDown.duration(200)} style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  {editingItemId ? 'Edit Habit' : 'New Habit'}
                </Text>
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Reading 10 Pages"
                  placeholderTextColor={Colors.textDisabled}
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={handleSave}
                  autoFocus={true}
                  maxLength={40}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalButtonCancel} onPress={onClose}>
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButtonAdd, !name.trim() && styles.modalButtonDisabled]} 
                    onPress={handleSave}
                    disabled={!name.trim()}
                  >
                    <Text style={styles.modalButtonTextAdd}>
                      {editingItemId ? 'Save' : 'Create'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    ...Typography.titleLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  modalButtonCancel: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
  },
  modalButtonTextCancel: {
    ...Typography.labelLarge,
    color: Colors.textSecondary,
  },
  modalButtonAdd: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  modalButtonTextAdd: {
    ...Typography.labelLarge,
    color: Colors.surface,
  },
});
