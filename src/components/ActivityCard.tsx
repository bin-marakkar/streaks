import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export interface ActivityStats {
  currentStreak: number;
  longestStreak: number;
  isTodayLogged: boolean;
}

export interface ActivityCardProps {
  id: string;
  name: string;
  stats: ActivityStats;
  index: number;
  isSelectedForAction: boolean;
  onSelect: (id: string) => void;
  onLongPress: (id: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  name,
  stats,
  index,
  isSelectedForAction,
  onSelect,
  onLongPress,
  onEdit,
  onDelete,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(50 + index * 50).springify()}>
      <TouchableOpacity 
        style={[
          styles.activityCard, 
          stats.isTodayLogged ? styles.cardLogged : styles.cardPending,
          isSelectedForAction && styles.cardSelected,
        ]}
        activeOpacity={0.7}
        onPress={() => onSelect(id)}
        onLongPress={() => onLongPress(id)}
        delayLongPress={350}
      >
        <View style={[
          styles.cardBorderAccent, 
          { backgroundColor: stats.isTodayLogged ? Colors.success : Colors.primary }
        ]} />
        
        <View style={styles.cardContent}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityName} numberOfLines={1}>{name}</Text>
            
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
              onPress={() => onEdit(id, name)}
              style={styles.actionIconButton}
            />
            <IconButton
              icon="delete"
              iconColor={Colors.error}
              size={24}
              onPress={() => onDelete(id, name)}
              style={styles.actionIconButton}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    transform: [{ scale: 0.98 }],
    backgroundColor: '#F3F0FF',
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
    backgroundColor: '#F3F0FF',
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
});
