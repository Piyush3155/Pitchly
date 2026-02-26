import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/error-state";
import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const loadData = useCallback(async () => {
    try {
      setError(null);
      await initializeCountries();

      // Optimized fetching strategy
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
      setUpcomingMatches(upcoming.slice(0, 10)); // Increased limit

      setTrendingPlayers(players.slice(0, 10));
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load cricket data. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const renderHeader = () => (
    <View style={{ paddingTop: insets.top }} className="pb-4">
      <View className="px-5 flex-row items-center justify-between py-2">
        <View>
          <ThemedText className="text-sm opacity-60 font-medium uppercase tracking-wider">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </ThemedText>
          <ThemedText className="text-3xl font-bold tracking-tight">
            {getGreeting()}
          </ThemedText>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`p-2.5 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2.5 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm relative`}
          >
            <Ionicons
              name="notifications"
              size={20}
              color={isDark ? "#fff" : "#000"}
            />
            <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-gray-900" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const QuickNav = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      className="mb-6"
    >
      {[
        {
          label: "Live",
          icon: "radio",
          color: "#EF4444",
          bg: "rgba(239, 68, 68, 0.1)",
          path: "/live",
        },
        {
          label: "Matches",
          icon: "calendar",
          color: "#3B82F6",
          bg: "rgba(59, 130, 246, 0.1)",
          path: "/matches",
        },
        {
          label: "Teams",
          icon: "people",
          color: "#10B981",
          bg: "rgba(16, 185, 129, 0.1)",
          path: "/teams",
        },
        {
          label: "Series",
          icon: "trophy",
          color: "#F59E0B",
          bg: "rgba(245, 158, 11, 0.1)",
          path: "/series",
        },
      ].map((item, index) => (
        <Link key={index} href={item.path as any} asChild>
          <TouchableOpacity
            className={`flex-row items-center px-4 py-3 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm mr-2`}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: item.bg }}
            >
              <Ionicons name={item.icon as any} size={16} color={item.color} />
            </View>
            <ThemedText className="font-semibold text-sm">
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );

  const renderSkeleton = () => (
    <View className="flex-1">
      {/* Quick Nav Skeleton */}
      <View className="flex-row px-5 gap-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width={100} height={48} borderRadius={16} />
        ))}
      </View>

      {/* Live Matches Skeleton */}
      <View className="px-5 mb-8">
        <View className="flex-row justify-between mb-4">
          <Skeleton width={100} height={20} />
          <Skeleton width={60} height={20} />
        </View>
        <Skeleton width="100%" height={180} borderRadius={24} />
      </View>

      {/* Trending Players Skeleton */}
      <View className="px-5 mb-8">
        <Skeleton width={140} height={24} style={{ marginBottom: 16 }} />
        <View className="flex-row gap-4">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="items-center gap-2">
              <Skeleton width={64} height={64} borderRadius={32} />
              <Skeleton width={60} height={12} />
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Matches Skeleton */}
      <View className="px-5 gap-4">
        <Skeleton width={120} height={24} />
        {[1, 2].map((i) => (
          <Skeleton key={i} width="100%" height={140} borderRadius={24} />
        ))}
      </View>
    </View>
  );

  if (error && !loading && !refreshing && liveMatches.length === 0) {
    return (
      <ThemedView className="flex-1">
        <View className="absolute top-0 left-0 right-0 h-64 bg-green-500/10 dark:bg-green-900/10 -z-10 rounded-b-[40px]" />
        {renderHeader()}
        <View className="flex-1 justify-center px-6">
          <ErrorState message={error} onRetry={loadData} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="absolute top-0 left-0 right-0 h-64 bg-green-500/10 dark:bg-green-900/10 -z-10 rounded-b-[40px]" />

      {renderHeader()}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={CricketColors.primary[500]}
          />
        }
      >
        {loading ? (
          renderSkeleton()
        ) : (
          <Animated.View entering={FadeInDown.duration(600)}>
            <QuickNav />

            {/* Live Matches Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between px-6 mb-4">
                <View className="flex-row items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                  <ThemedText className="text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wide">
                    Live Now
                  </ThemedText>
                </View>
                <Link href="/live" asChild>
                  <TouchableOpacity>
                    <ThemedText className="text-sm font-medium opacity-50">
                      See All
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>

              {liveMatches.length > 0 ? (
                <ScrollView
                  horizontal
                  pagingEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                  decelerationRate="fast"
                >
                  {liveMatches.map((match, index) => (
                    <Animated.View
                      key={match.id}
                      className="w-[60vw] max-w-[200px]"
                      entering={FadeInRight.delay(index * 100).duration(500)}
                    >
                      <Link href={`/match/${match.id}`} asChild>
                        <MatchCard data={match as any} showSeries={false} />
                      </Link>
                    </Animated.View>
                  ))}
                </ScrollView>
              ) : (
                <View className="mx-5 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl items-center border border-dashed border-gray-200 dark:border-gray-700">
                  <Ionicons
                    name="calendar-outline"
                    size={32}
                    color={isDark ? "#4B5563" : "#9CA3AF"}
                    style={{ marginBottom: 8 }}
                  />
                  <ThemedText className="opacity-40 font-medium">
                    No live matches at the moment
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Trending Players */}
            {trendingPlayers.length > 0 && (
              <View className="mb-8">
                <ThemedText className="text-lg font-bold px-6 mb-4">
                  Trending Players
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {trendingPlayers.map((player, index) => (
                    <Animated.View
                      key={player.id}
                      entering={FadeInRight.delay(index * 50).duration(500)}
                    >
                      <TouchableOpacity
                        className={`mr-4 p-3 rounded-2xl items-center w-28 ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
                      >
                        <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                          {getCountryFlag(player.country) ? (
                            <Image
                              source={{
                                uri: getCountryFlag(player.country) || "",
                              }}
                              className="w-full h-full"
                              contentFit="cover"
                              transition={1000}
                            />
                          ) : (
                            <View className="w-full h-full items-center justify-center bg-green-100 dark:bg-green-900/30">
                              <ThemedText className="text-xl">👤</ThemedText>
                            </View>
                          )}
                        </View>
                        <ThemedText
                          className="font-bold text-center text-xs mb-1"
                          numberOfLines={1}
                        >
                          {player.name.split(" ").pop()}
                        </ThemedText>
                        <ThemedText className="text-[10px] opacity-50 text-center font-medium uppercase tracking-wider">
                          {player.country || "INTL"}
                        </ThemedText>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Upcoming Matches */}
            <View className="px-2">
              <View className="flex-row items-center justify-between px-4 mb-4">
                <ThemedText className="text-lg font-bold">Upcoming</ThemedText>
                <Link href="/matches" asChild>
                  <TouchableOpacity className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <ThemedText className="text-xs font-bold opacity-60">
                      View Schedule
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>

              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match, index) => (
                  <Animated.View
                    key={match.id}
                    entering={FadeInDown.delay(index * 100).duration(600)}
                  >
                    <Link href={`/match/${match.id}`} asChild>
                      <MatchCard data={match as any} showSeries={false} />
                    </Link>
                  </Animated.View>
                ))
              ) : (
                <View className="mx-4 p-6 rounded-2xl items-center bg-gray-50 dark:bg-gray-800/50">
                  <Ionicons
                    name="time-outline"
                    size={32}
                    color={isDark ? "#4B5563" : "#9CA3AF"}
                    style={{ marginBottom: 8 }}
                  />
                  <ThemedText className="opacity-50">
                    No upcoming matches scheduled
                  </ThemedText>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
