import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../hooks/useTheme';
import { useAttendanceStore } from '../store/attendanceStore';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { exportData, importData, activities } = useAttendanceStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const dataStr = await exportData();
      const fileUri = FileSystem.documentDirectory + 'streak_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, dataStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Streak Data',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'An error occurred while exporting data.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImport = async (fileUri: string) => {
    try {
      setIsProcessing(true);
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const success = await importData(fileContent);
      if (success) {
        Alert.alert('Success', 'Data imported successfully!');
      } else {
        Alert.alert('Invalid Data', 'The selected file does not contain valid application data.');
      }
    } catch (error) {
      Alert.alert('Import Failed', 'Failed to read or process the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;

        if (activities.length > 0) {
          Alert.alert(
            'Warning',
            'Importing data will overwrite all your current habits and logs. Are you sure you want to proceed?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Import', style: 'destructive', onPress: () => processImport(fileUri) },
            ]
          );
        } else {
          await processImport(fileUri);
        }
      }
    } catch (err) {
      Alert.alert('Import Error', 'Could not open document picker.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.delay(0).springify()} style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Dark Mode</Text>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: colors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Text style={styles.themeToggleEmoji}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).springify()} style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Data Management</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleExport} disabled={isProcessing}>
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.importButton]} onPress={handleImport} disabled={isProcessing}>
          <Text style={[styles.actionButtonText, styles.importButtonText]}>Import Data</Text>
        </TouchableOpacity>
      </Animated.View>

      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    ...Typography.titleLarge,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingLabel: {
    ...Typography.bodyLarge,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleEmoji: {
    fontSize: 20,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionButtonText: {
    color: '#FFFFFF',
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  importButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 0,
  },
  importButtonText: {
    color: Colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
