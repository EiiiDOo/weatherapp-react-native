import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useNavigation, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NetworkProvider } from "@/context/NetworkContext";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NetworkProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(map)" />
        </Stack>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
