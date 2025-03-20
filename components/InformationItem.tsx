import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export type InformationItemProps = {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  symbol: string;
  title: string;
};

export default function InformationItem({
  iconName,
  value,
  symbol,
  title,
}: InformationItemProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName} size={24} color="black" />
      <Text>
        {String(value)} {String(symbol)}
      </Text>
      <Text style={{ fontWeight: "bold" }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    gap: 2,
  },
});
