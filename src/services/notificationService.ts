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
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
      channelId: 'default',
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
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayAt9PM,
          channelId: 'default',
        },
      });
    } else {
      // All done today — send a congratulatory message instead
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Great job today! 🎉',
          body: 'All activities logged. Keep the streak going!',
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayAt9PM,
          channelId: 'default',
        },
      });
    }
  }

  // 4. Standing daily evening reminder at 9 PM (repeating, OS-managed).
  //    We use DAILY here intentionally — DATE-type triggers require SCHEDULE_EXACT_ALARM
  //    which Android 12+ restricts in production. DAILY triggers are delivered by the OS
  //    alarm infrastructure and fire even when the app is fully killed.
  //    When the user opens the app, step 3 above cancels & replaces tonight's slot with
  //    a precise one-shot recap, so this acts purely as the fallback for days the app
  //    is never opened.
  const allNames = activities.map(a => a.name).join(', ');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Check-in 🌙',
      body: `Don't forget to log: ${allNames}`,
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
      channelId: 'default',
    },
  });
};
