import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { PRIMARY_COLOR } from "@/constants/colors";

type CustomHeaderRightButton = {
  onPressOut: () => void;
  title: string;
};

const CustomHeaderRightButton = ({
  onPressOut,
  title,
}: CustomHeaderRightButton) => {
  return (
    <TouchableOpacity style={styles.fab} onPressOut={onPressOut}>
      <Text style={styles.headerButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomHeaderRightButton;

const styles = StyleSheet.create({
  fab: {
    backgroundColor: PRIMARY_COLOR,

    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 5, // Shadow for Android
    padding: 2,
  },
  headerButton: {
    marginLeft: 8,
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
