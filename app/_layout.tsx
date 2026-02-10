import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Custom Cricbuzz-inspired themes with new Palette
const CricbuzzLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: CricketColors.primary[600],
    background: CricketColors.light.bg,
    card: CricketColors.light.card,
    text: CricketColors.light.textPrimary,
    border: CricketColors.light.border,
    notification: CricketColors.status.live,
  },
};

const CricbuzzDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: CricketColors.primary[500],
    background: CricketColors.dark.bg,
    card: CricketColors.dark.card,
    text: CricketColors.dark.textPrimary,
    border: CricketColors.dark.border,
    notification: CricketColors.status.live,
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
          name="match/[id]"
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
