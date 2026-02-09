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
    getCountryFlag,
    getMatchTypeBadgeColor,
    initializeCountries,
    isMatchLive,
    Match,
} from "@/services/cricapi";

export default function LiveScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async () => {
    try {
      await initializeCountries();
      const data = await fetchCurrentMatches();
      const liveMatches = data.filter((m) => isMatchLive(m.status));
      setMatches(liveMatches);
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
  }, []);

  useEffect(() => {
    loadMatches();
    // Auto-refresh every 60 seconds (to respect API limits better)
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatScoreStr = (s?: { r: number; w: number; o: number }) =>
    s ? `${s.r}/${s.w} (${s.o} ov)` : null;

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        <View className="flex-row items-center pt-3">
          <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <ThemedText className="text-xl font-bold text-white">
            Live Matches
          </ThemedText>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A651" />
          <ThemedText className="mt-4 opacity-60">
            Loading live matches...
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
                  No Live Matches
                </ThemedText>
                <ThemedText className="text-sm opacity-60 text-center">
                  There are no live matches at the moment.{"\n"}Pull down to
                  refresh.
                </ThemedText>
              </View>
            ) : (
              matches.map((match) => {
                const team1Name = match.teams[0] || "Team 1";
                const team2Name = match.teams[1] || "Team 2";

                const score1 =
                  match.score?.find((s) => s.inning.includes(team1Name)) ||
                  match.score?.[0];
                const score2 =
                  match.score?.find((s) => s.inning.includes(team2Name)) ||
                  match.score?.[1];

                return (
                  <TouchableOpacity
                    key={match.id}
                    className={`mb-4 rounded-2xl overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } shadow-lg shadow-black/10 elevation-4`}
                  >
                    {/* Match Header */}
                    <View
                      className={`px-4 py-2.5 flex-row justify-between items-center border-b ${
                        isDark
                          ? "border-gray-700 bg-gray-700/50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="bg-red-500 px-2 py-0.5 rounded mr-2">
                          <ThemedText className="text-xs font-bold text-white uppercase">
                            ● LIVE
                          </ThemedText>
                        </View>
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
                          className="text-xs opacity-50 pl-2"
                          numberOfLines={1}
                        >
                          {match.venue?.split(",")[0]}
                        </ThemedText>
                      </View>
                    </View>

                    {/* Teams & Scores */}
                    <View className="p-4">
                      {/* Team 1 */}
                      <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 mr-3 items-center justify-center">
                            {getCountryFlag(team1Name) ? (
                              <Image
                                source={{
                                  uri: getCountryFlag(team1Name) || "",
                                }}
                                className="w-10 h-8 rounded-sm"
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <ThemedText className="font-bold text-lg">
                                  {team1Name.charAt(0)}
                                </ThemedText>
                              </View>
                            )}
                          </View>
                          <View className="flex-1">
                            <ThemedText className="font-semibold text-base">
                              {team1Name}
                            </ThemedText>
                          </View>
                        </View>
                        {score1 && (
                          <View className="items-end">
                            <ThemedText className="font-bold text-xl">
                              {formatScoreStr(score1)}
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      {/* Team 2 */}
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 mr-3 items-center justify-center">
                            {getCountryFlag(team2Name) ? (
                              <Image
                                source={{
                                  uri: getCountryFlag(team2Name) || "",
                                }}
                                className="w-10 h-8 rounded-sm"
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <ThemedText className="font-bold text-lg">
                                  {team2Name.charAt(0)}
                                </ThemedText>
                              </View>
                            )}
                          </View>
                          <View className="flex-1">
                            <ThemedText className="font-semibold text-base">
                              {team2Name}
                            </ThemedText>
                          </View>
                        </View>
                        {score2 && (
                          <View className="items-end">
                            <ThemedText className="font-bold text-xl">
                              {formatScoreStr(score2)}
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      {/* Match Status */}
                      <View className="mt-3 pt-3 border-t border-gray-200/30">
                        <ThemedText className="text-sm font-medium text-green-600">
                          {match.status}
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
