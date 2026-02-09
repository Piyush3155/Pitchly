import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Custom Cricbuzz-inspired themes
const CricbuzzLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00A651",
    background: "#f5f5f5",
    card: "#ffffff",
    text: "#1a1a1a",
    border: "#e0e0e0",
    notification: "#EF4444",
  },
};

const CricbuzzDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#00A651",
    background: "#121212",
    card: "#1e1e1e",
    text: "#ffffff",
    border: "#333333",
    notification: "#EF4444",
  },
};

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CricbuzzDarkTheme : CricbuzzLightTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
