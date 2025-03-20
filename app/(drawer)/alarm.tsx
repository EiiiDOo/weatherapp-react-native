import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ALARM } from "@/constants/keys";
import { PRIMARY_COLOR } from "@/constants/colors";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export type AlarmData = {
  date: Date;
  id: string;
  isActive: boolean;
};

const AlarmPage = () => {
  const [allAlarms, setAllAlarms] = useState<AlarmData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  // Request permissions and set up notifications
  useEffect(() => {
    const setup = async () => {
      try {
        // Request permissions
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please enable notifications to use the alarm feature."
          );
          return;
        }

        console.log("Notification permission granted");

        // Load saved alarms
        loadAlarms();
      } catch (error) {
        console.error("Error in setup:", error);
      }
    };

    setup();

    // Set up notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem(ALARM);
      if (savedAlarms) {
        const parsedAlarms: AlarmData[] = JSON.parse(savedAlarms);
        // Convert date strings back to Date objects
        const processedAlarms = parsedAlarms.map((alarm) => ({
          ...alarm,
          date: new Date(alarm.date),
        }));
        setAllAlarms(processedAlarms);
        console.log("Loaded alarms:", processedAlarms);
      }
    } catch (error) {
      console.error("Error loading alarms:", error);
    }
  };

  const scheduleAlarm = async () => {
    try {
      const now = new Date();
      const alarmTime = new Date(selectedDate);

      // Ensure the alarm is set for the future
      if (alarmTime <= now) {
        Alert.alert(
          "Invalid Time",
          "Please select a future time for the alarm."
        );
        return;
      }

      // Schedule the notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wake Up! ⏰",
          body: "Your alarm is ringing!",
          sound: true, // This will use the default sound
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: alarmTime,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      });

      console.log(
        "Scheduled alarm with ID:",
        identifier,
        "for time:",
        alarmTime
      );

      // Save the alarm
      const newAlarm: AlarmData = {
        id: identifier,
        date: alarmTime,
        isActive: true,
      };

      const updatedAlarms = [...allAlarms, newAlarm];
      await AsyncStorage.setItem(ALARM, JSON.stringify(updatedAlarms));
      setAllAlarms(updatedAlarms);
      setShowDatePicker(false);

      Alert.alert("Success", `Alarm set for ${alarmTime.toLocaleTimeString()}`);
    } catch (error) {
      console.error("Error scheduling alarm:", error);
      Alert.alert("Error", "Failed to set alarm. Please try again.");
    }
  };

  const cancelAlarm = async (id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const updatedAlarms = allAlarms.filter((alarm) => alarm.id !== id);
      await AsyncStorage.setItem(ALARM, JSON.stringify(updatedAlarms));
      setAllAlarms(updatedAlarms);
      console.log("Cancelled alarm:", id);
    } catch (error) {
      console.error("Error cancelling alarm:", error);
      Alert.alert("Error", "Failed to cancel alarm. Please try again.");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      selectedDate.setSeconds(0);
      setSelectedDate(selectedDate);
      if (Platform.OS === "android") {
        scheduleAlarm();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm Manager</Text>

      <ScrollView style={styles.alarmList}>
        {allAlarms.length === 0 ? (
          <Text style={styles.noAlarms}>No alarms set</Text>
        ) : (
          allAlarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmItem}>
              <Text style={styles.alarmTime}>
                {new Date(alarm.date).toLocaleTimeString()}
              </Text>
              <TouchableOpacity
                onPress={() => cancelAlarm(alarm.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.addButtonText}>Set New Alarm</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}

      {Platform.OS === "ios" && showDatePicker && (
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowDatePicker(false)}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.setButton} onPress={scheduleAlarm}>
            <Text style={styles.setButtonText}>Set Alarm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  alarmList: {
    flex: 1,
  },
  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: PRIMARY_COLOR,
  },
  noAlarms: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  setButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  setButtonText: {
    color: "#fff",
  },
});

export default AlarmPage;
