import CustomHeaderRightButton from "@/components/CustomHeaderRightButton";
import { PRIMARY_COLOR } from "@/constants/colors";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router, Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Favorite",
          headerTitleAlign: "center",
          headerTintColor: PRIMARY_COLOR,
          headerLeft: () => (
            <DrawerToggleButton
              tintColor={PRIMARY_COLOR} // Increase touch area
              pressOpacity={1}
            />
          ),
          headerRight: () => (
            <CustomHeaderRightButton
              title="Add"
              onPressOut={() => router.replace("/map")}
            />
          ),
        }}
      />

      {/* Favorite Detail Screen */}
      <Stack.Screen
        name="[id]"
        options={{
          headerTitleAlign: "center",
          headerTintColor: PRIMARY_COLOR,
          // e.g., "Favorite Details"
          headerTitle: "Favorite Details",
          // Show a back arrow instead of drawer icon
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
