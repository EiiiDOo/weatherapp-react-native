import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { SpeedUnit, TemperatureUnit } from "@/constants/enums";
import SettingItem from "@/components/SettingItem";
import { Settings } from "@/models/Settings";
import { SPEED_UNIT, TEMPERATURE_UNIT } from "@/constants/keys";

export default function settings() {
  const { settings, saveSettings } = useSettings();

  const TemperatureSettings = Object.values(TemperatureUnit).map((value) => (
    <SettingItem
      type={TEMPERATURE_UNIT}
      key={value}
      title={value}
      value={settings.temperatureUnit === value}
      saveSettings={saveSettings}
    />
  ));
  const SpeedSettings = Object.values(SpeedUnit).map((value) => (
    <SettingItem
      type={SPEED_UNIT}
      key={value}
      title={value}
      value={settings.speedUnit === value}
      saveSettings={saveSettings}
    />
  ));

  return (
    <ScrollView style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <View style={styles.Card}>
          <Text> Temperature</Text>
          <View style={{}}>{TemperatureSettings}</View>
        </View>
        <View style={styles.Card}>
          <Text> Speed</Text>
          <View style={{}}>{SpeedSettings}</View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Card: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "45%",
    marginTop: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 25,
    gap: 10,
    elevation: 10,
  },
  nestedContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
});
