import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { weatherRepository } from "@/db";
import FavoriteItem from "@/components/FavoriteItem";
import { CustomSaveDTOWithId } from "@/db/repositories/weatherRepositories";
import { PRIMARY_COLOR } from "@/constants/colors";

export default function Favorite() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [data, setData] = useState<CustomSaveDTOWithId[]>([]);

  const retrieveData = async () => {
    setloading(true);
    try {
      const data = await weatherRepository.getFavorites();
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.log("from Favorite retrieveData", error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    retrieveData();
  }, [router]);

  const deleteItem = (id: number) => {
    // Start by setting loading to true
    setloading(true);

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "No",
          onPress: () => {
            // User cancelled, so set loading to false
            setloading(false);
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const delRes = await weatherRepository.deleteWeather(id);
              if (delRes) {
                await retrieveData();
              } else {
                console.warn("delRes is false Failed to delete from favorites");
              }
            } catch (error) {
              console.error("Error deleting from favorites:", error);
            } finally {
              setloading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={data}
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item }) => (
          <FavoriteItem data={item} deleteItem={() => deleteItem(item.id)} />
        )}
        keyExtractor={(item) => `${item.date.toString()}${item.lon}${item.lat}`}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 24 }}>No Favorite added yet!</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={retrieveData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1, // Ensures full height
    justifyContent: "center", // Centers vertically
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: PRIMARY_COLOR,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",

    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 5, // Shadow for Android
  },
});
