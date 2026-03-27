import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { todayStr } from '../../utils/dateUtils';
import { StorageKeys } from '../../constants';

export interface Activity {
  id: string;
  name: string;
  createdAt: number;
}



/**
 * Attendance Service
 * Handles persistence of activities and logged dates via AsyncStorage.
 */
export const attendanceService = {
  getActivities: async (): Promise<Activity[]> => {
    try {
      const raw = await AsyncStorage.getItem(StorageKeys.ACTIVITIES);
      if (!raw) return [];
      return JSON.parse(raw) as Activity[];
    } catch {
      return [];
    }
  },

  saveActivities: async (activities: Activity[]): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.ACTIVITIES, JSON.stringify(activities));
  },

  updateActivity: async (id: string, newName: string): Promise<void> => {
    const activities = await attendanceService.getActivities();
    const updated = activities.map(a => a.id === id ? { ...a, name: newName } : a);
    await attendanceService.saveActivities(updated);
  },

  getLogs: async (): Promise<Record<string, string[]>> => {
    try {
      const raw = await AsyncStorage.getItem(StorageKeys.LOGS);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, string[]>;
    } catch {
      return {};
    }
  },

  saveLogs: async (logs: Record<string, string[]>): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.LOGS, JSON.stringify(logs));
  },

  logToday: async (activityId: string): Promise<boolean> => {
    const logs = await attendanceService.getLogs();
    const today = todayStr();

    const activityLogs = logs[activityId] || [];
    if (activityLogs.some(log => dayjs(log).format('YYYY-MM-DD') === today)) {
      return false; // already logged today
    }

    logs[activityId] = [...activityLogs, dayjs().toISOString()];
    await attendanceService.saveLogs(logs);
    return true;
  },

  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(StorageKeys.ACTIVITIES);
    await AsyncStorage.removeItem(StorageKeys.LOGS);
  },

  exportData: async (): Promise<string> => {
    const activities = await attendanceService.getActivities();
    const logs = await attendanceService.getLogs();
    return JSON.stringify({ activities, logs });
  },

  importData: async (jsonData: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') return false;
      if (!Array.isArray(parsed.activities)) return false;
      if (!parsed.logs || typeof parsed.logs !== 'object') return false;
      
      // Basic validation of activities
      for (const act of parsed.activities) {
        if (!act.id || !act.name) return false;
      }

      await attendanceService.saveActivities(parsed.activities);
      await attendanceService.saveLogs(parsed.logs);
      return true;
    } catch {
      return false;
    }
  },
};
