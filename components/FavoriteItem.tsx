import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { convertUnixToDay } from "@/utils/weatherUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CustomSaveDTOWithId } from "@/db/repositories/weatherRepositories";
import { PRIMARY_COLOR } from "@/constants/colors";

type FavoriteItemProps = {
  data: CustomSaveDTOWithId;
  deleteItem: () => void;
};

const FavoriteItem = ({ data, deleteItem }: FavoriteItemProps) => {
  const route = useRouter();
  function onPressItem(): void {
    route.push(`/favorites/${data.id}`);
  }
  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styles.infoCard}>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18 }}>
            {data.city}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {convertUnixToDay(data.date, " dd-MM-yyyy, hh:mm a")}
          </Text>
        </View>
        <TouchableOpacity onPress={deleteItem}>
          <Ionicons name="close-circle" size={30} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FavoriteItem;

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
