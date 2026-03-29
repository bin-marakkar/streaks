import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Activity } from '../features/attendance/attendanceService';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestPermissionsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
  return false;
};

export const rescheduleAllNotifications = async (
  activities: Activity[],
  logs: Record<string, string[]>
) => {
  // 1. Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 2. Schedule Morning Reminder — repeating daily at 10:00 AM local time
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good Morning! 🌅',
      body: 'Time to check in on your streaks!',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });

  if (activities.length === 0) return;

  // Helper: convert any log entry (ISO string or plain YYYY-MM-DD) to a local date string.
  // Uses plain Date so there's no dayjs dependency and no UTC-offset confusion.
  const toLocalDate = (log: string): string => {
    const d = new Date(log);
    if (isNaN(d.getTime())) return log.slice(0, 10); // fallback for plain date strings
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const now = new Date();
  const todayLocal = toLocalDate(now.toISOString());

  // 3. Tonight's evening notification — DYNAMIC content.
  //    Because this function is called reactively (useNotifications hook) every time the
  //    user logs an activity, tonight's one-shot DATE trigger is refreshed with the
  //    latest state each time, so it always shows only the remaining unlogged activities.
  const todayAt9PM = new Date(now);
  todayAt9PM.setHours(21, 0, 0, 0);

  if (now < todayAt9PM) {
    const unloggedToday = activities.filter(a => {
      const activityLogs = logs[a.id] || [];
      return !activityLogs.some(log => toLocalDate(log) === todayLocal);
    });

    if (unloggedToday.length > 0) {
      const names = unloggedToday.map(a => a.name).join(', ');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Evening Check-in 🌙',
          body: `Don't forget to log: ${names}`,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayAt9PM,
        },
      });
    } else {
      // All done today — send a congratulatory message instead
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Great job today! 🎉',
          body: 'All activities logged. Keep the streak going!',
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayAt9PM,
        },
      });
    }
  }

  // 4. Future days (1–7): schedule with all activity names as a conservative fallback.
  //    When the app is opened on any of those days, this function re-runs and replaces
  //    that day's entry (step 3 above) with accurate, unlogged-only content.
  const allNames = activities.map(a => a.name).join(', ');
  for (let i = 1; i <= 7; i++) {
    const futureAt9PM = new Date(now);
    futureAt9PM.setDate(futureAt9PM.getDate() + i);
    futureAt9PM.setHours(21, 0, 0, 0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening Check-in 🌙',
        body: `Don't forget to log: ${allNames}`,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: futureAt9PM,
      },
    });
  }
};
