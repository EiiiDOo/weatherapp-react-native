// AlarmRingingScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { Audio } from "expo-av";

interface AlarmRingingScreenProps {
  onDismiss: () => void;
  alarmTime: Date;
}

const AlarmRingingScreen = ({
  onDismiss,
  alarmTime,
}: AlarmRingingScreenProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadAndPlaySound();
    startVibration();

    return () => {
      stopSound();
      Vibration.cancel();
    };
  }, []);

  const loadAndPlaySound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/alarm-sound.mp3"), // Make sure to add your alarm sound file
        {
          isLooping: true,
          shouldPlay: true,
          volume: 1.0,
        }
      );
      setSound(sound);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  };

  const startVibration = () => {
    Vibration.vibrate([1000, 1000], true); // Vibrate pattern: 1s on, 1s off, repeat
  };

  const handleDismiss = async () => {
    await stopSound();
    Vibration.cancel();
    onDismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.timeText}>{alarmTime.toLocaleTimeString()}</Text>
        <Text style={styles.title}>Wake Up!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.dismissButton]}
            onPress={handleDismiss}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    color: "#fff",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  snoozeButton: {
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  dismissButton: {
    backgroundColor: "#F44336",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AlarmRingingScreen;
