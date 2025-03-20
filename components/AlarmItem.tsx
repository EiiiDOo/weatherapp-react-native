import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "@/constants/colors";
import { AlarmData } from "../app/(drawer)/alarm";
interface AlarmDataWithDelMeth extends AlarmData {
  deleteAlarm: (id: string) => void;
}
const AlarmItem = ({ date, id, deleteAlarm }: AlarmDataWithDelMeth) => {
  return (
    <View style={styles.infoCard}>
      <View style={styles.textContainer}>
        <Text style={{ fontSize: 12 }}>{date.toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteAlarm(id)}>
        <Ionicons name="close-circle" size={30} color={PRIMARY_COLOR} />
      </TouchableOpacity>
    </View>
  );
};

export default AlarmItem;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginRight: 10,
    gap: 4, // space between the text and the icon
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    margin: 8,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 10,
  },
});
