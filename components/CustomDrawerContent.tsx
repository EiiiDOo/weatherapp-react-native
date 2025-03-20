import appConfig from "../app.config.js";

import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.topSection]}>
        <Image
          source={require("../assets/images/icon.png")} // Replace with your image URL
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{appConfig.expo.name}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={[styles.bottomSection]}>
        <Text style={styles.footerText}>Copyright © 2025</Text>
        <Text style={styles.footerText}>Med Software</Text>
        <Text style={styles.footerText}>V 0.0.0.1</Text>
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  topSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  footerText: {
    fontSize: 16,
    color: "#888",
    fontFamily: "",
  },
});
