import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Settings } from "@/models/Settings";
import {
  convertTemperature,
  convertUnixToDay,
  getImagePath,
  getUnitSymbol,
} from "@/utils/weatherUtils";

interface Item0WithDay extends Item0 {
  day?: string;
}

type DayForcastItemProps = {
  data: Item0WithDay;
  settings: Settings;
};

export default function DayForecastItem({
  data,
  settings,
}: DayForcastItemProps) {
  return (
    <View style={styles.conatiner}>
      <Text>{data.day ? data.day : convertUnixToDay(data.dt, "EEEE")}</Text>
      <Image source={getImagePath(data.weather[0].icon)} resizeMode="contain" />
      <Text>{data.weather[0].description}</Text>
      <Text>
        {convertTemperature(data.main.temp_min, settings.temperatureUnit)}-
        {convertTemperature(data.main.temp_max, settings.temperatureUnit)}{" "}
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
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 8,
    elevation: 5,
  },
});
