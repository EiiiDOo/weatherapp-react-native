import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { SettingsProvider } from "@/context/SettingsContext";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/colors";

function DrawerLayout() {
  return (
    <SettingsProvider>
      <Drawer
        screenOptions={{
          headerTitleAlign: "center",
          drawerStatusBarAnimation: "slide",
          drawerStyle: {
            width: "75%",
          },
          freezeOnBlur: true,
          headerLeft: () => <DrawerToggleButton tintColor={PRIMARY_COLOR} />,
          drawerActiveTintColor: PRIMARY_COLOR,
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            headerTintColor: PRIMARY_COLOR,
            headerTitle: "Home",
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="favorites"
          options={{
            drawerLabel: "Favorite",
            headerTitle: "Favorite",
            headerTintColor: PRIMARY_COLOR,
            headerShown: false,
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "heart-sharp" : "heart-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="alarm"
          options={{
            drawerLabel: "Alarm",
            headerTitle: "Alarm",
            headerTintColor: PRIMARY_COLOR,
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "alarm-sharp" : "alarm-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            headerTitle: "Settings",
            headerTintColor: PRIMARY_COLOR,
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "settings-sharp" : "settings-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Drawer>
    </SettingsProvider>
  );
}

export default DrawerLayout;
