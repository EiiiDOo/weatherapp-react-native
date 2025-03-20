import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SETTINGS } from "@/constants/keys";
import { SpeedUnit, TemperatureUnit } from "../constants/enums";
import { Settings } from "@/models/Settings";

type ContextProps = {
  settings: Settings;
  saveSettings: (newSettings: Settings) => Promise<void>;
};

// Create a context with a default value of null
const SettingsContext = createContext<ContextProps | null>(null);

// Create a provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    temperatureUnit: TemperatureUnit.Celsius,
    speedUnit: SpeedUnit.m_s,
  });

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("SettingsProvider Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("SettingsProvider Failed to save settings:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
