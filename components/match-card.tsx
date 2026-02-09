import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface MatchCardProps {
  match: {
    id: string;
    team1: string;
    team1Short?: string;
    team2: string;
    team2Short?: string;
    status: string;
    score1?: string;
    score2?: string;
    overs1?: string;
    overs2?: string;
    venue: string;
    date?: string;
    matchType?: string;
    series?: string;
    result?: string;
  };
  onPress?: () => void;
  compact?: boolean;
}

export function MatchCard({ match, onPress, compact = false }: MatchCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const statusLower = match.status.toLowerCase();
  const isLive = statusLower === "live";
  const isCompleted = statusLower === "completed" || statusLower === "finished";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mx-4 my-2"
    >
      <ThemedView
        className={`rounded-2xl overflow-hidden shadow-lg shadow-black/10 elevation-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <View
          className={`px-4 py-2.5 flex-row justify-between items-center ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <View className="flex-row items-center">
            <View
              className={`px-2 py-0.5 rounded mr-2 ${
                isLive
                  ? "bg-red-500"
                  : isCompleted
                    ? "bg-gray-500"
                    : "bg-green-500"
              }`}
            >
              <ThemedText className="text-xs font-bold text-white">
                {isLive ? "● LIVE" : match.status.toUpperCase()}
              </ThemedText>
            </View>
            {match.matchType && (
              <ThemedText className="text-xs font-medium opacity-60">
                {match.matchType}
              </ThemedText>
            )}
          </View>
          {match.series && (
            <ThemedText className="text-xs opacity-50" numberOfLines={1}>
              {match.series}
            </ThemedText>
          )}
        </View>

        {/* Teams & Scores */}
        <View className="p-4">
          {/* Team 1 */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center flex-1">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <ThemedText className="text-sm font-bold">
                  {match.team1Short ||
                    match.team1.substring(0, 3).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText className="font-semibold text-base" numberOfLines={1}>
                {match.team1}
              </ThemedText>
            </View>
            {match.score1 && (
              <View className="items-end">
                <ThemedText className="font-bold text-lg">
                  {match.score1}
                </ThemedText>
                {match.overs1 && (
                  <ThemedText className="text-xs opacity-50">
                    ({match.overs1} ov)
                  </ThemedText>
                )}
              </View>
            )}
          </View>

          {/* Team 2 */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <ThemedText className="text-sm font-bold">
                  {match.team2Short ||
                    match.team2.substring(0, 3).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText className="font-semibold text-base" numberOfLines={1}>
                {match.team2}
              </ThemedText>
            </View>
            {match.score2 && (
              <View className="items-end">
                <ThemedText className="font-bold text-lg">
                  {match.score2}
                </ThemedText>
                {match.overs2 && (
                  <ThemedText className="text-xs opacity-50">
                    ({match.overs2} ov)
                  </ThemedText>
                )}
              </View>
            )}
          </View>

          {/* Footer */}
          <View
            className={`mt-3 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}
          >
            <ThemedText className="text-xs opacity-50 mb-1">
              📍 {match.venue}
            </ThemedText>
            {(match.result || match.date) && (
              <ThemedText
                className={`text-sm font-medium ${
                  isLive ? "text-green-600" : isCompleted ? "text-blue-500" : ""
                }`}
              >
                {match.result || match.date}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
