import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  compact?: boolean;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  icon = "alert-circle-outline",
  compact = false,
}: ErrorStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`items-center justify-center ${compact ? "p-4" : "p-8"} bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700`}
    >
      <View
        className={`bg-red-50 dark:bg-red-900/20 rounded-full ${compact ? "p-2 mb-2" : "p-4 mb-4"}`}
      >
        <Ionicons
          name={icon}
          size={compact ? 24 : 32}
          color={CricketColors.status.live}
        />
      </View>
      <ThemedText className={`text-center mb-4 ${compact ? "text-xs" : ""}`}>
        {message}
      </ThemedText>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-gray-900 dark:bg-white px-5 py-2.5 rounded-full flex-row items-center gap-2"
        >
          <Ionicons
            name="refresh"
            size={16}
            color={isDark ? CricketColors.dark.bg : CricketColors.light.bg}
          />
          <ThemedText className="text-white dark:text-black font-semibold text-sm">
            Try Again
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
