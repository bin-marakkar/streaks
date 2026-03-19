import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, LinearTransition, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAttendanceStore } from '../store/attendanceStore';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Activities'>;

export const ActivitiesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  const { activities, createActivity, editActivity, deleteActivity, selectActivity, getActivityStats } = useAttendanceStore();

  const handleSaveActivity = () => {
    if (newActivityName.trim().length === 0) return;
    
    if (editingItemId) {
      editActivity(editingItemId, newActivityName.trim());
    } else {
      createActivity(newActivityName.trim());
    }
    
    closeModal();
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setNewActivityName('');
    setSelectedItemId(null);
    setIsModalVisible(true);
  };

  const openEditModal = (id: string, currentName: string) => {
    setEditingItemId(id);
    setNewActivityName(currentName);
    setSelectedItemId(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setNewActivityName('');
    setEditingItemId(null);
  };

  const handleSelectActivity = (id: string) => {
    if (selectedItemId === id) {
      setSelectedItemId(null); // toggle off
      return;
    }
    if (selectedItemId) {
      setSelectedItemId(null); // clear other selection
      return;
    }
    
    selectActivity(id);
    navigation.navigate('ActivityDetail');
  };

  const handleLongPress = (id: string) => {
    setSelectedItemId(id);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteActivity(id);
            setSelectedItemId(null);
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedItemId(null)}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.title}>Your Habits</Text>
          <Text style={styles.subtitle}>Hold a card to edit or delete</Text>
        </Animated.View>

        {/* List Section */}
        <Animated.FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={LinearTransition.springify()}
          renderItem={({ item, index }) => {
            const stats = getActivityStats(item.id);
            const isSelectedForAction = selectedItemId === item.id;
            
            return (
              <Animated.View entering={FadeInDown.delay(50 + index * 50).springify()}>
                <TouchableOpacity 
                  style={[
                    styles.activityCard, 
                    stats.isTodayLogged ? styles.cardLogged : styles.cardPending,
                    isSelectedForAction && styles.cardSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelectActivity(item.id)}
                  onLongPress={() => handleLongPress(item.id)}
                  delayLongPress={350}
                >
                  <View style={[
                    styles.cardBorderAccent, 
                    { backgroundColor: stats.isTodayLogged ? Colors.success : Colors.primary }
                  ]} />
                  
                  <View style={styles.cardContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityName} numberOfLines={1}>{item.name}</Text>
                      
                      {!isSelectedForAction && (
                        <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutRight.duration(200)}>
                          <View style={[styles.statusBadge, stats.isTodayLogged ? styles.statusLogged : styles.statusPending]}>
                             <Text style={[styles.statusText, stats.isTodayLogged ? styles.statusTextLogged : styles.statusTextPending]}>
                                {stats.isTodayLogged ? 'Logged' : 'Pending'}
                             </Text>
                          </View>
                        </Animated.View>
                      )}
                    </View>

                    <View style={styles.statsRow}>
                      <Text style={styles.statLabel}>
                        Current Streak: <Text style={styles.statValue}>{stats.currentStreak} days</Text>
                      </Text>
                      <Text style={styles.statLabel}>
                        Best: <Text style={styles.statValue}>{stats.longestStreak} days</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Actions Overlay */}
                  {isSelectedForAction && (
                    <Animated.View 
                      entering={FadeInRight.duration(200).springify()} 
                      style={styles.actionsOverlay}
                    >
                      <IconButton
                        icon="pencil"
                        iconColor={Colors.primary}
                        size={24}
                        onPress={() => openEditModal(item.id, item.name)}
                        style={styles.actionIconButton}
                      />
                      <IconButton
                        icon="delete"
                        iconColor={Colors.error}
                        size={24}
                        onPress={() => confirmDelete(item.id, item.name)}
                        style={styles.actionIconButton}
                      />
                    </Animated.View>
                  )}

                </TouchableOpacity>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No activities yet.</Text>
              <Text style={styles.emptySubText}>Add one to start tracking!</Text>
            </Animated.View>
          }
        />

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={openAddModal}
          color={Colors.surface}
          customSize={64}
        />

        {/* Add/Edit Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
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
                      value={newActivityName}
                      onChangeText={setNewActivityName}
                      onSubmitEditing={handleSaveActivity}
                      autoFocus={true}
                      maxLength={40}
                    />

                    <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.modalButtonCancel} onPress={closeModal}>
                        <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalButtonAdd, !newActivityName.trim() && styles.modalButtonDisabled]} 
                        onPress={handleSaveActivity}
                        disabled={!newActivityName.trim()}
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

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.headlineLarge,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.xxl * 2, // Extra padding for FAB
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  cardLogged: {
    backgroundColor: '#FAFFFE',
  },
  cardPending: {
    backgroundColor: '#FCFCFF',
  },
  cardSelected: {
    transform: [{ scale: 0.98 }], // slight squeeze when selected
    backgroundColor: '#F3F0FF', // active tint
  },
  cardBorderAccent: {
    width: 6,
    height: '100%',
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  activityName: {
    ...Typography.titleLarge,
    fontWeight: '800',
    color: Colors.primaryDark,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusLogged: {
    backgroundColor: Colors.successLight,
  },
  statusPending: {
    backgroundColor: Colors.surfaceVariant,
  },
  statusText: {
    ...Typography.labelMedium,
  },
  statusTextLogged: {
    color: Colors.success,
  },
  statusTextPending: {
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  statValue: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actionsOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF', // matches cardSelected
    paddingRight: Spacing.sm,
    paddingLeft: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  actionIconButton: {
    margin: 0,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.titleLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: Spacing.lg,
    right: 0,
    bottom: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
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
