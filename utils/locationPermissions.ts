import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher"; // If using Expo

/**
 * Permission statuses that can be returned
 */
export enum LocationPermissionStatus {
  GRANTED = "granted",
  DENIED = "denied",
  PENDING = "pending",
}

/**
 * Request location permissions and return the status
 */
export const requestLocationPermission =
  async (): Promise<LocationPermissionStatus> => {
    try {
      // Check if permissions are already granted
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      if (existingStatus === Location.PermissionStatus.GRANTED) {
        return LocationPermissionStatus.GRANTED;
      }

      // Request permission if not already granted
      const { status } = await Location.requestForegroundPermissionsAsync();

      return await checkLocationPermission();
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return LocationPermissionStatus.DENIED;
    }
  };

/**
 * Check if location permissions are granted
 */
export const checkLocationPermission =
  async (): Promise<LocationPermissionStatus> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === Location.PermissionStatus.GRANTED) {
        return LocationPermissionStatus.GRANTED;
      } else if (status === Location.PermissionStatus.DENIED) {
        return LocationPermissionStatus.DENIED;
      } else {
        return LocationPermissionStatus.PENDING;
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      return LocationPermissionStatus.DENIED;
    }
  };

/**
 * Show an alert to direct users to settings if permissions are denied
 */
export const showLocationPermissionAlert = () => {
  Alert.alert(
    "Location Permission Required",
    "This app needs location access to function properly. Please enable location permissions in your device settings.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: openAppSettings },
    ]
  );
};

/**
 * Open the app settings page
 */
const openAppSettings = async () => {
  await Linking.openSettings();
};

/**
 * Check if device location services are enabled
 */
export const isLocationServicesEnabled = async (): Promise<boolean> => {
  try {
    const isEnabled = await Location.hasServicesEnabledAsync();
    return isEnabled;
  } catch (error) {
    console.error("Error checking location services:", error);
    return false;
  }
};

export const showLocationServicesAlert = () => {
  Alert.alert(
    "Location Services Disabled",
    "Your device location services are turned off. Please enable location services in your device settings to use this feature.",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Open Settings",
        onPress: openLocationSettings,
      },
    ]
  );
};

const openLocationSettings = async () => {
  if (Platform.OS === "android") {
    try {
      // Using predefined action
      const result = await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
      );
      console.log(result); // Logs the result of the intent launch
    } catch (error) {
      console.error("Failed to open location settings", error);
    }
  } else {
    await openAppSettings();
  }
};
