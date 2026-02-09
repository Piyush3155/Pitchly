import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    fetchCurrentMatches,
    fetchMatches,
    getCountryFlag,
    getMatchTypeBadgeColor,
    initializeCountries,
    isMatchLive,
    isMatchUpcoming,
    Match,
} from "@/services/cricapi";

const TABS = ["Live", "Upcoming", "Recent"];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async (tabIndex: number = activeTab) => {
    setLoading(true);
    try {
      await initializeCountries();
      let data: Match[] = [];

      const [current, allMatches] = await Promise.all([
        fetchCurrentMatches(),
        fetchMatches(),
      ]);

      switch (tabIndex) {
        case 0: // Live
          data = current.filter((m) => isMatchLive(m.status));
          break;
        case 1: // Upcoming
          data = allMatches
            .filter((m) => isMatchUpcoming(m.status))
            .filter(
              (m) =>
                !current.find((c) => c.id === m.id && isMatchLive(c.status)),
            );
          break;
        case 2: // Recent
          // Filter for completed matches (not live and not upcoming)
          // We can check if status indicates a result
          data = current.filter(
            (m) =>
              !isMatchLive(m.status) &&
              !isMatchUpcoming(m.status) &&
              (m.status.includes("won") ||
                m.status.includes("lost") ||
                m.status.includes("draw") ||
                m.status.includes("tied")),
          );
          if (data.length === 0) {
            // Fallback: use allMatches that are not upcoming
            data = allMatches.filter(
              (m) => !isMatchUpcoming(m.status) && !isMatchLive(m.status),
            );
          }
          break;
      }
      setMatches(data);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, [activeTab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    loadMatches(index);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        <View className="flex-row items-center justify-between pt-3">
          <ThemedText className="text-xl font-bold text-white">
            Matches
          </ThemedText>
          <TouchableOpacity>
            <Ionicons name="filter" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row mt-4 gap-2">
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabChange(index)}
              className={`px-4 py-2 rounded-full ${
                activeTab === index ? "bg-white" : "bg-white/20"
              }`}
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  activeTab === index ? "text-green-600" : "text-white"
                }`}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A651" />
          <ThemedText className="mt-4 opacity-60">
            Loading matches...
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00A651"
            />
          }
        >
          <View className="p-4">
            {matches.length === 0 ? (
              <View className="items-center py-20">
                <ThemedText className="text-5xl mb-4">🏏</ThemedText>
                <ThemedText className="text-lg font-semibold mb-2">
                  No Matches Found
                </ThemedText>
                <ThemedText className="text-sm opacity-60 text-center">
                  No {TABS[activeTab].toLowerCase()} matches available.{"\n"}
                  Pull down to refresh.
                </ThemedText>
              </View>
            ) : (
              matches.map((match) => {
                const isLive = isMatchLive(match.status);
                const team1Name = match.teams[0] || "Team 1";
                const team2Name = match.teams[1] || "Team 2";

                const score1 =
                  match.score?.find((s) => s.inning.includes(team1Name)) ||
                  match.score?.[0];
                const score2 =
                  match.score?.find((s) => s.inning.includes(team2Name)) ||
                  match.score?.[1];

                const formatScoreStr = (s?: {
                  r: number;
                  w: number;
                  o: number;
                }) => (s ? `${s.r}/${s.w} (${s.o} ov)` : null);

                return (
                  <TouchableOpacity
                    key={match.id}
                    className={`mb-3 rounded-2xl overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } shadow-md shadow-black/8 elevation-3`}
                  >
                    {/* Match Header */}
                    <View
                      className={`px-4 py-2 flex-row justify-between items-center ${
                        isDark ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <View
                          style={{
                            backgroundColor: getMatchTypeBadgeColor(
                              match.matchType,
                            ),
                          }}
                          className="px-2 py-0.5 rounded mr-2"
                        >
                          <ThemedText className="text-xs font-bold text-white uppercase">
                            {match.matchType}
                          </ThemedText>
                        </View>
                        <ThemedText
                          className={`text-xs font-bold uppercase ${isLive ? "text-red-500" : "text-gray-500"}`}
                        >
                          {isLive
                            ? "● LIVE"
                            : activeTab === 1
                              ? "UPCOMING"
                              : "FINISHED"}
                        </ThemedText>
                      </View>
                      <ThemedText
                        className="text-xs opacity-50 pl-2"
                        numberOfLines={1}
                      >
                        {match.venue?.split(",")[0]}
                      </ThemedText>
                    </View>

                    {/* Teams & Scores */}
                    <View className="p-4">
                      {/* Team 1 */}
                      <View className="flex-row justify-between items-center mb-2.5">
                        <View className="flex-row items-center flex-1">
                          <View className="w-8 h-8 mr-3 items-center justify-center">
                            {getCountryFlag(team1Name) ? (
                              <Image
                                source={{
                                  uri: getCountryFlag(team1Name) || "",
                                }}
                                className="w-8 h-6 rounded-sm"
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <ThemedText className="font-bold">
                                  {team1Name.charAt(0)}
                                </ThemedText>
                              </View>
                            )}
                          </View>
                          <ThemedText
                            className="font-semibold text-base flex-1"
                            numberOfLines={1}
                          >
                            {team1Name}
                          </ThemedText>
                        </View>
                        {score1 && (
                          <View className="items-end">
                            <ThemedText className="font-bold text-base">
                              {formatScoreStr(score1)}
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      {/* Team 2 */}
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                          <View className="w-8 h-8 mr-3 items-center justify-center">
                            {getCountryFlag(team2Name) ? (
                              <Image
                                source={{
                                  uri: getCountryFlag(team2Name) || "",
                                }}
                                className="w-8 h-6 rounded-sm"
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <ThemedText className="font-bold">
                                  {team2Name.charAt(0)}
                                </ThemedText>
                              </View>
                            )}
                          </View>
                          <ThemedText
                            className="font-semibold text-base flex-1"
                            numberOfLines={1}
                          >
                            {team2Name}
                          </ThemedText>
                        </View>
                        {score2 && (
                          <View className="items-end">
                            <ThemedText className="font-bold text-base">
                              {formatScoreStr(score2)}
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      {/* Venue & Status */}
                      <View className="mt-3 pt-3 border-t border-gray-200/30">
                        <ThemedText
                          className={`text-sm font-medium ${
                            isLive
                              ? "text-green-600"
                              : activeTab === 1
                                ? "text-blue-500"
                                : "text-gray-500"
                          }`}
                        >
                          {match.status}
                          {activeTab === 1 &&
                            match.date &&
                            ` • ${formatDate(match.dateTimeGMT || match.date)}`}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Bottom Spacer for Tab Bar */}
          <View className="h-24" />
        </ScrollView>
      )}
    </ThemedView>
  );
}
