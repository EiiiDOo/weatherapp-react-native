import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  convertTemperature,
  convertUnixToDay,
  getImagePath,
  getUnitSymbol,
} from "@/utils/weatherUtils";
import { Settings } from "@/models/Settings";

type HourForecastItemProps = {
  data: Item0;
  settings: Settings;
};

export default function HourForecastItem({
  data,
  settings,
}: HourForecastItemProps) {
  return (
    <View style={styles.conatiner}>
      <Text style={{ width: "auto", textAlign: "center" }}>
        {convertUnixToDay(data.dt, "hh:mm a")}
      </Text>
      <Image source={getImagePath(data.weather[0].icon)} resizeMode="contain" />
      <Text style={{ width: "auto", textAlign: "center" }}>
        {convertTemperature(data.main.temp, settings.temperatureUnit)}{" "}
        <Text>{getUnitSymbol(settings.temperatureUnit)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    elevation: 5,
  },
});
