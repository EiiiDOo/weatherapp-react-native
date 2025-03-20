import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  convertTemperature,
  convertUnixToDay,
  getFiveDay,
  getImagePath2X,
  getUnitSymbol,
  toMilesPerHour,
} from "../utils/weatherUtils";
import { useSettings } from "@/context/SettingsContext";
import { FlatList } from "react-native-gesture-handler";
import HourForecastItem from "./HourForecastItem";
import DayForecastItem from "./DayForecastItem";
import InformationItem from "./InformationItem";
import { SpeedUnit } from "@/constants/enums";

type HomeDataProps = {
  data: CustomSaveDTO;
};
const infoData = [
  {
    iconName: "car-brake-low-pressure",
  },
];

export default function WeatherData({ data }: HomeDataProps) {
  const { settings } = useSettings();
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.cityText}>{data.city}</Text>
        <Text style={styles.dateText}>
          {convertUnixToDay(data.date, "EEEE, dd-MM-yyyy, hh:mm a")}
        </Text>
      </View>
      <View style={styles.nestedContainer}>
        <Text style={{ alignSelf: "flex-start" }}>Today</Text>
        <View style={styles.todayCard}>
          <Text style={{ width: "100%", textAlign: "center" }}>
            {data.skyStateDescription}
          </Text>
          <Image
            style={styles.icon}
            source={getImagePath2X(data.iconId)}
            resizeMode="contain"
          />
          <Text style={{ width: "50%", textAlign: "right", fontSize: 48 }}>
            {convertTemperature(data.temp, settings.temperatureUnit)}
          </Text>
          <Text style={{ width: "10%", paddingTop: 10 }}>
            {getUnitSymbol(settings.temperatureUnit)}
          </Text>
        </View>
      </View>
      <View style={styles.nestedContainer}>
        <Text
          style={{
            alignSelf: "flex-start",
            marginLeft: 8,
            marginTop: 8,
            padding: 4,
          }}
        >
          24 Hour forecast
        </Text>
        <FlatList
          style={{ marginTop: 8, padding: 4 }}
          data={data.list}
          keyExtractor={(item) => `${item.dt}`}
          renderItem={(item) => (
            <HourForecastItem data={item.item} settings={settings} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <Text style={{ alignSelf: "flex-start", marginLeft: 8, marginTop: 8 }}>
          Five day forecast
        </Text>
        <FlatList
          style={{ marginTop: 8, width: "100%", padding: 4 }}
          data={getFiveDay(data.list)}
          keyExtractor={(item) => `${item.dt}`}
          renderItem={({ item, index }) => (
            <DayForecastItem
              data={{ ...item, day: index === 0 ? "Today" : undefined }}
              settings={settings}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.infoCard}>
        <InformationItem
          iconName="gauge"
          title="Pressure"
          value={data.pressure.toString()}
          symbol="pa"
        />
        <InformationItem
          iconName="water-percent"
          title="Humidity"
          value={data.humidity.toString()}
          symbol="%"
        />
        <InformationItem
          iconName="wind-turbine"
          title="Wind speed"
          value={
            settings.speedUnit === SpeedUnit.M_H
              ? toMilesPerHour(data.pressure).toString()
              : data.pressure.toString()
          }
          symbol={settings.speedUnit === SpeedUnit.M_H ? "M/H" : "m/s"}
        />
        <InformationItem
          iconName="cloud-outline"
          title="Cloud"
          value={data.clouds.toString()}
          symbol="%"
        />
        <InformationItem
          iconName="weather-sunny-alert"
          title="Ultra violet"
          value={"???"}
          symbol=""
        />
        <InformationItem
          iconName="eye"
          title="Visibility"
          value={data.visibility.toString()}
          symbol=""
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { flex: 1, aspectRatio: 1, width: "40%" },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 25,
    gap: 10,
    elevation: 10,
    margin: 16,
  },
  todayCard: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
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
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  cityText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
  },
});
