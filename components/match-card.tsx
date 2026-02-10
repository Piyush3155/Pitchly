import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    getCountryFlag,
    getMatchTypeBadgeColor,
    Match,
} from "@/services/cricapi";

interface MatchCardProps {
  data: Match;
  onPress?: () => void;
  showSeries?: boolean;
}

export function MatchCard({
  data,
  onPress,
  showSeries = true,
}: MatchCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isLive = data.status === "Match Started" || data.status === "Live"; // Simplified check
  const team1Name = data.teams[0] || "Team 1";
  const team2Name = data.teams[1] || "Team 2";

  // Score Logic
  const score1 =
    data.score?.find((s) => s.inning.includes(team1Name)) || data.score?.[0];
  const score2 =
    data.score?.find((s) => s.inning.includes(team2Name)) || data.score?.[1];

  const formatScoreStr = (s?: { r: number; w: number; o: number }) =>
    s ? `${s.r}/${s.w} (${s.o})` : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4 mx-4 rounded-2xl shadow-lg shadow-black/10 elevation-5"
    >
      <ThemedView className="rounded-2xl overflow-hidden">
        {/* Header Background - Gradient for Live, Solid for others */}
        {isLive ? (
          <LinearGradient
            colors={CricketColors.gradients.liveCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 py-2 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <View className="bg-white/20 px-2 py-0.5 rounded-md mr-2">
                <ThemedText className="text-xs font-bold text-white uppercase tracking-wider">
                  LIVE
                </ThemedText>
              </View>
              <ThemedText className="text-xs font-medium text-white/90">
                {data.matchType.toUpperCase()}
              </ThemedText>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
              <ThemedText className="text-xs text-white font-bold ml-1">
                ●
              </ThemedText>
            </View>
          </LinearGradient>
        ) : (
          <View
            className={`px-4 py-2.5 flex-row justify-between items-center ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <View className="flex-row items-center">
              <View
                style={{
                  backgroundColor: getMatchTypeBadgeColor(data.matchType),
                }}
                className="px-2 py-0.5 rounded-md mr-2"
              >
                <ThemedText className="text-xs font-bold text-white uppercase">
                  {data.matchType}
                </ThemedText>
              </View>
              <ThemedText className="text-xs font-medium opacity-60">
                {data.status}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Card Body */}
        <View className={`p-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
          {/* Series Name */}
          {showSeries && (data.series_id || (data as any).seriesName) && (
            <ThemedText
              className="text-xs opacity-50 mb-3 font-medium"
              numberOfLines={1}
            >
              {(data as any).seriesName || "Series Match"}
            </ThemedText>
          )}

          {/* Teams Row */}
          <View className="flex-row justify-between items-center mb-4">
            {/* Team 1 */}
            <View className="flex-1 flex-row items-center">
              <View className="w-10 h-10 mr-3 shadow-sm bg-white/5 rounded-full items-center justify-center overflow-hidden">
                {getCountryFlag(team1Name) ? (
                  <Image
                    source={{ uri: getCountryFlag(team1Name)! }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <ThemedText className="text-lg font-bold">
                    {team1Name.charAt(0)}
                  </ThemedText>
                )}
              </View>
              <View>
                <ThemedText className="font-bold text-base" numberOfLines={1}>
                  {team1Name}
                </ThemedText>
                {score1 && (
                  <ThemedText className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatScoreStr(score1)}
                  </ThemedText>
                )}
              </View>
            </View>

            <View className="px-2">
              <ThemedText className="text-xs opacity-40 font-bold">
                VS
              </ThemedText>
            </View>

            {/* Team 2 */}
            <View className="flex-1 flex-row items-center justify-end">
              <View className="items-end mr-3">
                <ThemedText className="font-bold text-base" numberOfLines={1}>
                  {team2Name}
                </ThemedText>
                {score2 && (
                  <ThemedText className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatScoreStr(score2)}
                  </ThemedText>
                )}
              </View>
              <View className="w-10 h-10 shadow-sm bg-white/5 rounded-full items-center justify-center overflow-hidden">
                {getCountryFlag(team2Name) ? (
                  <Image
                    source={{ uri: getCountryFlag(team2Name)! }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <ThemedText className="text-lg font-bold">
                    {team2Name.charAt(0)}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>

          {/* Footer Info */}
          <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-800">
            <Ionicons
              name="location-outline"
              size={12}
              color={isDark ? "#9CA3AF" : "#6B7280"}
              style={{ marginRight: 4 }}
            />
            <ThemedText className="text-xs opacity-60 flex-1" numberOfLines={1}>
              {data.venue.split(",")[0]}
            </ThemedText>
            {data.date && (
              <ThemedText className="text-xs opacity-50">
                {new Date(data.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
