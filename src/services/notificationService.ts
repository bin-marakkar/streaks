import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import dayjs from 'dayjs';
import { Activity } from '../features/attendance/attendanceService';
import { todayStr } from '../utils/dateUtils';

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

  // 2. Schedule Morning Reminder (Daily at 10:00 AM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good Morning! ☀️',
      body: 'Time to check in on your streaks!',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });

  // 3. Schedule Night Recap
  if (activities.length === 0) return;

  const today = todayStr();
  const unloggedToday = activities.filter(a => !(logs[a.id] || []).includes(today));

  const now = dayjs();
  const todayRecapTime = dayjs().hour(21).minute(0).second(0).millisecond(0);
  
  // If it's before 9 PM today, schedule today's precise recap
  if (now.isBefore(todayRecapTime)) {
    if (unloggedToday.length > 0) {
      const names = unloggedToday.map(a => a.name).join(', ');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Night Recap 🌙',
          body: `Don't forget to log: ${names}`,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayRecapTime.toDate(),
        },
      });
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Great Job! 🎉',
          body: 'You logged all your activities today. Rest well!',
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: todayRecapTime.toDate(),
        },
      });
    }
  }

  // 4. Pre-schedule next 7 days of night recaps
  // Assumes nothing will be logged yet on future days.
  const allNames = activities.map(a => a.name).join(', ');
  for (let i = 1; i <= 7; i++) {
    const futureDate = dayjs().add(i, 'day').hour(21).minute(0).second(0).millisecond(0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Night Recap 🌙',
        body: `Don't forget to log: ${allNames}`,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: futureDate.toDate(),
      },
    });
  }
};
