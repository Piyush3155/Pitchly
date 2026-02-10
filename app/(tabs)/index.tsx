import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    fetchCurrentMatches,
    fetchMatches,
    fetchPlayers,
    getCountryFlag,
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
        setLiveMatches(live.slice(0, 5));

        // Filter upcoming matches
        const upcoming = allMatches
          .filter((m) => isMatchUpcoming(m.status))
          .filter((m) => !live.find((l) => l.id === m.id)); // Avoid duplicates
        setUpcomingMatches(upcoming.slice(0, 5));

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

  return (
    <ThemedView className="flex-1">
      {/* Premium Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? CricketColors.gradients.headerDark
              : CricketColors.gradients.header
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-6 pt-4 rounded-b-3xl shadow-lg z-10"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <ThemedText className="text-2xl font-bold text-white tracking-tight">
                🏏 CricScore
              </ThemedText>
            </View>
            <View className="flex-row gap-4">
              <TouchableOpacity className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <Ionicons name="search-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting / Subheader */}
          <ThemedText className="text-white/80 text-sm mt-1 font-medium">
            Welcome to the home of cricket
          </ThemedText>
        </LinearGradient>
      </View>

      <ScrollView
        className="flex-1 -mt-4 bg-transparent"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading ? (
          <View className="items-center py-20 mt-10">
            <ActivityIndicator
              size="large"
              color={CricketColors.primary[500]}
            />
            <ThemedText className="mt-4 opacity-60 font-medium">
              Loading the action...
            </ThemedText>
          </View>
        ) : (
          <View className="pt-8">
            {/* Quick Actions */}
            <View className="px-4 mb-6">
              <View className="flex-row justify-between">
                {[
                  {
                    icon: "radio",
                    label: "Live",
                    color: CricketColors.status.live,
                    href: "/live",
                  },
                  {
                    icon: "baseball",
                    label: "Matches",
                    color: CricketColors.status.upcoming,
                    href: "/matches",
                  },
                  {
                    icon: "people",
                    label: "Teams",
                    color: CricketColors.accent.teal,
                    href: "/teams",
                  },
                  {
                    icon: "trophy",
                    label: "Series",
                    color: CricketColors.accent.amber,
                    href: "/series",
                  },
                ].map((item) => (
                  <Link key={item.label} href={item.href as any} asChild>
                    <TouchableOpacity
                      className={`flex-1 mx-1.5 items-center p-3 rounded-2xl ${
                        isDark ? "bg-gray-800" : "bg-white"
                      } shadow-sm elevation-3`}
                    >
                      <View
                        className="w-12 h-12 rounded-2xl items-center justify-center mb-2 shadow-inner"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={24}
                          color={item.color}
                        />
                      </View>
                      <ThemedText className="text-xs font-bold opacity-80">
                        {item.label}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </View>

            {/* Live Matches Section */}
            <View className="mb-2">
              <View className="flex-row items-center justify-between px-5 mb-3">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                  <ThemedText className="text-lg font-bold tracking-tight">
                    Live Action
                  </ThemedText>
                </View>
                <Link href="/live" asChild>
                  <TouchableOpacity className="flex-row items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <ThemedText className="text-green-600 dark:text-green-400 text-xs font-bold mr-1">
                      View All
                    </ThemedText>
                    <Ionicons
                      name="chevron-forward"
                      size={12}
                      color={isDark ? "#4ade80" : "#059669"}
                    />
                  </TouchableOpacity>
                </Link>
              </View>

              {liveMatches.length === 0 ? (
                <View className="mx-4 p-8 rounded-3xl items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <ThemedText className="text-4xl mb-3 opacity-80">
                    🏏
                  </ThemedText>
                  <ThemedText className="text-base font-semibold opacity-70">
                    No live matches right now
                  </ThemedText>
                  <ThemedText className="text-xs opacity-50 text-center mt-1">
                    Check back later for live action
                  </ThemedText>
                </View>
              ) : (
                <View>
                  {liveMatches.map((match) => (
                    <Link key={match.id} href={`/match/${match.id}`} asChild>
                      <MatchCard data={match as any} showSeries={false} />
                    </Link>
                  ))}
                </View>
              )}
            </View>

            {/* Trending Players */}
            {trendingPlayers.length > 0 && (
              <View className="mb-6 mt-2">
                <View className="px-5 mb-4">
                  <ThemedText className="text-lg font-bold tracking-tight">
                    Featured Players
                  </ThemedText>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {trendingPlayers.map((player) => (
                    <TouchableOpacity
                      key={player.id}
                      className="mr-4 items-center"
                    >
                      <View className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 p-0.5 border-2 border-green-500 overflow-hidden mb-2 shadow-sm">
                        {getCountryFlag(player.country) ? (
                          <Image
                            source={{
                              uri: getCountryFlag(player.country) || "",
                            }}
                            className="w-full h-full rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-full h-full bg-gray-300 dark:bg-gray-700 items-center justify-center rounded-full">
                            <ThemedText className="text-2xl">👤</ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText
                        className="font-semibold text-xs text-center w-20"
                        numberOfLines={1}
                      >
                        {player.name}
                      </ThemedText>
                      <ThemedText
                        className="text-[10px] opacity-50 text-center w-20 uppercase tracking-widest font-bold"
                        numberOfLines={1}
                      >
                        {player.country || "INTL"}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Upcoming Matches */}
            <View>
              <View className="flex-row items-center justify-between px-5 mb-3">
                <ThemedText className="text-lg font-bold tracking-tight">
                  Upcoming Fixtures
                </ThemedText>
                <Link href="/matches" asChild>
                  <TouchableOpacity className="flex-row items-center">
                    <ThemedText className="text-blue-500 text-xs font-bold mr-1">
                      See Schedule
                    </ThemedText>
                    <Ionicons
                      name="chevron-forward"
                      size={12}
                      color="#3B82F6"
                    />
                  </TouchableOpacity>
                </Link>
              </View>

              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <Link key={match.id} href={`/match/${match.id}`} asChild>
                    <MatchCard data={match as any} showSeries={false} />
                  </Link>
                ))
              ) : (
                <View className="mx-4 p-6 rounded-2xl items-center bg-gray-50 dark:bg-gray-800/50">
                  <ThemedText className="opacity-50">
                    No upcoming matches
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
