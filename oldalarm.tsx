import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setupNotifications,
  scheduleAlarm,
  ALARM_STORAGE_KEY,
} from "./utils/alarmServices";
const AlarmPage = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      const currentDate = new Date();
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      currentDate.setFullYear(selectedDate.getFullYear());
      currentDate.setMonth(selectedDate.getMonth());
      currentDate.setDate(selectedDate.getDate());
      setDate(currentDate);

      if (Platform.OS === "android") {
        setShowTimePicker(true);
      }
      console.log("change date");
    } else {
      console.log("cancel date");
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      if (date) {
        const currentDate = new Date(date);
        currentDate.setHours(selectedTime.getHours());
        currentDate.setMinutes(selectedTime.getMinutes());
        setDate(currentDate);
      }
      console.log("change time");
    } else {
      console.log("cancel time");
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.currentAlarms}>
        <Text style={styles.title}>Current Alarms</Text>
        {activeAlarms.map((alarm) => (
          <Text key={alarm.id}>{new Date(alarm.time).toLocaleString()}</Text>
        ))}
      </View> */}

      <Button title="Add Alarm" onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode={Platform.OS === "ios" ? "datetime" : "date"}
          is24Hour={false}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}

      <View style={styles.selectedDateTime}>
        {date ? (
          <>
            <Text>Selected Date: {date.toLocaleDateString()}</Text>
            <Text>Selected Time: {date.toLocaleTimeString()}</Text>
          </>
        ) : (
          <Text>No date yet</Text>
        )}
      </View>

      {/* <Button
        title="Set Alarm"
        onPress={handleAddAlarm}
        disabled={!permissionGranted}
      /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  currentAlarms: {
    marginBottom: 20,
  },
  selectedDateTime: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default AlarmPage;
