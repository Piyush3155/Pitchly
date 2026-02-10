import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    fetchMatchScorecard,
    getCountryFlag,
    Match,
    MatchScore
} from "@/services/cricapi";

const DETAIL_TABS = ["Info", "Scorecard"];

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [matchData, setMatchData] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");

  const loadMatchDetails = async () => {
    try {
      if (typeof id === "string") {
        const data = await fetchMatchScorecard(id);
        setMatchData(data);
      }
    } catch (error) {
      console.error("Error loading match details:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatchDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMatchDetails();
  }, [id]);

  const team1Name = matchData?.teams[0] || "Team 1";
  const team2Name = matchData?.teams[1] || "Team 2";

  const score1 =
    matchData?.score?.find((s) => s.inning.includes(team1Name)) ||
    matchData?.score?.[0];
  const score2 =
    matchData?.score?.find((s) => s.inning.includes(team2Name)) ||
    matchData?.score?.[1];

  const formatScoreStr = (s?: MatchScore) =>
    s ? `${s.r}/${s.w} (${s.o})` : "Yet to bat";

  const isLive =
    matchData?.status === "Match Started" || matchData?.status === "Live";

  const renderInfoTab = () => (
    <View className="px-4 py-6">
      <View
        className={`rounded-2xl p-5 mb-5 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-sm border border-gray-100 dark:border-gray-800`}
      >
        <ThemedText className="font-bold text-lg mb-4">Match Info</ThemedText>

        <View className="flex-row items-start mb-3">
          <Ionicons
            name="trophy-outline"
            size={16}
            color={isDark ? "gray" : "#666"}
            style={{ marginTop: 2 }}
          />
          <View className="ml-3 flex-1">
            <ThemedText className="text-sm opacity-60">Series</ThemedText>
            <ThemedText className="font-medium text-base mt-0.5">
              {(matchData as any).seriesName || "Series Name Unavailable"}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Ionicons
            name="location-outline"
            size={16}
            color={isDark ? "gray" : "#666"}
            style={{ marginTop: 2 }}
          />
          <View className="ml-3 flex-1">
            <ThemedText className="text-sm opacity-60">Venue</ThemedText>
            <ThemedText className="font-medium text-base mt-0.5">
              {matchData?.venue}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Ionicons
            name="calendar-outline"
            size={16}
            color={isDark ? "gray" : "#666"}
            style={{ marginTop: 2 }}
          />
          <View className="ml-3 flex-1">
            <ThemedText className="text-sm opacity-60">Date & Time</ThemedText>
            <ThemedText className="font-medium text-base mt-0.5">
              {matchData?.dateTimeGMT
                ? new Date(matchData.dateTimeGMT).toLocaleString()
                : "TBA"}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-start">
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={isDark ? "gray" : "#666"}
            style={{ marginTop: 2 }}
          />
          <View className="ml-3 flex-1">
            <ThemedText className="text-sm opacity-60">Match Status</ThemedText>
            <ThemedText
              className={`font-bold text-base mt-0.5 ${isLive ? "text-red-500" : ""}`}
            >
              {matchData?.status}
            </ThemedText>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between">
        {/* Team 1 Squad/Info Placeholders */}
        <View
          className={`rounded-xl p-4 flex-1 mr-2 ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
        >
          <View className="items-center mb-3">
            <View className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-gray-100 items-center justify-center">
              {getCountryFlag(team1Name) ? (
                <Image
                  source={{ uri: getCountryFlag(team1Name)! }}
                  className="w-full h-full"
                />
              ) : (
                <ThemedText className="text-xl">
                  {team1Name.charAt(0)}
                </ThemedText>
              )}
            </View>
            <ThemedText className="font-bold text-center">
              {team1Name}
            </ThemedText>
          </View>
          {/* Add squad list here if available in API */}
        </View>

        <View
          className={`rounded-xl p-4 flex-1 ml-2 ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
        >
          <View className="items-center mb-3">
            <View className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-gray-100 items-center justify-center">
              {getCountryFlag(team2Name) ? (
                <Image
                  source={{ uri: getCountryFlag(team2Name)! }}
                  className="w-full h-full"
                />
              ) : (
                <ThemedText className="text-xl">
                  {team2Name.charAt(0)}
                </ThemedText>
              )}
            </View>
            <ThemedText className="font-bold text-center">
              {team2Name}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderScorecardTab = () => {
    if (!matchData?.score || matchData.score.length === 0) {
      return (
        <View className="items-center py-20 px-6">
          <Ionicons
            name="stats-chart-outline"
            size={48}
            color={isDark ? "gray" : "#ccc"}
          />
          <ThemedText className="mt-4 opacity-60 text-center">
            Detailed scorecard not available yet.
          </ThemedText>
        </View>
      );
    }

    return (
      <View className="px-4 py-6">
        {matchData.score.map((inning, index) => (
          <View
            key={index}
            className={`rounded-2xl p-5 mb-5 ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-sm border border-gray-100 dark:border-gray-800`}
          >
            <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <ThemedText className="font-bold text-lg">
                {inning.inning}
              </ThemedText>
              <ThemedText className="font-bold text-xl text-green-600">
                {inning.r}/{inning.w}{" "}
                <ThemedText className="text-sm opacity-60 font-medium">
                  ({inning.o} ov)
                </ThemedText>
              </ThemedText>
            </View>

            {/* This API returns a somewhat structured string or limited details often. 
                Ideally we'd iterate over batsmen/bowlers if provided. 
                The current type def implies we might just have summary scores.
                If detailed stats are needed, we'd need to check if 'inning' object has arrays. 
                Assuming simple score for now based on 'MatchScore' interface.
            */}
            <View>
              <ThemedText className="opacity-60 text-center italic">
                Detailed batting and bowling stats coming soon...
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      {/* Header with Gradient */}
      <View style={{ paddingTop: 0 }}>
        <LinearGradient
          colors={
            isDark
              ? isLive
                ? CricketColors.gradients.liveCard
                : CricketColors.gradients.headerDark
              : isLive
                ? CricketColors.gradients.liveCard
                : CricketColors.gradients.header
          }
          style={{ paddingTop: insets.top }}
          className="rounded-b-[40px] px-5 pb-8 shadow-lg z-10"
        >
          {/* Header Nav */}
          <View className="flex-row items-center justify-between mb-6 pt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText className="text-white font-bold text-lg opacity-90">
              Match Details
            </ThemedText>
            <TouchableOpacity className="bg-white/20 p-2 rounded-full">
              <Ionicons name="share-social-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Match Summary Card within Header */}
          {loading ? (
            <View className="h-40 items-center justify-center">
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <View className="items-center">
              <ThemedText className="text-white/80 font-medium text-xs uppercase tracking-widest mb-4">
                {matchData?.matchType} • {matchData?.venue.split(",")[0]}
              </ThemedText>

              <View className="flex-row items-center w-full justify-between px-2">
                {/* Team 1 */}
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-white/20 mb-2 overflow-hidden border-2 border-white/30 items-center justify-center">
                    {getCountryFlag(team1Name) ? (
                      <Image
                        source={{ uri: getCountryFlag(team1Name)! }}
                        className="w-full h-full"
                      />
                    ) : (
                      <ThemedText className="text-2xl text-white font-bold">
                        {team1Name.charAt(0)}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText
                    className="text-white font-bold text-base text-center"
                    numberOfLines={1}
                  >
                    {team1Name}
                  </ThemedText>
                </View>

                {/* VS or Live Status */}
                <View className="items-center px-4">
                  {isLive ? (
                    <View className="px-3 py-1 bg-red-600 rounded-full mb-2 border border-white/20 shadow-lg">
                      <ThemedText className="text-white text-xs font-bold animate-pulse">
                        LIVE
                      </ThemedText>
                    </View>
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mb-2">
                      <ThemedText className="text-white font-bold text-xs opacity-80">
                        VS
                      </ThemedText>
                    </View>
                  )}
                  {matchData?.status && (
                    <ThemedText
                      className="text-white/70 text-[10px] text-center max-w-[100px]"
                      numberOfLines={2}
                    >
                      {matchData.status}
                    </ThemedText>
                  )}
                </View>

                {/* Team 2 */}
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-white/20 mb-2 overflow-hidden border-2 border-white/30 items-center justify-center">
                    {getCountryFlag(team2Name) ? (
                      <Image
                        source={{ uri: getCountryFlag(team2Name)! }}
                        className="w-full h-full"
                      />
                    ) : (
                      <ThemedText className="text-2xl text-white font-bold">
                        {team2Name.charAt(0)}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText
                    className="text-white font-bold text-base text-center"
                    numberOfLines={1}
                  >
                    {team2Name}
                  </ThemedText>
                </View>
              </View>

              {/* Scores */}
              <View className="flex-row justify-between w-full mt-6 px-4">
                <View className="items-center flex-1">
                  {score1 ? (
                    <View>
                      <ThemedText className="text-white font-bold text-2xl">
                        {score1.r}/{score1.w}
                      </ThemedText>
                      <ThemedText className="text-white/70 text-xs font-medium text-center">
                        {score1.o} ov
                      </ThemedText>
                    </View>
                  ) : (
                    <ThemedText className="text-white/40 text-xs">
                      Yet to bat
                    </ThemedText>
                  )}
                </View>
                <View className="items-center flex-1">
                  {score2 ? (
                    <View>
                      <ThemedText className="text-white font-bold text-2xl">
                        {score2.r}/{score2.w}
                      </ThemedText>
                      <ThemedText className="text-white/70 text-xs font-medium text-center">
                        {score2.o} ov
                      </ThemedText>
                    </View>
                  ) : (
                    <ThemedText className="text-white/40 text-xs">
                      Yet to bat
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View
        className={`flex-row mx-5 -mt-6 rounded-2xl p-1 shadow-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {DETAIL_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 items-center py-3 rounded-xl ${
                isActive ? "bg-gray-100 dark:bg-gray-700" : "bg-transparent"
              }`}
            >
              <ThemedText
                className={`text-sm font-bold ${
                  isActive ? "text-green-600 dark:text-green-400" : "opacity-60"
                }`}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !matchData ? (
        <View className="flex-1 items-center justify-center p-10">
          {/* Already showing loader in header, this is just fail safe for content area */}
        </View>
      ) : (
        <ScrollView
          className="flex-1 mt-2"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
            />
          }
        >
          {activeTab === "Info" ? renderInfoTab() : renderScorecardTab()}
        </ScrollView>
      )}
    </ThemedView>
  );
}
