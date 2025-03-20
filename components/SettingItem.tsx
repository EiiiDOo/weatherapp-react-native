import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Settings } from "@/models/Settings";
import { SpeedUnit, TemperatureUnit } from "@/constants/enums";
import { useSettings } from "@/context/SettingsContext";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/colors";

type UnitType = TemperatureUnit | SpeedUnit;

type SettingItemProps = {
  value: boolean;
  saveSettings: (setting: Settings) => Promise<void>;
  type: keyof Settings;
  title: UnitType;
};

export default function SettingItem({
  title,
  value,
  saveSettings,
  type,
}: SettingItemProps) {
  const { settings } = useSettings();

  const handleValueChange = async () => {
    await saveSettings({
      ...settings,
      [type]: title,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ width: "50%" }}>{title}</Text>
      <Switch
        style={{ width: "50%" }}
        value={value}
        onValueChange={handleValueChange}
        trackColor={{ false: "#767577", true: SECONDARY_COLOR }}
        thumbColor={value ? PRIMARY_COLOR : "#f4f3f4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
