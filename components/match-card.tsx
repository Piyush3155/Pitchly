import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { ThemedText } from "./themed-text";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCountryFlag, isMatchLive, Match } from "@/services/cricapi";

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

  const isLive = isMatchLive(data.status);
  const team1Name = data.teams[0] || "Team 1";
  const team2Name = data.teams[1] || "Team 2";

  // Score Logic
  const team1Info = data.teamInfo?.find((t) => t.name === team1Name);
  const team2Info = data.teamInfo?.find((t) => t.name === team2Name);

  const getTeamScore = (teamName: string, shortName?: string) => {
    return data.score?.find((s) => {
      const inning = s.inning.toLowerCase();
      return (
        inning.includes(teamName.toLowerCase()) ||
        (shortName && inning.includes(shortName.toLowerCase()))
      );
    });
  };

  const score1 = getTeamScore(team1Name, team1Info?.shortname);
  const score2 = getTeamScore(team2Name, team2Info?.shortname);

  // Determine batting team
  // If match is live, the team with the last score entry is usually batting
  const currentBattingTeam =
    isLive && data.score && data.score.length > 0
      ? data.score[data.score.length - 1].inning
      : null;

  const isTeam1Batting =
    isLive &&
    currentBattingTeam &&
    (currentBattingTeam.includes(team1Name) ||
      (team1Info?.shortname &&
        currentBattingTeam.includes(team1Info.shortname)));

  const isTeam2Batting =
    isLive &&
    currentBattingTeam &&
    (currentBattingTeam.includes(team2Name) ||
      (team2Info?.shortname &&
        currentBattingTeam.includes(team2Info.shortname)));

  const formatScoreStr = (s?: { r: number; w: number; o: number }) =>
    s ? `${s.r}/${s.w} (${s.o})` : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`mb-4 mx-4 rounded-3xl ${
        isDark ? "bg-gray-900 border border-gray-800" : "bg-white"
      } shadow-lg shadow-black/5 elevation-4 overflow-hidden`}
    >
      {/* Header Badge */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center space-x-2">
          {isLive ? (
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-2.5 py-1 rounded-full flex-row items-center"
            >
              <View className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" />
              <ThemedText className="text-[10px] font-bold text-white tracking-widest uppercase">
                LIVE
              </ThemedText>
            </LinearGradient>
          ) : (
            <View
              className={`px-2.5 py-1 rounded-full ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <ThemedText
                className={`text-[10px] font-bold tracking-widest uppercase ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {data.status}
              </ThemedText>
            </View>
          )}
          <ThemedText className="text-xs font-medium opacity-50 ml-2">
            {data.matchType.toUpperCase()}
          </ThemedText>
        </View>

        {showSeries && (data.series_id || (data as any).seriesName) && (
          <ThemedText
            className="text-[10px] uppercase font-bold text-blue-500 opacity-80"
            numberOfLines={1}
          >
            {(data as any).seriesName?.split(" ").slice(0, 2).join(" ")}
          </ThemedText>
        )}
      </View>

      {/* Teams & Scores */}
      <View className="px-5 pb-5">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 shadow-sm bg-gray-100 dark:bg-gray-800 rounded-2xl items-center justify-center overflow-hidden mr-3 border border-gray-100 dark:border-gray-700">
              {getCountryFlag(team1Name) ? (
                <Image
                  source={{ uri: getCountryFlag(team1Name)! }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <ThemedText className="text-lg font-bold">
                  {team1Info?.shortname?.charAt(0) || team1Name.charAt(0)}
                </ThemedText>
              )}
            </View>
            <View>
              <View className="flex-row items-center">
                <ThemedText className="font-bold text-lg leading-tight">
                  {team1Info?.shortname || team1Name}
                </ThemedText>
                {isTeam1Batting && (
                  <View className="ml-2 w-2 h-2 rounded-full bg-green-500" />
                )}
              </View>
              <ThemedText className="text-xs opacity-50 font-medium">
                {team1Name}
              </ThemedText>
            </View>
          </View>
          <View>
            {score1 ? (
              <View className="items-end">
                <ThemedText className="text-xl font-bold font-mono tracking-tight">
                  {score1.r}/{score1.w}
                </ThemedText>
                <ThemedText className="text-xs opacity-60 font-medium">
                  {score1.o} Overs
                </ThemedText>
              </View>
            ) : (
              <ThemedText className="text-xs opacity-40 font-medium text-right">
                Yet to Bat
              </ThemedText>
            )}
          </View>
        </View>

        {/* Divider */}
        <View
          className={`h-[1px] w-full my-1 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        />

        {/* Team 2 */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 shadow-sm bg-gray-100 dark:bg-gray-800 rounded-2xl items-center justify-center overflow-hidden mr-3 border border-gray-100 dark:border-gray-700">
              {getCountryFlag(team2Name) ? (
                <Image
                  source={{ uri: getCountryFlag(team2Name)! }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <ThemedText className="text-lg font-bold">
                  {team2Info?.shortname?.charAt(0) || team2Name.charAt(0)}
                </ThemedText>
              )}
            </View>
            <View>
              <View className="flex-row items-center">
                <ThemedText className="font-bold text-lg leading-tight">
                  {team2Info?.shortname || team2Name}
                </ThemedText>
                {isTeam2Batting && (
                  <View className="ml-2 w-2 h-2 rounded-full bg-green-500" />
                )}
              </View>
              <ThemedText className="text-xs opacity-50 font-medium">
                {team2Name}
              </ThemedText>
            </View>
          </View>
          <View>
            {score2 ? (
              <View className="items-end">
                <ThemedText className="text-xl font-bold font-mono tracking-tight">
                  {score2.r}/{score2.w}
                </ThemedText>
                <ThemedText className="text-xs opacity-60 font-medium">
                  {score2.o} Overs
                </ThemedText>
              </View>
            ) : (
              <ThemedText className="text-xs opacity-40 font-medium text-right">
                Yet to Bat
              </ThemedText>
            )}
          </View>
        </View>

        {/* Footer info: Venue & Date */}
        <View className="flex-row items-center mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700/50">
          <Ionicons
            name="location-sharp"
            size={12}
            color={isDark ? "#6B7280" : "#9CA3AF"}
          />
          <ThemedText
            className="text-[10px] opacity-60 ml-1 flex-1 uppercase tracking-wide font-semibold"
            numberOfLines={1}
          >
            {data.venue}
          </ThemedText>
          {data.date && (
            <ThemedText className="text-[10px] opacity-50 font-medium">
              {new Date(data.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
