import { create } from 'zustand';
import { attendanceService, Activity } from '../features/attendance/attendanceService';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { todayStr } from '../utils/dateUtils';

interface ActivityStats {
  currentStreak: number;
  longestStreak: number;
  isTodayLogged: boolean;
}

interface AttendanceState {
  activities: Activity[];
  logs: Record<string, string[]>;
  selectedActivityId: string | null;
  isLoading: boolean;

  // Actions
  hydrate: () => Promise<void>;
  createActivity: (name: string) => Promise<void>;
  editActivity: (id: string, name: string) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  selectActivity: (id: string) => void;
  logToday: (activityId: string) => Promise<void>;
  resetActivityData: (id: string) => Promise<void>;

  // Derived getters
  getActivityStats: (activityId: string) => ActivityStats;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  activities: [],
  logs: {},
  selectedActivityId: null,
  isLoading: false,

  hydrate: async () => {
    set({ isLoading: true });
    const activities = await attendanceService.getActivities();
    const logs = await attendanceService.getLogs();
    set({ activities, logs, isLoading: false });
  },

  createActivity: async (name: string) => {
    const { activities } = get();
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name,
      createdAt: Date.now(),
    };
    
    const updatedActivities = [...activities, newActivity];
    await attendanceService.saveActivities(updatedActivities);
    set({ activities: updatedActivities });
  },

  editActivity: async (id: string, name: string) => {
    const { activities } = get();
    const updatedActivities = activities.map(a => a.id === id ? { ...a, name } : a);
    await attendanceService.saveActivities(updatedActivities);
    set({ activities: updatedActivities });
  },

  deleteActivity: async (id: string) => {
    const { activities, logs, selectedActivityId } = get();
    
    // Remove activity
    const updatedActivities = activities.filter(a => a.id !== id);
    await attendanceService.saveActivities(updatedActivities);
    
    // Remove logs
    const updatedLogs = { ...logs };
    delete updatedLogs[id];
    await attendanceService.saveLogs(updatedLogs);

    set({ 
      activities: updatedActivities, 
      logs: updatedLogs,
      selectedActivityId: selectedActivityId === id ? null : selectedActivityId
    });
  },

  selectActivity: (id: string) => {
    set({ selectedActivityId: id });
  },

  logToday: async (activityId: string) => {
    const { logs } = get();
    const today = todayStr();
    const activityLogs = logs[activityId] || [];

    if (activityLogs.includes(today)) return; // Guard: already logged today

    set({ isLoading: true });
    await attendanceService.logToday(activityId);
    
    const updatedLogs = { ...logs };
    updatedLogs[activityId] = [...activityLogs, today];
    
    set({ logs: updatedLogs, isLoading: false });
  },

  resetActivityData: async (id: string) => {
    const { logs } = get();
    const updatedLogs = { ...logs };
    delete updatedLogs[id];
    await attendanceService.saveLogs(updatedLogs);
    set({ logs: updatedLogs });
  },

  getActivityStats: (activityId: string) => {
    const logs = get().logs[activityId] || [];
    return {
      currentStreak: calculateCurrentStreak(logs),
      longestStreak: calculateLongestStreak(logs),
      isTodayLogged: logs.includes(todayStr()),
    };
  },
}));
