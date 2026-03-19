import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAttendanceStore } from '../store/attendanceStore';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityFormModal } from '../components/ActivityFormModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Activities'>;

export const ActivitiesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemName, setEditingItemName] = useState<string>('');
  
  const { activities, createActivity, editActivity, deleteActivity, selectActivity, getActivityStats } = useAttendanceStore();

  const handleSaveActivity = (name: string) => {
    if (editingItemId) {
      editActivity(editingItemId, name);
    } else {
      createActivity(name);
    }
    closeModal();
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setEditingItemName('');
    setSelectedItemId(null);
    setIsModalVisible(true);
  };

  const openEditModal = (id: string, currentName: string) => {
    setEditingItemId(id);
    setEditingItemName(currentName);
    setSelectedItemId(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingItemId(null);
    setEditingItemName('');
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
              <ActivityCard
                id={item.id}
                name={item.name}
                stats={stats}
                index={index}
                isSelectedForAction={isSelectedForAction}
                onSelect={handleSelectActivity}
                onLongPress={handleLongPress}
                onEdit={openEditModal}
                onDelete={confirmDelete}
              />
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
        <ActivityFormModal
          visible={isModalVisible}
          editingItemId={editingItemId}
          initialName={editingItemName}
          onClose={closeModal}
          onSave={handleSaveActivity}
        />

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
    paddingBottom: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
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
});
