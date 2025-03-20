import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "@/constants/colors";

const MapLayout = () => {
  return (
    <Stack screenOptions={{ headerBackVisible: true }}>
      <Stack.Screen
        name="map"
        options={{
          title: "Map",
          headerTintColor: PRIMARY_COLOR,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              color={PRIMARY_COLOR}
              size={24}
              style={{ marginLeft: 10 }}
              onPress={() => router.replace("/favorites")} // or router.push("/(drawer)/index")
            />
          ),
        }}
      />
    </Stack>
  );
};

export default MapLayout;

const styles = StyleSheet.create({});
