import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayStr } from '../../utils/dateUtils';

export interface Activity {
  id: string;
  name: string;
  createdAt: number;
}

const ACTIVITIES_KEY = 'streak_activities';
const LOGS_KEY = 'streak_logs';

/**
 * Attendance Service
 * Handles persistence of activities and logged dates via AsyncStorage.
 */
export const attendanceService = {
  getActivities: async (): Promise<Activity[]> => {
    try {
      const raw = await AsyncStorage.getItem(ACTIVITIES_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Activity[];
    } catch {
      return [];
    }
  },

  saveActivities: async (activities: Activity[]): Promise<void> => {
    await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  },

  updateActivity: async (id: string, newName: string): Promise<void> => {
    const activities = await attendanceService.getActivities();
    const updated = activities.map(a => a.id === id ? { ...a, name: newName } : a);
    await attendanceService.saveActivities(updated);
  },

  getLogs: async (): Promise<Record<string, string[]>> => {
    try {
      const raw = await AsyncStorage.getItem(LOGS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, string[]>;
    } catch {
      return {};
    }
  },

  saveLogs: async (logs: Record<string, string[]>): Promise<void> => {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  logToday: async (activityId: string): Promise<boolean> => {
    const logs = await attendanceService.getLogs();
    const today = todayStr();

    const activityLogs = logs[activityId] || [];
    if (activityLogs.includes(today)) {
      return false; // already logged today
    }

    logs[activityId] = [...activityLogs, today];
    await attendanceService.saveLogs(logs);
    return true;
  },

  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(ACTIVITIES_KEY);
    await AsyncStorage.removeItem(LOGS_KEY);
  },
};
