import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ALARM_BACKGROUND_TASK = "ALARM_BACKGROUND_TASK";
export const ALARM_STORAGE_KEY = "ACTIVE_ALARMS";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// Background task definition
TaskManager.defineTask(ALARM_BACKGROUND_TASK, async () => {
  try {
    const now = new Date().getTime();
    const storedAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
    const alarms = storedAlarms ? JSON.parse(storedAlarms) : [];

    for (const alarm of alarms) {
      if (now >= alarm.time && !alarm.triggered) {
        await triggerAlarm(alarm.id);
        alarm.triggered = true;
        await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
        return BackgroundFetch.BackgroundFetchResult.NewData;
      }
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const setupNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return false;
    }

    // Register background task
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      ALARM_BACKGROUND_TASK
    );
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(ALARM_BACKGROUND_TASK, {
        minimumInterval: 60, // 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }

    // Add notification response listener
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return true;
  } catch (error) {
    console.error("Setup error:", error);
    return false;
  }
};

export const scheduleAlarm = async (alarmDate: Date) => {
  try {
    const alarmId = Date.now().toString();

    // Schedule the initial notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarm",
        body: "Wake Up!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        sticky: true,
        autoDismiss: false,
        data: { alarmId, type: "alarm" },
      },
      trigger: {
        seconds: alarmDate.getSeconds(),
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // Add this line to specify the trigger type
      },
    });

    // Store alarm data
    const storedAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
    const alarms = storedAlarms ? JSON.parse(storedAlarms) : [];
    alarms.push({
      id: alarmId,
      time: alarmDate.getTime(),
      triggered: false,
    });
    await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));

    return alarmId;
  } catch (error) {
    console.error("Schedule alarm error:", error);
    throw error;
  }
};

const triggerAlarm = async (alarmId: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarm",
        body: "Wake Up!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        sticky: true,
        autoDismiss: false,
        data: { alarmId, type: "alarm-repeat" },
      },
      trigger: {
        seconds: 1,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // Add this line to specify the trigger type
      },
    });
  } catch (error) {
    console.error("Trigger alarm error:", error);
  }
};

const handleNotificationResponse = async (response: any) => {
  try {
    const data = response.notification.request.content.data;
    if (data?.type === "alarm" || data?.type === "alarm-repeat") {
      // Cancel all notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Update storage
      const storedAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
      if (storedAlarms) {
        const alarms = JSON.parse(storedAlarms).filter(
          (alarm: any) => alarm.id !== data.alarmId
        );
        await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
      }
    }
  } catch (error) {
    console.error("Handle notification response error:", error);
  }
};
