import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  fetchPlayers,
  getCountryFlag,
  getMatchTypeBadgeColor,
  initializeCountries,
  isMatchLive,
  isMatchUpcoming,
  Match,
  Player,
} from "@/services/cricapi";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [trendingPlayers, setTrendingPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeCountries();

        const [current, allMatches, players] = await Promise.all([
          fetchCurrentMatches(),
          fetchMatches(),
          fetchPlayers(),
        ]);

        // Filter live matches
        const live = current.filter((m) => isMatchLive(m.status));
        setLiveMatches(live.slice(0, 3));

        // Filter upcoming matches
        const upcoming = allMatches
          .filter((m) => isMatchUpcoming(m.status))
          .filter((m) => !live.find((l) => l.id === m.id)); // Avoid duplicates
        setUpcomingMatches(upcoming.slice(0, 3));

        setTrendingPlayers(players.slice(0, 10));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const renderMatchCard = (match: Match, isLive: boolean = true) => {
    const team1Name = match.teams[0] || "Team 1";
    const team2Name = match.teams[1] || "Team 2";

    // Attempt to find scores for each team based on inning name
    // Note: This logic assumes inning name contains team name
    const score1 =
      match.score?.find((s) => s.inning.includes(team1Name)) ||
      match.score?.[0];
    const score2 =
      match.score?.find((s) => s.inning.includes(team2Name)) ||
      match.score?.[1];

    const formatScoreStr = (s?: { r: number; w: number; o: number }) =>
      s ? `${s.r}/${s.w} (${s.o} ov)` : null;

    return (
      <Link key={match.id} href={isLive ? "/live" : "/matches"} asChild>
        <TouchableOpacity
          className={`mb-3 rounded-2xl overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg shadow-black/10 elevation-4`}
        >
          {/* Match Header */}
          <View
            className={`px-4 py-2 flex-row justify-between items-center ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <View className="flex-row items-center">
              <View
                style={{
                  backgroundColor: getMatchTypeBadgeColor(match.matchType),
                }}
                className="px-2 py-0.5 rounded mr-2"
              >
                <ThemedText className="text-xs font-bold text-white uppercase">
                  {match.matchType}
                </ThemedText>
              </View>
              <ThemedText className="text-xs opacity-60 font-bold">
                {isLive ? "● LIVE" : "UPCOMING"}
              </ThemedText>
            </View>
            <ThemedText className="text-xs opacity-50" numberOfLines={1}>
              {match.venue?.split(",")[0]}
            </ThemedText>
          </View>

          {/* Teams & Scores */}
          <View className="p-4">
            {/* Team 1 */}
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 mr-3 items-center justify-center">
                  {getCountryFlag(team1Name) ? (
                    <Image
                      source={{ uri: getCountryFlag(team1Name) || "" }}
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
                  className="font-bold text-base flex-1"
                  numberOfLines={1}
                >
                  {team1Name}
                </ThemedText>
              </View>
              {score1 && (
                <View className="items-end">
                  <ThemedText className="font-bold text-lg">
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
                      source={{ uri: getCountryFlag(team2Name) || "" }}
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
                  className="font-bold text-base flex-1"
                  numberOfLines={1}
                >
                  {team2Name}
                </ThemedText>
              </View>
              {score2 && (
                <View className="items-end">
                  <ThemedText className="font-bold text-lg">
                    {formatScoreStr(score2)}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Status */}
            <View className="mt-3 pt-3 border-t border-gray-200/30">
              <ThemedText
                className={`text-sm font-medium ${isLive ? "text-green-600" : "text-blue-500"}`}
              >
                {match.status}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        <View className="flex-row items-center justify-between pt-3">
          <View className="flex-row items-center">
            <ThemedText className="text-2xl font-bold text-white">
              🏏 CricScore
            </ThemedText>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#00A651" />
            <ThemedText className="mt-4 opacity-60">Loading...</ThemedText>
          </View>
        ) : (
          <>
            {/* Live Matches Section */}
            <View className="px-4 pt-5 pb-3">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                  <ThemedText className="text-lg font-bold">
                    Live Matches
                  </ThemedText>
                </View>
                <Link href="/live" asChild>
                  <TouchableOpacity className="flex-row items-center">
                    <ThemedText className="text-green-600 text-sm font-semibold mr-1">
                      View All
                    </ThemedText>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#00A651"
                    />
                  </TouchableOpacity>
                </Link>
              </View>

              {liveMatches.length === 0 ? (
                <View
                  className={`p-6 rounded-2xl items-center ${
                    isDark ? "bg-gray-800" : "bg-white"
                  } shadow-md shadow-black/5 elevation-2`}
                >
                  <ThemedText className="text-3xl mb-2">🏏</ThemedText>
                  <ThemedText className="text-sm opacity-60 text-center">
                    No live matches right now
                  </ThemedText>
                </View>
              ) : (
                liveMatches.map((match) => renderMatchCard(match, true))
              )}
            </View>

            {/* Quick Actions */}
            <View className="px-4 py-4">
              <ThemedText className="text-lg font-bold mb-4">
                Quick Access
              </ThemedText>
              <View className="flex-row justify-between">
                {[
                  {
                    icon: "radio",
                    label: "Live",
                    color: "#EF4444",
                    href: "/live",
                  },
                  {
                    icon: "baseball",
                    label: "Matches",
                    color: "#3B82F6",
                    href: "/matches",
                  },
                  {
                    icon: "people",
                    label: "Teams",
                    color: "#10B981",
                    href: "/teams",
                  },
                  {
                    icon: "trophy",
                    label: "Series",
                    color: "#F59E0B",
                    href: "/series",
                  },
                ].map((item) => (
                  <Link key={item.label} href={item.href as any} asChild>
                    <TouchableOpacity
                      className={`flex-1 mx-1 items-center p-4 rounded-2xl ${
                        isDark ? "bg-gray-800" : "bg-white"
                      } shadow-md shadow-black/5 elevation-2`}
                    >
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={24}
                          color={item.color}
                        />
                      </View>
                      <ThemedText className="text-xs font-semibold">
                        {item.label}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </View>

            {/* Trending Players */}
            {trendingPlayers.length > 0 && (
              <View className="px-4 py-4">
                <View className="flex-row items-center justify-between mb-4">
                  <ThemedText className="text-lg font-bold">
                    Featured Players
                  </ThemedText>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="-mx-4 px-4"
                >
                  {trendingPlayers.map((player) => (
                    <TouchableOpacity
                      key={player.id}
                      className={`w-28 mr-3 p-4 rounded-2xl items-center ${
                        isDark ? "bg-gray-800" : "bg-white"
                      } shadow-md shadow-black/5 elevation-2`}
                    >
                      <View className="w-14 h-14 rounded-full bg-green-100 items-center justify-center mb-2 overflow-hidden">
                        {getCountryFlag(player.country) ? (
                          <Image
                            source={{
                              uri: getCountryFlag(player.country) || "",
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <ThemedText className="text-2xl">👤</ThemedText>
                        )}
                      </View>
                      <ThemedText
                        className="font-semibold text-xs text-center"
                        numberOfLines={2}
                      >
                        {player.name}
                      </ThemedText>
                      {player.country && (
                        <ThemedText
                          className="text-xs opacity-50 text-center"
                          numberOfLines={1}
                        >
                          {player.country}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <View className="px-4 py-4">
                <View className="flex-row items-center justify-between mb-4">
                  <ThemedText className="text-lg font-bold">
                    Upcoming Matches
                  </ThemedText>
                  <Link href="/matches" asChild>
                    <TouchableOpacity className="flex-row items-center">
                      <ThemedText className="text-green-600 text-sm font-semibold mr-1">
                        View All
                      </ThemedText>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color="#00A651"
                      />
                    </TouchableOpacity>
                  </Link>
                </View>

                {upcomingMatches.map((match) => renderMatchCard(match, false))}
              </View>
            )}
          </>
        )}

        {/* Bottom Spacer for Tab Bar */}
        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}
