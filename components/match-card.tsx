import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCountryFlag, isMatchLive, Match } from "@/services/cricapi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

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

  const currentBattingTeam =
    isLive && data.score?.length
      ? data.score[data.score.length - 1].inning
      : null;

  const checkIsBatting = (name: string, short?: string) =>
    isLive &&
    currentBattingTeam &&
    (currentBattingTeam.includes(name) ||
      (short && currentBattingTeam.includes(short)));

  const isTeam1Batting = checkIsBatting(team1Name, team1Info?.shortname);
  const isTeam2Batting = checkIsBatting(team2Name, team2Info?.shortname);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`mb-5 mx-4 rounded-3xl overflow-hidden ${
        isDark ? "bg-[#1A1C1E] border-gray-800" : "bg-white border-gray-100"
      } border shadow-sm`}
    >
      {/* Header: Series & Type */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-blue-50/50 dark:bg-white/5">
        <View className="flex-row items-center gap-2">
          {isLive ? (
            <View className="flex-row items-center bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
              <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
              <ThemedText className="text-[10px] font-bold text-red-600 dark:text-red-400">
                LIVE
              </ThemedText>
            </View>
          ) : (
            <View className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700">
              <ThemedText className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                {data.matchType.toUpperCase()}
              </ThemedText>
            </View>
          )}
          {showSeries && (
            <ThemedText
              className="text-[11px] font-medium text-gray-500 dark:text-gray-400"
              numberOfLines={1}
            >
              • {(data as any).seriesName || "International Series"}
            </ThemedText>
          )}
        </View>
        <Ionicons
          name="chevron-forward"
          size={14}
          color={isDark ? "#4B5563" : "#9CA3AF"}
        />
      </View>

      {/* Main Content */}
      <View className="p-4 relative bg-blue-600/5">
        <TeamRow
          name={team1Info?.shortname || team1Name}
          flag={getCountryFlag(team1Name)}
          score={score1}
          isBatting={isTeam1Batting}
          isDark={isDark}
        />

        {/* Subtle VS Divider */}
        <View className="h-[1px] w-full bg-gray-100 dark:bg-gray-800 my-4 flex-row justify-center items-center">
          <View className={`px-2 ${isDark ? "bg-[#1A1C1E]" : "bg-white"}`}>
            <ThemedText className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase">
              VS
            </ThemedText>
          </View>
        </View>

        <TeamRow
          name={team2Info?.shortname || team2Name}
          flag={getCountryFlag(team2Name)}
          score={score2}
          isBatting={isTeam2Batting}
          isDark={isDark}
        />
      </View>

      {/* Footer: Match Status */}
      <View
        className={`px-4 py-2.5 border-t ${isDark ? "border-gray-800 bg-black/20" : "border-gray-50 bg-orange-50/30"}`}
      >
        <View className="flex-row justify-between items-center">
          <ThemedText
            className="text-xs font-semibold text-orange-600 dark:text-orange-300 flex-1"
            numberOfLines={1}
          >
            {data.status}
          </ThemedText>
          <View className="flex-row items-center ml-2">
            <Ionicons name="location-sharp" size={12} color="#9CA3AF" />
            <ThemedText className="text-[10px] text-gray-400 ml-1">
              {data.venue.split(",").pop()?.trim()}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Sub-component for Team Rows to keep code clean
function TeamRow({ name, flag, score, isBatting, isDark }: any) {
  return (
    <View
      className={`flex-row items-center justify-between p-2 rounded-xl ${isBatting ? (isDark ? "bg-blue-400/10" : "bg-blue-50") : ""}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800/20 border border-white/10 overflow-hidden">
          {flag ? (
            <Image
              source={{ uri: flag }}
              className="w-full h-full"
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ThemedText className="text-sm font-bold opacity-30">
                {name.charAt(0)}
              </ThemedText>
            </View>
          )}
        </View>
        <View>
          <ThemedText
            className={`text-base font-bold ${isBatting ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}
          >
            {name}
          </ThemedText>
          {isBatting && (
            <ThemedText className="text-[10px] font-bold text-blue-500 uppercase">
              Batting
            </ThemedText>
          )}
        </View>
      </View>

      <View className="items-end">
        {score ? (
          <View className="flex-row items-baseline">
            <ThemedText
              className="text-xl font-bold dark:text-white"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {score.r}/{score.w}
            </ThemedText>
            <ThemedText className="text-xs font-medium text-gray-400 ml-1">
              ({score.o})
            </ThemedText>
          </View>
        ) : (
          <ThemedText className="text-xs font-semibold text-gray-300 dark:text-gray-600 italic">
            Yet to bat
          </ThemedText>
        )}
      </View>
    </View>
  );
}
