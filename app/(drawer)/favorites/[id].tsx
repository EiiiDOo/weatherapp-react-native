import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import WeatherData from "@/components/WeatherData";
import { weatherRepository } from "@/db";

export default function FavoriteDetails() {
  const { id }: { id: string } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CustomSaveDTO | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const item = await weatherRepository.getWeatherForDetails(
          Number.parseInt(id)
        );
        if (item) {
          setData(item);
        }
      } catch (error) {
        console.log("FavoriteDetails loadData", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text>Loading...</Text>
      </View>
    );
  } else if (data) {
    return (
      <FlatList
        data={[{ id: 1, title: "one" }]}
        renderItem={() => <WeatherData data={data} />}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Unknown Error...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
