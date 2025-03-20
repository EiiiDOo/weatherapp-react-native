import weatherApi from "@/api/weatherApi";
import { useNetworkConnection } from "@/context/NetworkContext";
import { weatherRepository } from "@/db";
import { toCustomSave } from "@/utils/weatherUtils";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  View,
  StyleSheet,
  Alert,
  BackHandler,
  ToastAndroid,
  Modal,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";

import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

const [latitudeDelta, longitudeDelta] = [0.015, 0.0121];
const initialRegion = {
  latitude: 31.205753,
  longitude: 29.924526,
  latitudeDelta: latitudeDelta,
  longitudeDelta: longitudeDelta,
};

export default () => {
  const [selectedLocation, setSelectedLocation] =
    useState<Region>(initialRegion);
  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const [showMarker, setShowMarker] = useState(false);
  const connection = useNetworkConnection();
  const [visible, setVisible] = useState(false);

  const animateCamera = () => {
    mapRef.current?.animateCamera(
      { center: selectedLocation, zoom: 15 },
      { duration: 1000 }
    );
  };

  const goToFav = () => {
    router.replace("/favorites");
    return true;
  };

  useEffect(() => {
    //Initial Camera
    animateCamera();
  }, [selectedLocation]);

  useEffect(() => {
    //Navigation Handel
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goToFav
    );

    return () => backHandler.remove();
  }, []);

  const handelOnPress = (e: MapPressEvent) => {
    const cord = e.nativeEvent.coordinate;
    setSelectedLocation({
      ...selectedLocation,
      latitude: cord.latitude,
      longitude: cord.longitude,
    });
    setShowMarker(true);
    Alert.alert(
      "Confirm Location",
      `Do you want to accept this location?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => await alertOkPress(cord),
        },
      ],
      { cancelable: true }
    );
  };

  const alertOkPress = async (cord: LatLng) => {
    if (connection) {
      setVisible(true);
      const weatherInfo = await Promise.all([
        weatherApi.getWeatherForLocation(cord.latitude, cord.longitude),
        weatherApi.getWeatherEveryThreeHours(cord.latitude, cord.longitude),
      ]);
      const data = toCustomSave(weatherInfo[0], weatherInfo[1]);
      const id = await weatherRepository.addWeatherDataFav(
        JSON.stringify(data)
      );
      ToastAndroid.show(id ? "Done" : "Failed", 2000);
      setVisible(false);
      goToFav();
    } else {
      Alert.alert("No Internet Connection!", undefined, undefined, {
        cancelable: true,
      });
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BlurView style={styles.blurContainer} intensity={100} tint="dark">
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                marginHorizontal: 20,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 10,
              }}
            >
              <Text>Get Location Data And Save It. Wait...</Text>
            </View>
          </BlurView>
        </View>
      </Modal>

      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          showsUserLocation
          showsMyLocationButton
          onPress={handelOnPress}
        >
          {showMarker && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 10,
    borderRadius: 40,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 5, // Shadow for Android
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  blurContainer: {
    width: "100%",
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
