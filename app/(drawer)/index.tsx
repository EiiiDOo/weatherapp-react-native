import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { useNetworkConnection } from "@/context/NetworkContext";
import { toCustomSave } from "@/utils/weatherUtils";
import { weatherRepository } from "@/db";
import {
  checkLocationPermission,
  requestLocationPermission,
  isLocationServicesEnabled,
  showLocationPermissionAlert,
  showLocationServicesAlert,
  LocationPermissionStatus,
} from "@/utils/locationPermissions";
import { LocationData } from "@/models/LocationData";
import WeatherData from "@/components/WeatherData";
import weatherApi from "@/api/weatherApi";
import { PRIMARY_COLOR } from "@/constants/colors";

export default function Home() {
  const connection = useNetworkConnection();
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [homeData, setHomeData] = useState<CustomSaveDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const status = await checkLocationPermission();
        setPermissionStatus(status);
        await retrieveHomeData();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (
      permissionStatus === LocationPermissionStatus.GRANTED &&
      connection &&
      location
    ) {
      fetchWeatherAndUpdate();
    }
  }, [permissionStatus, connection, location]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      if (await isLocationServicesEnabled()) {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy || 0,
        });
      } else {
        showLocationServicesAlert();
      }
    } catch (error) {
      console.error("getCurrentLocation Location error:", error);
      alert("Failed to get your location");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherAndUpdate = async () => {
    if (!location) {
      console.warn("fetchWeatherAndUpdate", "No Location Data");
      return;
    }
    setLoading(true);
    try {
      const weatherInfo = await Promise.all([
        weatherApi.getWeatherForLocation(location.latitude, location.longitude),
        weatherApi.getWeatherEveryThreeHours(
          location.latitude,
          location.longitude
        ),
      ]);

      const customSaveDTO = toCustomSave(weatherInfo[0], weatherInfo[1]);
      const id = await weatherRepository.addWeatherDataHome(
        JSON.stringify(customSaveDTO)
      );

      if (id < 1) throw new Error("Failed to add weather data to DB");
      await retrieveHomeData();
    } catch (error) {
      console.error("fetchWeatherAndUpdate Weather fetch error:", error);
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const retrieveHomeData = async () => {
    setLoading(true);
    try {
      const data = await weatherRepository.getHomeData();
      setHomeData(data);
      const allDataBaseData = await weatherRepository.getAllWeather();
    } catch (error) {
      console.error("retrieveHomeData DB error:", error);
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionAndLocation = async () => {
    if (permissionStatus !== "granted") {
      const result = await requestLocationPermission();
      setPermissionStatus(result);
      if (result !== "granted") {
        showLocationPermissionAlert();
        return;
      }
    }
    await getCurrentLocation();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (homeData) {
    return (
      <FlatList
        data={[{ id: 1, title: "one" }]}
        renderItem={(items) => <WeatherData data={homeData} />}
        onRefresh={handlePermissionAndLocation}
        refreshing={loading}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text>
        {permissionStatus !== "granted"
          ? "Request permission to access location"
          : "No data available"}
      </Text>
      <TouchableOpacity onPress={handlePermissionAndLocation}>
        <Text>Get Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
